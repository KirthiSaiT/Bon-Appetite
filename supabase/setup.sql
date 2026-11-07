-- Bon Appetit · database setup
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run: tables use IF NOT EXISTS and seed rows use ON CONFLICT.

-- ── Admin check ─────────────────────────────────────────────
-- Clerk signs a "supabase" JWT template that carries the user's primary email.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = 'admin.bonappetit@gmail.com', false);
$$;

-- ── Prices (one row per editable price) ─────────────────────
create table if not exists public.prices (
  key         text primary key,
  label       text not null,
  category    text not null,
  amount      numeric(10,2) not null check (amount >= 0),
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

-- ── Workshops ───────────────────────────────────────────────
create table if not exists public.workshops (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  workshop_date date not null,
  time_label    text not null default '11:00 AM – 1:30 PM IST',
  venue         text not null default 'Online (Zoom)',
  price         numeric(10,2) not null check (price >= 0),
  seats         int check (seats is null or seats > 0),
  tag           text not null default 'Online',
  image         text not null default '/pastaworkshop.webp',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ── Workshop bookings ───────────────────────────────────────
create table if not exists public.workshop_bookings (
  id             uuid primary key default gen_random_uuid(),
  workshop_id    uuid references public.workshops(id) on delete set null,
  workshop_title text not null,
  workshop_date  date not null,
  name           text not null check (length(trim(name)) between 1 and 120),
  phone          text not null check (length(trim(phone)) between 6 and 20),
  email          text check (email is null or length(email) <= 200),
  people         int not null default 1 check (people between 1 and 20),
  notes          text check (notes is null or length(notes) <= 1000),
  status         text not null default 'new' check (status in ('new', 'confirmed', 'cancelled')),
  created_at     timestamptz not null default now()
);

-- Razorpay payment fields (added after the initial release; safe to re-run).
alter table public.workshop_bookings add column if not exists amount              numeric(10,2);
alter table public.workshop_bookings add column if not exists paid                boolean not null default false;
alter table public.workshop_bookings add column if not exists razorpay_order_id   text;
alter table public.workshop_bookings add column if not exists razorpay_payment_id text;

-- ── Row level security ──────────────────────────────────────
alter table public.prices            enable row level security;
alter table public.workshops         enable row level security;
alter table public.workshop_bookings enable row level security;

grant select on public.prices, public.workshops to anon, authenticated;
grant insert, update, delete on public.prices, public.workshops to authenticated;
grant insert on public.workshop_bookings to anon, authenticated;
grant select, update, delete on public.workshop_bookings to authenticated;

drop policy if exists "prices readable by everyone" on public.prices;
create policy "prices readable by everyone" on public.prices
  for select using (true);

drop policy if exists "prices managed by admin" on public.prices;
create policy "prices managed by admin" on public.prices
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "active workshops readable by everyone" on public.workshops;
create policy "active workshops readable by everyone" on public.workshops
  for select using (is_active or public.is_admin());

drop policy if exists "workshops managed by admin" on public.workshops;
create policy "workshops managed by admin" on public.workshops
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anyone can book" on public.workshop_bookings;
create policy "anyone can book" on public.workshop_bookings
  for insert with check (status = 'new');

drop policy if exists "bookings visible to admin" on public.workshop_bookings;
create policy "bookings visible to admin" on public.workshop_bookings
  for select to authenticated using (public.is_admin());

drop policy if exists "bookings managed by admin" on public.workshop_bookings;
create policy "bookings managed by admin" on public.workshop_bookings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "bookings deleted by admin" on public.workshop_bookings;
create policy "bookings deleted by admin" on public.workshop_bookings
  for delete to authenticated using (public.is_admin());

-- ── Seed: current menu prices ───────────────────────────────
insert into public.prices (key, label, category, amount, sort) values
  ('fresh.25',     'Fresh pasta · 25g',              'Fresh Pasta',      30,  1),
  ('fresh.50',     'Fresh pasta · 50g',              'Fresh Pasta',      60,  2),
  ('fresh.100',    'Fresh pasta · 100g',             'Fresh Pasta',     100,  3),
  ('fresh.250',    'Fresh pasta · 250g',             'Fresh Pasta',     250,  4),
  ('sauce.s009',   'Tomato Basil Sauce · per 200ml', 'Seasonal Sauces', 150, 10),
  ('sauce.s010',   'Arrabbiata · per 200ml',         'Seasonal Sauces', 150, 11),
  ('sauce.s011',   'Pesto · per 200ml',              'Seasonal Sauces', 180, 12),
  ('combo.standard','Standard combo',                'Cooked Pasta',    250, 20),
  ('combo.ravioli','Ravioli combo',                  'Cooked Pasta',    300, 21),
  ('extra.sauce',  'Extra sauce',                    'Cooked Pasta',     70, 22),
  ('extra.cheese', 'Extra cheese',                   'Cooked Pasta',     50, 23),
  ('dessert.d001', 'Brownie · each',                 'Dessert Platters',100, 30),
  ('dessert.d002', 'Walnut Brownie · each',          'Dessert Platters',120, 31),
  ('dessert.d003', 'Chocolate Lava Cake · each',     'Dessert Platters', 90, 32),
  ('dessert.d004', 'Ice cream - Vanilla · each',     'Dessert Platters', 40, 33),
  ('dessert.d005', 'Ice cream - Chocolate · each',   'Dessert Platters', 50, 34)
on conflict (key) do nothing;

-- ── Seed: the 28 November workshop ──────────────────────────
insert into public.workshops (title, description, workshop_date, time_label, venue, price, tag, image)
select
  'Fettucine & Farfalle from Scratch',
  'Learn two pastas from scratch (serves 4), plus an Italian sauce. No fancy equipment needed.',
  date '2026-11-28',
  '11:00 AM – 1:30 PM IST',
  'Online (Zoom)',
  599,
  'Online',
  '/pastaworkshop.webp'
where not exists (
  select 1 from public.workshops where workshop_date = date '2026-11-28'
);

-- ── Seed: the 21 November in-person workshop (Hyderabad) ─────
insert into public.workshops (title, description, workshop_date, time_label, venue, price, tag, image)
select
  'Fettuccine & Spaghetti from Scratch',
  'A fun, hands-on session — make fresh Fettuccine & Spaghetti yourself, plus a homemade Marinara sauce.',
  date '2026-11-21',
  '3:00 PM – 5:00 PM IST',
  'Urban Sprout, Kondapur, Hyderabad',
  999,
  'In-person',
  '/pastaworkshop.webp'
where not exists (
  select 1 from public.workshops where workshop_date = date '2026-11-21'
);
