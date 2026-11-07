/* Admin panel — only for the verified admin email. The UI gate is a convenience;
 * every write is enforced again by row level security in Supabase. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SignInButton } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  CalendarDays, Plus, Pencil, Trash2, Loader2, ShieldAlert, ShieldCheck, Save, X, IndianRupee, Users, ImageUp, RotateCcw,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useIsAdmin } from "@/hooks/use-admin";
import { useSupabase, supabaseConfigured } from "@/lib/supabase";
import { PRICES_KEY, WORKSHOPS_KEY, PriceRow, Workshop, parseDay, toDay } from "@/hooks/use-menu-data";

const inputCls =
  "w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm";
const labelCls = "block text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 mb-1.5";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";
const ghostBtn =
  "inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-stone-300 hover:border-stone-900 rounded-lg text-sm font-semibold text-stone-700 whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";

const rlsHint =
  "Supabase rejected the change. Check that Clerk is added under Supabase → Authentication → Third-party Auth, and that setup.sql has been run.";

/** Turn Supabase / PostgREST error codes into a plain next step for the admin. */
const explain = (e: unknown): string => {
  const err = e as { code?: string; message?: string };
  if (err?.code === "PGRST301" || /suitable key|JWT/i.test(err?.message ?? ""))
    return "Supabase doesn't trust Clerk sign-ins yet. Add Clerk under Supabase → Authentication → Sign In / Providers → Third-party Auth.";
  if (err?.code === "PGRST205" || /schema cache/i.test(err?.message ?? ""))
    return "The database tables don't exist yet. Run supabase/setup.sql in the Supabase SQL Editor.";
  if (err?.code === "42501") return rlsHint;
  return err?.message || rlsHint;
};

/* ── Image upload (Supabase Storage, bucket "workshop-images") ── */

const IMAGE_BUCKET = "workshop-images";
const DEFAULT_IMAGE = "/pastaworkshop.webp";
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const ImageUploader = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => {
  const db = useSupabase();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    if (!db) return;
    if (!ACCEPTED.includes(file.type)) return toast.error("Use a JPG, PNG or WebP image.");
    if (file.size > MAX_BYTES) return toast.error("Image must be 5 MB or smaller.");

    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await db.storage.from(IMAGE_BUCKET).upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
    });
    setUploading(false);
    if (error) {
      return toast.error(
        /bucket not found/i.test(error.message)
          ? "Image storage isn't set up yet. Run supabase/storage.sql in Supabase."
          : /"alg"|algorithm|jwt|jws/i.test(error.message)
            ? explain({ code: "PGRST301" })
            : `Upload failed: ${error.message}`
      );
    }
    onChange(db.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl);
    toast.success("Image uploaded");
  };

  const pick = (files: FileList | null) => files?.[0] && upload(files[0]);

  return (
    <div>
      <span className={labelCls}>Image</span>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files); }}
        className={`rounded-lg border-2 border-dashed p-3 flex items-center gap-4 transition-colors ${
          dragging ? "border-orange-500 bg-orange-50" : "border-stone-300 bg-white"
        }`}
      >
        <img
          src={value || DEFAULT_IMAGE}
          alt="Workshop preview"
          className="w-20 h-20 rounded-md object-cover ring-1 ring-stone-200 flex-shrink-0 bg-stone-100"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <button type="button" className={ghostBtn} disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageUp className="w-3.5 h-3.5" />}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          <p className="text-xs text-stone-500">or drag a photo here · JPG, PNG, WebP · max 5 MB</p>
          {value && value !== DEFAULT_IMAGE && (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-orange-600"
              onClick={() => onChange(DEFAULT_IMAGE)}
            >
              <RotateCcw className="w-3 h-3" /> Use default image
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => { pick(e.target.files); e.target.value = ""; }}
        />
      </div>
    </div>
  );
};

/* ── Workshops ─────────────────────────────────────────────── */

type WorkshopDraft = Omit<Workshop, "id" | "price" | "seats"> & { id?: string; price: string; seats: string };

const blankWorkshop = (): WorkshopDraft => ({
  title: "",
  description: "",
  workshop_date: "",
  time_label: "11:00 AM – 1:30 PM IST",
  venue: "Online (Zoom)",
  price: "599",
  seats: "",
  tag: "Online",
  image: "/pastaworkshop.webp",
  is_active: true,
});

const WorkshopsTab = () => {
  const db = useSupabase();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<WorkshopDraft | null>(null);
  const [dateOpen, setDateOpen] = useState(false);

  const { data: all = [], isLoading, error } = useQuery({
    queryKey: ["admin", "workshops"],
    enabled: !!db,
    queryFn: async () => {
      const { data, error } = await db!.from("workshops").select("*").order("workshop_date");
      if (error) throw error;
      return (data ?? []).map((w) => ({ ...w, price: Number(w.price) })) as Workshop[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "workshops"] });
    qc.invalidateQueries({ queryKey: WORKSHOPS_KEY });
  };

  const save = useMutation({
    mutationFn: async (d: WorkshopDraft) => {
      const row = {
        title: d.title.trim(),
        description: d.description?.trim() || null,
        workshop_date: d.workshop_date,
        time_label: d.time_label.trim(),
        venue: d.venue.trim(),
        price: Number(d.price),
        seats: d.seats ? Number(d.seats) : null,
        tag: d.tag.trim() || "Online",
        image: d.image.trim() || "/pastaworkshop.webp",
        is_active: d.is_active,
      };
      const q = d.id
        ? db!.from("workshops").update(row).eq("id", d.id).select()
        : db!.from("workshops").insert(row).select();
      const { data, error } = await q;
      if (error) throw error;
      if (!data?.length) throw new Error(rlsHint);
    },
    onSuccess: (_, d) => {
      toast.success(d.id ? "Workshop updated" : "Workshop added");
      setDraft(null);
      refresh();
    },
    onError: (e: Error) => toast.error(explain(e)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await db!.from("workshops").delete().eq("id", id).select();
      if (error) throw error;
      if (!data?.length) throw new Error(rlsHint);
    },
    onSuccess: () => {
      toast.success("Workshop deleted");
      refresh();
    },
    onError: (e: Error) => toast.error(explain(e)),
  });

  const submit = () => {
    if (!draft) return;
    if (!draft.title.trim()) return toast.error("Give the workshop a title.");
    if (!draft.workshop_date) return toast.error("Pick a date on the calendar.");
    if (!(Number(draft.price) >= 0) || draft.price === "") return toast.error("Enter a valid price.");
    save.mutate(draft);
  };

  const today = toDay(new Date());

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] gap-8 items-start">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
            Scheduled workshops
          </h2>
          <button type="button" className={primaryBtn} onClick={() => setDraft(blankWorkshop())}>
            <Plus className="w-4 h-4" /> New workshop
          </button>
        </div>

        {isLoading && <p className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>}
        {error && <p className="text-sm text-red-600">Couldn't load workshops: {explain(error)}</p>}
        {!isLoading && !error && all.length === 0 && (
          <p className="text-sm text-stone-600 bg-stone-50 rounded-lg p-4">No workshops yet. Add the first one.</p>
        )}

        <ul className="divide-y divide-stone-200 border-y border-stone-200">
          {all.map((w) => {
            const past = w.workshop_date < today;
            return (
              <li key={w.id} className="py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="w-14 text-center flex-shrink-0">
                  <div className="text-[0.63rem] uppercase tracking-[0.15em] text-orange-600 font-semibold">
                    {format(parseDay(w.workshop_date), "MMM")}
                  </div>
                  <div className="text-3xl font-bold text-stone-900 leading-none" style={{ fontFamily: "var(--font-display)" }}>
                    {format(parseDay(w.workshop_date), "d")}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-900 [overflow-wrap:anywhere]">{w.title}</p>
                  <p className="text-sm text-stone-500">
                    {format(parseDay(w.workshop_date), "EEEE yyyy")} · {w.time_label} · {w.venue} · ₹{w.price}
                  </p>
                  <div className="mt-1.5 flex gap-2">
                    {!w.is_active && <span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">Hidden</span>}
                    {past && <span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Past</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={ghostBtn}
                    onClick={() =>
                      setDraft({ ...w, description: w.description ?? "", price: String(w.price), seats: w.seats ? String(w.seats) : "" })
                    }
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    className={`${ghostBtn} hover:border-red-600 hover:text-red-600`}
                    disabled={remove.isPending}
                    onClick={() => window.confirm(`Delete "${w.title}" on ${w.workshop_date}?`) && remove.mutate(w.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Editor */}
      <aside className="lg:sticky lg:top-24 border border-stone-200 rounded-xl p-5 md:p-6 bg-stone-50">
        {!draft ? (
          <div className="text-sm text-stone-600">
            <CalendarDays className="w-8 h-8 text-orange-600 mb-3" />
            Pick <span className="font-semibold">New workshop</span> or <span className="font-semibold">Edit</span> to change a date, price or
            details. Changes show on the Workshops page straight away.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">{draft.id ? "Edit workshop" : "New workshop"}</h3>
              <button type="button" aria-label="Close editor" className="p-1.5 rounded-full hover:bg-stone-200" onClick={() => setDraft(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label htmlFor="w-title" className={labelCls}>Title</label>
              <input id="w-title" className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>

            <div>
              <span className={labelCls}>Date</span>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className={`${inputCls} flex items-center gap-2 text-left`}>
                    <CalendarDays className="w-4 h-4 text-orange-600" />
                    {draft.workshop_date ? format(parseDay(draft.workshop_date), "EEEE, d MMMM yyyy") : <span className="text-stone-400">Choose a date</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={draft.workshop_date ? parseDay(draft.workshop_date) : undefined}
                    defaultMonth={draft.workshop_date ? parseDay(draft.workshop_date) : undefined}
                    onSelect={(d) => {
                      if (d) setDraft({ ...draft, workshop_date: toDay(d) });
                      setDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label htmlFor="w-time" className={labelCls}>Time</label>
                <input id="w-time" className={inputCls} value={draft.time_label} onChange={(e) => setDraft({ ...draft, time_label: e.target.value })} />
              </div>
              <div>
                <label htmlFor="w-price" className={labelCls}>Price (₹)</label>
                <input id="w-price" type="number" min={0} className={inputCls} value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
              </div>
              <div>
                <label htmlFor="w-seats" className={labelCls}>Seats</label>
                <input id="w-seats" type="number" min={1} placeholder="Limited" className={inputCls} value={draft.seats} onChange={(e) => setDraft({ ...draft, seats: e.target.value })} />
              </div>
              <div>
                <label htmlFor="w-venue" className={labelCls}>Venue</label>
                <input id="w-venue" className={inputCls} value={draft.venue} onChange={(e) => setDraft({ ...draft, venue: e.target.value })} />
              </div>
              <div>
                <label htmlFor="w-tag" className={labelCls}>Tag</label>
                <input id="w-tag" className={inputCls} value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} />
              </div>
            </div>

            <div>
              <label htmlFor="w-desc" className={labelCls}>Description</label>
              <textarea id="w-desc" rows={3} className={`${inputCls} resize-none`} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </div>

            <ImageUploader value={draft.image} onChange={(url) => setDraft({ ...draft, image: url })} />

            <label className="flex items-center justify-between gap-3 text-sm text-stone-700">
              Show on the website
              <Switch checked={draft.is_active} onCheckedChange={(v) => setDraft({ ...draft, is_active: v })} />
            </label>

            <button type="button" className={`${primaryBtn} w-full`} disabled={save.isPending} onClick={submit}>
              {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {draft.id ? "Save changes" : "Add workshop"}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

/* ── Prices ────────────────────────────────────────────────── */

const PricesTab = () => {
  const db = useSupabase();
  const qc = useQueryClient();
  const [edits, setEdits] = useState<Record<string, string>>({});

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: PRICES_KEY,
    enabled: !!db,
    queryFn: async () => {
      const { data, error } = await db!.from("prices").select("*").order("sort");
      if (error) throw error;
      return (data ?? []).map((r) => ({ ...r, amount: Number(r.amount) })) as PriceRow[];
    },
  });

  const groups = useMemo(() => {
    const m = new Map<string, PriceRow[]>();
    rows.forEach((r) => m.set(r.category, [...(m.get(r.category) ?? []), r]));
    return [...m.entries()];
  }, [rows]);

  const changed = rows.filter((r) => edits[r.key] !== undefined && Number(edits[r.key]) !== r.amount);

  const save = useMutation({
    mutationFn: async () => {
      for (const r of changed) {
        const amount = Number(edits[r.key]);
        if (!(amount >= 0)) throw new Error(`"${r.label}" needs a valid price.`);
        const { data, error } = await db!.from("prices").update({ amount, updated_at: new Date().toISOString() }).eq("key", r.key).select();
        if (error) throw error;
        if (!data?.length) throw new Error(rlsHint);
      }
    },
    onSuccess: () => {
      toast.success(`${changed.length} price${changed.length === 1 ? "" : "s"} updated`);
      setEdits({});
      qc.invalidateQueries({ queryKey: PRICES_KEY });
    },
    onError: (e: Error) => toast.error(explain(e)),
  });

  if (isLoading) return <p className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>;
  if (error) return <p className="text-sm text-red-600">Couldn't load prices: {explain(error)}</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className="text-sm text-stone-600">Edit any price and press Save. The ordering pages update straight away.</p>
        <button type="button" className={primaryBtn} disabled={!changed.length || save.isPending} onClick={() => save.mutate()}>
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save {changed.length ? `(${changed.length})` : ""}
        </button>
      </div>

      {groups.map(([category, items]) => (
        <section key={category} className="mb-8">
          <h3 className="text-xl font-bold text-stone-900 mb-2" style={{ fontFamily: "var(--font-display)" }}>{category}</h3>
          <ul className="divide-y divide-stone-200 border-y border-stone-200">
            {items.map((r) => {
              const value = edits[r.key] ?? String(r.amount);
              const dirty = edits[r.key] !== undefined && Number(edits[r.key]) !== r.amount;
              return (
                <li key={r.key} className="py-3 flex items-center justify-between gap-4">
                  <label htmlFor={`p-${r.key}`} className="text-sm text-stone-700 min-w-0">{r.label}</label>
                  <div className="relative w-32 flex-shrink-0">
                    <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      id={`p-${r.key}`}
                      type="number"
                      min={0}
                      step="1"
                      className={`${inputCls} pl-8 text-right tabular-nums ${dirty ? "border-orange-500 bg-orange-50" : ""}`}
                      value={value}
                      onChange={(e) => setEdits({ ...edits, [r.key]: e.target.value })}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};

/* ── Bookings ──────────────────────────────────────────────── */

interface Booking {
  id: string;
  workshop_title: string;
  workshop_date: string;
  name: string;
  phone: string;
  email: string | null;
  people: number;
  notes: string | null;
  status: "new" | "confirmed" | "cancelled";
  amount: number | null;
  paid: boolean | null;
  razorpay_payment_id: string | null;
  created_at: string;
}

const statusStyle: Record<Booking["status"], string> = {
  new: "bg-orange-100 text-orange-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-stone-200 text-stone-600",
};

const BookingsTab = () => {
  const db = useSupabase();
  const qc = useQueryClient();

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["admin", "bookings"],
    enabled: !!db,
    queryFn: async () => {
      const { data, error } = await db!.from("workshop_bookings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Booking["status"] }) => {
      const { data, error } = await db!.from("workshop_bookings").update({ status }).eq("id", id).select();
      if (error) throw error;
      if (!data?.length) throw new Error(rlsHint);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "bookings"] }),
    onError: (e: Error) => toast.error(explain(e)),
  });

  if (isLoading) return <p className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>;
  if (error) return <p className="text-sm text-red-600">Couldn't load bookings: {explain(error)}</p>;
  if (!rows.length) return <p className="text-sm text-stone-600 bg-stone-50 rounded-lg p-4">No bookings yet.</p>;

  const seats = rows.filter((b) => b.status !== "cancelled").reduce((n, b) => n + b.people, 0);

  return (
    <div>
      <p className="text-sm text-stone-600 mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-orange-600" /> {rows.length} booking{rows.length === 1 ? "" : "s"} · {seats} people (excluding cancelled)
      </p>
      <ul className="divide-y divide-stone-200 border-y border-stone-200">
        {rows.map((b) => (
          <li key={b.id} className="py-4 grid sm:grid-cols-[minmax(0,1fr)_auto] gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-stone-900">
                {b.name} <span className="font-normal text-stone-500">· {b.people} {b.people === 1 ? "person" : "people"}</span>
              </p>
              <p className="text-sm text-stone-600 [overflow-wrap:anywhere]">
                <a className="hover:text-orange-600" href={`tel:${b.phone}`}>{b.phone}</a>
                {b.email && <> · <a className="hover:text-orange-600" href={`mailto:${b.email}`}>{b.email}</a></>}
              </p>
              <p className="text-sm text-stone-500">
                {b.workshop_title} · {format(parseDay(b.workshop_date), "d MMM yyyy")} · booked {format(new Date(b.created_at), "d MMM, h:mm a")}
              </p>
              {b.paid && (
                <p className="text-sm text-green-700 mt-1 flex flex-wrap items-center gap-x-2">
                  <span className="font-semibold">Paid{b.amount != null ? ` · ₹${b.amount}` : ""}</span>
                  {b.razorpay_payment_id && <span className="text-stone-500 [overflow-wrap:anywhere]">{b.razorpay_payment_id}</span>}
                </p>
              )}
              {b.notes && <p className="text-sm text-stone-700 mt-1 bg-stone-50 rounded px-2 py-1">{b.notes}</p>}
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[b.status]}`}>{b.status}</span>
              <select
                aria-label={`Status for ${b.name}`}
                className="border border-stone-300 rounded-lg px-2 py-1.5 text-sm bg-white"
                value={b.status}
                onChange={(e) => setStatus.mutate({ id: b.id, status: e.target.value as Booking["status"] })}
              >
                <option value="new">New</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ── Page ──────────────────────────────────────────────────── */

const Admin = () => {
  const { isLoaded, isSignedIn, isAdmin } = useIsAdmin();
  const [tab, setTab] = useState("workshops");

  useEffect(() => {
    document.title = "Admin · Bon Appetit";
  }, []);

  let body: React.ReactNode;
  if (!isLoaded) {
    body = <p className="flex items-center gap-2 text-stone-500"><Loader2 className="w-4 h-4 animate-spin" /> Checking your account…</p>;
  } else if (!isSignedIn) {
    body = (
      <div className="max-w-md">
        <ShieldCheck className="w-10 h-10 text-orange-600 mb-4" />
        <p className="text-stone-600 mb-6">Sign in with the admin account to manage prices and workshops.</p>
        <SignInButton mode="modal">
          <button type="button" className={primaryBtn}>Sign in</button>
        </SignInButton>
      </div>
    );
  } else if (!isAdmin) {
    body = (
      <div className="max-w-md">
        <ShieldAlert className="w-10 h-10 text-red-600 mb-4" />
        <p className="text-stone-700 mb-6">This account doesn't have admin access.</p>
        <Link to="/" className={ghostBtn}>Back to the homepage</Link>
      </div>
    );
  } else if (!supabaseConfigured) {
    body = <p className="text-red-600">Supabase keys are missing from .env.local.</p>;
  } else {
    body = (
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="prices">Prices</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="workshops"><WorkshopsTab /></TabsContent>
        <TabsContent value="prices"><PricesTab /></TabsContent>
        <TabsContent value="bookings"><BookingsTab /></TabsContent>
      </Tabs>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />
      <main className="px-6 md:px-14 xl:px-20 pt-10 md:pt-14 pb-20">
        <div className="max-w-6xl mx-auto">
          <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold block mb-4">Admin</span>
          <h1 className="text-[2.4rem] md:text-[3.2rem] font-bold leading-[1.05] text-stone-900 mb-10" style={{ fontFamily: "var(--font-display)" }}>
            Kitchen <span className="text-orange-600">Desk</span>
          </h1>
          {body}
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default Admin;
