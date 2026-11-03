import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface PriceRow {
  key: string;
  label: string;
  category: string;
  amount: number;
  sort: number;
}

export interface Workshop {
  id: string;
  title: string;
  description: string | null;
  workshop_date: string; // YYYY-MM-DD
  time_label: string;
  venue: string;
  price: number;
  seats: number | null;
  tag: string;
  image: string;
  is_active: boolean;
}

/** Shown when the database is not reachable yet, so the site never goes blank. */
export const FALLBACK_WORKSHOPS: Workshop[] = [
  {
    id: "fallback-2026-11-28",
    title: "Fettucine & Farfalle from Scratch",
    description: "Learn two pastas from scratch (serves 4), plus an Italian sauce. No fancy equipment needed.",
    workshop_date: "2026-11-28",
    time_label: "11:00 AM – 1:30 PM IST",
    venue: "Online (Zoom)",
    price: 599,
    seats: null,
    tag: "Online",
    image: "/pastaworkshop.webp",
    is_active: true,
  },
];

export const PRICES_KEY = ["prices"] as const;
export const WORKSHOPS_KEY = ["workshops"] as const;

export const usePrices = () => {
  const query = useQuery({
    queryKey: PRICES_KEY,
    enabled: !!supabase,
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase!.from("prices").select("*").order("sort");
      if (error) throw error;
      return (data ?? []).map((r) => ({ ...r, amount: Number(r.amount) })) as PriceRow[];
    },
  });

  const map = new Map((query.data ?? []).map((r) => [r.key, r.amount]));
  /** Database price for `key`, or the built-in default while loading / offline. */
  const price = (key: string, fallback: number) => map.get(key) ?? fallback;
  return { ...query, price };
};

/** Active workshops from today onwards, soonest first. */
export const useWorkshops = () =>
  useQuery({
    queryKey: WORKSHOPS_KEY,
    staleTime: 60_000,
    queryFn: async (): Promise<Workshop[]> => {
      if (!supabase) return FALLBACK_WORKSHOPS;
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("is_active", true)
        .gte("workshop_date", today)
        .order("workshop_date");
      if (error) return FALLBACK_WORKSHOPS;
      return (data ?? []).map((w) => ({ ...w, price: Number(w.price) })) as Workshop[];
    },
  });

/** "2026-11-28" → local Date at midnight (avoids the UTC off-by-one). */
export const parseDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Local Date → "YYYY-MM-DD". */
export const toDay = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
