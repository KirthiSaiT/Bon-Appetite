// Cafe page content: fresh pasta items + "order from the cafe" settings.
// Falls back to built-in content while Supabase is loading, offline, or before
// supabase/cafe.sql has been run, so the page never goes blank.
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface CafePasta {
  id: string;
  name: string;
  description: string | null;
  price: number;
  price_note: string | null;
  image: string;
  recipe_title: string | null;
  recipe_ingredients: string | null; // one per line
  recipe_steps: string | null; // one per line
  is_active: boolean;
  sort: number;
}

export const CAFE_PASTAS_KEY = ["cafe-pastas"] as const;
export const SETTINGS_KEY = ["site-settings"] as const;

export const DELIVERY_APPS = [
  { id: "zomato", name: "Zomato" },
  { id: "swiggy", name: "Swiggy" },
  { id: "amazon", name: "Amazon" },
] as const;
export type DeliveryAppId = (typeof DELIVERY_APPS)[number]["id"];

export const DEFAULT_SETTINGS: Record<string, string> = {
  "cafe.order_intro":
    "Craving it hot? Order cooked pasta straight from our Hyderabad kitchen on your favourite delivery app, or pick up our handmade pasta online.",
};

const FALLBACK_PASTAS: CafePasta[] = [
  {
    id: "fallback-fettucine",
    name: "Fettucine",
    description: "Flat ribbons for creamy and hearty sauces.",
    price: 250,
    price_note: "250g pack",
    image: "/freshpasta.webp",
    recipe_title: "Tomato & basil pomodoro",
    recipe_ingredients:
      "250g fresh fettucine\n500g ripe tomatoes, chopped\n3 tbsp olive oil\n1 small onion, finely chopped\n3 garlic cloves, crushed\n10 basil leaves\nSalt, to taste",
    recipe_steps:
      "Soften the onion in the oil for 5 minutes.\nAdd the garlic, then the tomatoes and a pinch of salt. Simmer for 15 minutes.\nBoil salted water and cook the pasta for 5 minutes. Drain.\nTear in the basil, toss the pasta through the sauce and serve.",
    is_active: true,
    sort: 1,
  },
  {
    id: "fallback-spaghetti",
    name: "Spaghetti",
    description: "Long, thin strands for classic Italian dishes.",
    price: 250,
    price_note: "250g pack",
    image: "/freshpasta.webp",
    recipe_title: "Aglio e olio",
    recipe_ingredients:
      "250g fresh spaghetti\n4 tbsp olive oil\n5 garlic cloves, thinly sliced\n1 tsp chilli flakes\n2 tbsp parsley or coriander\nSalt, to taste",
    recipe_steps:
      "Warm the oil and garlic together on low heat until pale gold.\nCook the pasta in salted water for 5 minutes. Save a cup of pasta water.\nAdd the chilli, pasta and a splash of pasta water to the pan. Toss for a minute.\nScatter over the herbs and serve.",
    is_active: true,
    sort: 2,
  },
  {
    id: "fallback-ravioli",
    name: "Ravioli",
    description: "Stuffed pasta — ricotta spinach or chicken cheese.",
    price: 250,
    price_note: "250g pack",
    image: "/freshpasta.webp",
    recipe_title: "Brown butter & walnuts",
    recipe_ingredients: "250g fresh ravioli\n3 tbsp butter\n30g walnuts, chopped\n1 lemon, zest and juice\nSalt, to taste",
    recipe_steps:
      "Toast the walnuts in a dry pan for 2 minutes and set aside.\nMelt the butter until it foams and smells nutty.\nCook the ravioli in salted water for 5 minutes and drain gently.\nToss in the butter and finish with lemon and walnuts.",
    is_active: true,
    sort: 3,
  },
];

export const lines = (s: string | null | undefined) =>
  (s ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

/** Active cafe pasta items, in admin order. */
export const useCafePastas = () =>
  useQuery({
    queryKey: CAFE_PASTAS_KEY,
    staleTime: 60_000,
    queryFn: async (): Promise<CafePasta[]> => {
      if (!supabase) return FALLBACK_PASTAS;
      const { data, error } = await supabase
        .from("cafe_pastas")
        .select("*")
        .eq("is_active", true)
        .order("sort")
        .order("created_at");
      if (error) return FALLBACK_PASTAS;
      return (data ?? []).map((p) => ({ ...p, price: Number(p.price) })) as CafePasta[];
    },
  });

/** Site settings as a lookup with defaults. */
export const useSiteSettings = () => {
  const query = useQuery({
    queryKey: SETTINGS_KEY,
    staleTime: 60_000,
    queryFn: async (): Promise<Record<string, string>> => {
      if (!supabase) return {};
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) return {};
      return Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]));
    },
  });
  const get = (key: string) => query.data?.[key] || DEFAULT_SETTINGS[key] || "";
  return { ...query, get };
};
