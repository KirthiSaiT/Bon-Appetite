-- Cafe page content the admin can edit: fresh pasta items (price, photo, recipe)
-- and the "Order from the cafe" text + delivery-app links. Safe to re-run.

create table if not exists public.cafe_pastas (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null check (length(trim(name)) between 1 and 80),
  description        text,
  price              numeric(10,2) not null check (price >= 0),
  price_note         text,
  image              text not null default '/freshpasta.webp',
  recipe_title       text,
  recipe_ingredients text,          -- one ingredient per line
  recipe_steps       text,          -- one step per line
  is_active          boolean not null default true,
  sort               int not null default 0,
  created_at         timestamptz not null default now()
);

create table if not exists public.site_settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.cafe_pastas   enable row level security;
alter table public.site_settings enable row level security;

grant select on public.cafe_pastas, public.site_settings to anon, authenticated;
grant insert, update, delete on public.cafe_pastas, public.site_settings to authenticated;

drop policy if exists "cafe pastas readable by everyone" on public.cafe_pastas;
create policy "cafe pastas readable by everyone" on public.cafe_pastas
  for select using (is_active or public.is_admin());

drop policy if exists "cafe pastas managed by admin" on public.cafe_pastas;
create policy "cafe pastas managed by admin" on public.cafe_pastas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings readable by everyone" on public.site_settings;
create policy "settings readable by everyone" on public.site_settings
  for select using (true);

drop policy if exists "settings managed by admin" on public.site_settings;
create policy "settings managed by admin" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Seed: ordering text + empty delivery links (admin fills these in) ──
insert into public.site_settings (key, value) values
  ('cafe.order_intro', 'Craving it hot? Order cooked pasta straight from our Hyderabad kitchen on your favourite delivery app, or pick up our handmade pasta online.'),
  ('cafe.zomato_url',  ''),
  ('cafe.swiggy_url',  ''),
  ('cafe.amazon_url',  ''),
  ('cafe.zomato_logo', ''),
  ('cafe.swiggy_logo', ''),
  ('cafe.amazon_logo', '')
on conflict (key) do nothing;

-- ── Seed: starter fresh pasta items (edit or replace them in Admin → Cafe) ──
insert into public.cafe_pastas (name, description, price, price_note, sort, recipe_title, recipe_ingredients, recipe_steps)
select * from (values
  ('Fettucine', 'Flat ribbons for creamy and hearty sauces.', 250, '250g pack', 1,
   'Tomato & basil pomodoro',
   E'250g fresh fettucine\n500g ripe tomatoes, chopped\n3 tbsp olive oil\n1 small onion, finely chopped\n3 garlic cloves, crushed\n10 basil leaves\nSalt, to taste',
   E'Soften the onion in the oil for 5 minutes.\nAdd the garlic, then the tomatoes and a pinch of salt. Simmer for 15 minutes.\nBoil salted water and cook the pasta for 5 minutes. Drain.\nTear in the basil, toss the pasta through the sauce and serve.'),
  ('Spaghetti', 'Long, thin strands for classic Italian dishes.', 250, '250g pack', 2,
   'Aglio e olio',
   E'250g fresh spaghetti\n4 tbsp olive oil\n5 garlic cloves, thinly sliced\n1 tsp chilli flakes\n2 tbsp parsley or coriander\nSalt, to taste',
   E'Warm the oil and garlic together on low heat until pale gold.\nCook the pasta in salted water for 5 minutes. Save a cup of pasta water.\nAdd the chilli, pasta and a splash of pasta water to the pan. Toss for a minute.\nScatter over the herbs and serve.'),
  ('Ravioli', 'Stuffed pasta — ricotta spinach or chicken cheese.', 250, '250g pack', 3,
   'Brown butter & walnuts',
   E'250g fresh ravioli\n3 tbsp butter\n30g walnuts, chopped\n1 lemon, zest and juice\nSalt, to taste',
   E'Toast the walnuts in a dry pan for 2 minutes and set aside.\nMelt the butter until it foams and smells nutty.\nCook the ravioli in salted water for 5 minutes and drain gently.\nToss in the butter and finish with lemon and walnuts.')
) as seed(name, description, price, price_note, sort, recipe_title, recipe_ingredients, recipe_steps)
where not exists (select 1 from public.cafe_pastas);
