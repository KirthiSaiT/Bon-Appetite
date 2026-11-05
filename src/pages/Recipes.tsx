/* Hallmark · macrostructure: Recipe Index (catalogue rows) · tone: warm editorial · anchor hue: orange (project tokens)
 * theme: custom (project tokens — Cormorant Garamond + DM Sans, flavour swatches) · enrichment: one real photo
 * pre-emit critique: P4 H5 E4 S5 R4 V5
 * Every recipe cooks the pasta for the times printed on the home page (fresh 5 min, dry 7–8 min).
 */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock, Minus, Phone, Plus, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type Flavour = "plain" | "spinach" | "paprika" | "beetroot" | "wheat";

type Ingredient = { qty: number | null; unit: string; item: string };

type Recipe = {
  id: string;
  title: string;
  blurb: string;
  flavour: Flavour;
  pasta: "Fresh" | "Dry";
  minutes: number;
  serves: number;
  ingredients: Ingredient[];
  steps: string[];
  tip: string;
};

const flavourLabel: Record<Flavour, string> = {
  plain: "Plain",
  spinach: "Spinach",
  paprika: "Paprika",
  beetroot: "Beetroot",
  wheat: "Wheat",
};

const swatch = (f: Flavour) => `var(--flavour-${f})`;
const tint = (f: Flavour) => `color-mix(in oklch, var(--flavour-${f}) 22%, white)`;

const recipes: Recipe[] = [
  {
    id: "spinach-garlic-butter",
    title: "Spinach pasta in garlic butter",
    blurb: "Butter, garlic and parmesan. Done before the table is set.",
    flavour: "spinach",
    pasta: "Fresh",
    minutes: 15,
    serves: 2,
    ingredients: [
      { qty: 250, unit: "g", item: "fresh spinach pasta" },
      { qty: 3, unit: "tbsp", item: "butter" },
      { qty: 4, unit: "", item: "garlic cloves, sliced" },
      { qty: 40, unit: "g", item: "parmesan, grated" },
      { qty: 0.5, unit: "tsp", item: "chilli flakes" },
      { qty: null, unit: "", item: "salt & black pepper, to taste" },
    ],
    steps: [
      "Bring a big pot of water to a rolling boil and add a good pinch of salt.",
      "Melt the butter in a wide pan on low heat. Add the garlic and cook until just golden, about 2 minutes.",
      "Cook the pasta for 5 minutes. Save a cup of the pasta water, then drain.",
      "Toss the pasta into the butter with a splash of pasta water and the chilli flakes.",
      "Take the pan off the heat, add the parmesan and toss until glossy. Season and serve.",
    ],
    tip: "Add the cheese off the heat so it melts into the sauce instead of clumping.",
  },
  {
    id: "beetroot-brown-butter",
    title: "Beetroot pasta with brown butter & walnuts",
    blurb: "Nutty butter, crunchy walnuts and lemon over a ruby-red dough.",
    flavour: "beetroot",
    pasta: "Fresh",
    minutes: 15,
    serves: 2,
    ingredients: [
      { qty: 250, unit: "g", item: "fresh beetroot pasta" },
      { qty: 3, unit: "tbsp", item: "butter" },
      { qty: 30, unit: "g", item: "walnuts, roughly chopped" },
      { qty: 1, unit: "", item: "lemon, zest and a squeeze of juice" },
      { qty: 40, unit: "g", item: "feta or paneer, crumbled" },
      { qty: null, unit: "", item: "salt, to taste" },
    ],
    steps: [
      "Bring a big pot of salted water to a rolling boil.",
      "Toast the walnuts in a dry pan for 2 minutes, then tip them out.",
      "In the same pan, melt the butter on medium heat until it foams and smells nutty.",
      "Cook the pasta for 5 minutes, drain, and toss it straight into the butter.",
      "Finish with the lemon, walnuts and crumbled cheese.",
    ],
    tip: "Pull the butter off the heat the moment it smells nutty. It burns quickly after that.",
  },
  {
    id: "paprika-aglio-olio",
    title: "Paprika pasta aglio e olio",
    blurb: "Garlic, olive oil and chilli. The fastest dinner on this page.",
    flavour: "paprika",
    pasta: "Fresh",
    minutes: 12,
    serves: 2,
    ingredients: [
      { qty: 250, unit: "g", item: "fresh paprika pasta" },
      { qty: 4, unit: "tbsp", item: "olive oil" },
      { qty: 5, unit: "", item: "garlic cloves, thinly sliced" },
      { qty: 1, unit: "tsp", item: "chilli flakes" },
      { qty: 2, unit: "tbsp", item: "parsley or coriander, chopped" },
      { qty: null, unit: "", item: "salt, to taste" },
    ],
    steps: [
      "Bring a big pot of salted water to a rolling boil.",
      "Put the oil and garlic in a cold pan, then warm it on low heat until the garlic turns pale gold.",
      "Cook the pasta for 5 minutes. Save a cup of pasta water and drain.",
      "Add the chilli flakes to the oil, then the pasta and a splash of pasta water. Toss for a minute.",
      "Scatter over the herbs and serve.",
    ],
    tip: "Starting the garlic in cold oil keeps it sweet instead of bitter.",
  },
  {
    id: "tomato-basil-pomodoro",
    title: "Tomato & basil pomodoro",
    blurb: "A slow, simple tomato sauce that lets the plain dough shine.",
    flavour: "plain",
    pasta: "Fresh",
    minutes: 25,
    serves: 2,
    ingredients: [
      { qty: 250, unit: "g", item: "fresh plain pasta" },
      { qty: 500, unit: "g", item: "ripe tomatoes, chopped" },
      { qty: 3, unit: "tbsp", item: "olive oil" },
      { qty: 1, unit: "", item: "small onion, finely chopped" },
      { qty: 3, unit: "", item: "garlic cloves, crushed" },
      { qty: 10, unit: "", item: "basil leaves" },
      { qty: 0.5, unit: "tsp", item: "sugar" },
      { qty: null, unit: "", item: "salt, to taste" },
    ],
    steps: [
      "Warm the oil in a pan and soften the onion for 5 minutes.",
      "Add the garlic for a minute, then the tomatoes, sugar and a pinch of salt.",
      "Simmer for 15 minutes, stirring now and then, until thick.",
      "Meanwhile boil salted water and cook the pasta for 5 minutes. Drain.",
      "Tear in the basil, toss the pasta through the sauce and serve.",
    ],
    tip: "The pinch of sugar balances sour tomatoes. Skip it if yours are very ripe.",
  },
  {
    id: "wheat-mushroom-cream",
    title: "Creamy mushroom wheat pasta",
    blurb: "Golden mushrooms and a light cream sauce on our wheat dough.",
    flavour: "wheat",
    pasta: "Fresh",
    minutes: 20,
    serves: 2,
    ingredients: [
      { qty: 250, unit: "g", item: "fresh wheat pasta" },
      { qty: 200, unit: "g", item: "mushrooms, sliced" },
      { qty: 150, unit: "ml", item: "fresh cream" },
      { qty: 1, unit: "tbsp", item: "butter" },
      { qty: 2, unit: "", item: "garlic cloves, minced" },
      { qty: 30, unit: "g", item: "parmesan, grated" },
      { qty: null, unit: "", item: "salt & black pepper, to taste" },
    ],
    steps: [
      "Bring a big pot of salted water to a rolling boil.",
      "Brown the mushrooms in the butter on high heat for 5–6 minutes. Don't stir too often.",
      "Add the garlic for a minute, then pour in the cream and simmer for 2 minutes.",
      "Cook the pasta for 5 minutes, drain, and toss it into the sauce.",
      "Stir in the parmesan, season well with pepper and serve.",
    ],
    tip: "Give the mushrooms room in the pan. Crowded mushrooms steam instead of browning.",
  },
  {
    id: "dry-pasta-salad",
    title: "Cold pasta salad",
    blurb: "Dry pasta, crisp vegetables and a lemon dressing. Good for lunch boxes.",
    flavour: "plain",
    pasta: "Dry",
    minutes: 20,
    serves: 2,
    ingredients: [
      { qty: 150, unit: "g", item: "Bon Appetit dry pasta" },
      { qty: 1, unit: "", item: "cucumber, diced" },
      { qty: 10, unit: "", item: "cherry tomatoes, halved" },
      { qty: 0.5, unit: "", item: "red onion, finely sliced" },
      { qty: 3, unit: "tbsp", item: "olive oil" },
      { qty: 1, unit: "tbsp", item: "lemon juice" },
      { qty: 1, unit: "tsp", item: "dried oregano" },
      { qty: null, unit: "", item: "salt & pepper, to taste" },
    ],
    steps: [
      "Boil salted water and cook the dry pasta for 7–8 minutes.",
      "Drain and rinse under cold water so it stops cooking.",
      "Whisk the oil, lemon juice, oregano, salt and pepper together.",
      "Toss the pasta with the vegetables and the dressing.",
      "Chill for 10 minutes before serving, or pack it straight away.",
    ],
    tip: "Dress the pasta while it's still slightly damp so it soaks up the flavour.",
  },
];

/* ---------- servings scaling ---------- */

const fractions: Record<number, string> = { 0.25: "¼", 0.5: "½", 0.75: "¾" };

const formatQty = (qty: number, unit: string) => {
  if (unit === "g" || unit === "ml") {
    const rounded = qty >= 100 ? Math.round(qty / 10) * 10 : Math.round(qty / 5) * 5;
    return `${Math.max(rounded, 5)} ${unit}`;
  }
  // spoons and whole items: round to the nearest quarter, show as a fraction
  const q = Math.max(Math.round(qty * 4) / 4, 0.25);
  const whole = Math.floor(q);
  const part = fractions[+(q - whole).toFixed(2)] ?? "";
  const text = whole === 0 ? part : `${whole}${part}`;
  return unit ? `${text} ${unit}` : text;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";

/* ---------- recipe dialog ---------- */

const RecipeSheet = ({ recipe }: { recipe: Recipe }) => {
  const [serves, setServes] = useState(recipe.serves);
  const [done, setDone] = useState<number[]>([]);
  const scale = serves / recipe.serves;

  const toggle = (i: number) =>
    setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  return (
    <>
      <div className="px-6 sm:px-8 pt-8 pb-6 pr-14" style={{ background: tint(recipe.flavour) }}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
          {flavourLabel[recipe.flavour]} · {recipe.pasta} pasta
        </p>
        <DialogTitle
          className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight text-stone-900 [overflow-wrap:anywhere]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {recipe.title}
        </DialogTitle>
        <DialogDescription className="mt-2 text-stone-700">{recipe.blurb}</DialogDescription>
        <p className="mt-4 flex items-center gap-2 text-sm text-stone-700">
          <Clock className="w-4 h-4" /> {recipe.minutes} min, start to finish
        </p>
      </div>

      <div className="px-6 sm:px-8 py-7 grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10">
        {/* Ingredients + servings */}
        <section aria-labelledby="ingredients-heading" className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <h3
              id="ingredients-heading"
              className="text-2xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ingredients
            </h3>
            <div className="flex items-center gap-1 rounded-full border border-stone-300 p-1">
              <button
                type="button"
                onClick={() => setServes((s) => Math.max(1, s - 1))}
                disabled={serves <= 1}
                aria-label="Fewer servings"
                className={`w-8 h-8 flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 active:bg-stone-200 disabled:opacity-35 disabled:hover:bg-transparent ${focusRing}`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="min-w-[4.5rem] text-center text-sm font-medium text-stone-800 whitespace-nowrap" aria-live="polite">
                Serves {serves}
              </span>
              <button
                type="button"
                onClick={() => setServes((s) => Math.min(8, s + 1))}
                disabled={serves >= 8}
                aria-label="More servings"
                className={`w-8 h-8 flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 active:bg-stone-200 disabled:opacity-35 disabled:hover:bg-transparent ${focusRing}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <ul className="mt-5 divide-y divide-stone-200 border-y border-stone-200">
            {recipe.ingredients.map((ing) => (
              <li key={ing.item} className="flex items-baseline gap-4 py-2.5 text-sm">
                <span className="w-16 shrink-0 font-semibold text-orange-700 tabular-nums">
                  {ing.qty === null ? "—" : formatQty(ing.qty * scale, ing.unit)}
                </span>
                <span className="text-stone-700 min-w-0">{ing.item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Method */}
        <section aria-labelledby="method-heading" className="min-w-0">
          <div className="flex items-baseline justify-between gap-4">
            <h3
              id="method-heading"
              className="text-2xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Method
            </h3>
            <p className="text-xs text-stone-500 whitespace-nowrap" aria-live="polite">
              {done.length} of {recipe.steps.length} done
            </p>
          </div>
          <p className="mt-1 text-xs text-stone-500">Tap a step to tick it off as you cook.</p>

          <ol className="mt-4 space-y-2">
            {recipe.steps.map((step, i) => {
              const isDone = done.includes(i);
              return (
                <li key={step}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={isDone}
                    className={`w-full text-left flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-stone-50 active:bg-stone-100 ${focusRing}`}
                  >
                    <span
                      className={`mt-0.5 flex items-center justify-center w-7 h-7 shrink-0 rounded-full text-xs font-semibold transition-colors ${
                        isDone ? "bg-orange-600 text-white" : "border border-stone-300 text-stone-600"
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : i + 1}
                    </span>
                    <span
                      className={`text-sm leading-relaxed transition-colors ${
                        isDone ? "text-stone-400 line-through" : "text-stone-700"
                      }`}
                    >
                      {step}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="mt-6 rounded-xl bg-orange-50 px-4 py-3 text-sm leading-relaxed text-stone-700">
            <span className="font-semibold text-orange-800">Tip · </span>
            {recipe.tip}
          </p>

          <Link
            to="/products"
            className={`mt-6 inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 active:translate-y-px px-6 py-3 text-sm font-semibold text-white whitespace-nowrap transition-colors ${focusRing}`}
          >
            Order the {flavourLabel[recipe.flavour].toLowerCase()} pasta <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </>
  );
};

/* ---------- page ---------- */

const filters: ("all" | Flavour)[] = ["all", "spinach", "beetroot", "paprika", "plain", "wheat"];

const Recipes = () => {
  const [flavour, setFlavour] = useState<"all" | Flavour>("all");
  const [quick, setQuick] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      recipes.filter(
        (r) => (flavour === "all" || r.flavour === flavour) && (!quick || r.minutes <= 15)
      ),
    [flavour, quick]
  );
  const open = recipes.find((r) => r.id === openId) ?? null;

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 pt-14 md:pt-20 pb-12 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 lg:gap-16 items-end">
        <div className="min-w-0">
          <h1
            className="text-[3rem] sm:text-[4rem] xl:text-[5.2rem] font-semibold leading-[1.02] text-stone-900 [overflow-wrap:anywhere]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pasta for <span className="text-orange-600">tonight.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            Six easy recipes written for our handmade pasta. Pick a flavour, scale it to your table, and tick
            off each step as you cook.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-700">
            <li className="flex items-center gap-2 whitespace-nowrap">
              <Clock className="w-4 h-4 text-orange-600" /> Fresh pasta cooks in 5 minutes
            </li>
            <li className="flex items-center gap-2 whitespace-nowrap">
              <Users className="w-4 h-4 text-orange-600" /> Scales from 1 to 8 servings
            </li>
          </ul>
        </div>

        <figure className="min-w-0">
          <button
            type="button"
            onClick={() => setOpenId("spinach-garlic-butter")}
            className={`group block w-full overflow-hidden rounded-[2rem] ${focusRing}`}
          >
            <img
              src="/spinachpasta (1).webp"
              alt="A pack of Bon Appetit spinach pasta with fresh tomatoes, garlic and spices"
              className="w-full aspect-[4/3] object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
            />
          </button>
          <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-stone-500">
            <span>Our spinach pasta: try it in garlic butter</span>
            <span className="whitespace-nowrap text-orange-700 font-medium">15 min</span>
          </figcaption>
        </figure>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div role="group" aria-label="Filter by pasta flavour" className="flex items-center gap-2">
            {filters.map((f) => {
              const active = flavour === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlavour(f)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${focusRing} ${
                    active
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 text-stone-700 hover:border-stone-500 active:bg-stone-100"
                  }`}
                >
                  {f !== "all" && (
                    <span
                      aria-hidden="true"
                      className="w-3 h-3 rounded-full ring-1 ring-black/10"
                      style={{ background: swatch(f) }}
                    />
                  )}
                  {f === "all" ? "All recipes" : flavourLabel[f]}
                </button>
              );
            })}
          </div>
          <span aria-hidden="true" className="h-6 w-px bg-stone-200 shrink-0" />
          <button
            type="button"
            onClick={() => setQuick((q) => !q)}
            aria-pressed={quick}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${focusRing} ${
              quick
                ? "border-orange-600 bg-orange-600 text-white"
                : "border-stone-300 text-stone-700 hover:border-stone-500 active:bg-stone-100"
            }`}
          >
            <Clock className="w-4 h-4" /> 15 min or less
          </button>
        </div>
      </div>

      {/* Recipe index */}
      <main className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 py-10 md:py-14">
        <p className="text-sm text-stone-500" aria-live="polite">
          {visible.length} {visible.length === 1 ? "recipe" : "recipes"}
        </p>

        {visible.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-stone-300 px-6 py-14 text-center">
            <p className="text-2xl text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
              Nothing that quick for this flavour yet.
            </p>
            <button
              type="button"
              onClick={() => setQuick(false)}
              className={`mt-5 rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 hover:border-stone-500 whitespace-nowrap ${focusRing}`}
            >
              Show all cooking times
            </button>
          </div>
        ) : (
          <ul className="mt-4 border-t border-stone-200">
            {visible.map((r) => (
              <li key={r.id} className="border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setOpenId(r.id)}
                  className={`group w-full text-left grid grid-cols-[auto_minmax(0,1fr)] md:grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-5 md:gap-x-8 gap-y-3 py-6 md:py-7 ${focusRing}`}
                >
                  <span
                    aria-hidden="true"
                    className="w-14 h-14 md:w-20 md:h-20 rounded-full ring-1 ring-black/10 motion-safe:transition-transform group-hover:scale-105"
                    style={{ background: swatch(r.flavour) }}
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      {flavourLabel[r.flavour]} · {r.pasta}
                    </span>
                    <span
                      className="mt-1 block text-2xl md:text-[2rem] font-semibold leading-tight text-stone-900 group-hover:text-orange-700 transition-colors [overflow-wrap:anywhere]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {r.title}
                    </span>
                    <span className="mt-1 block text-sm text-stone-600">{r.blurb}</span>
                  </span>
                  <span className="col-start-2 md:col-start-auto flex items-center gap-5 text-sm text-stone-600">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-4 h-4 text-orange-600" /> {r.minutes} min
                    </span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <Users className="w-4 h-4 text-orange-600" /> Serves {r.serves}
                    </span>
                  </span>
                  <span className="hidden md:flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-800 whitespace-nowrap transition-colors group-hover:border-orange-600 group-hover:bg-orange-600 group-hover:text-white">
                    Cook this <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Order band */}
      <section className="bg-stone-900 text-stone-300">
        <div className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 py-16 md:py-20 grid md:grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
          <div className="min-w-0">
            <h2
              className="text-4xl md:text-5xl font-semibold leading-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Out of pasta?
            </h2>
            <p className="mt-3 max-w-lg leading-relaxed">
              We roll it by hand in Hyderabad when you order. Pick your flavour and it's on its way.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 active:translate-y-px px-7 py-3.5 font-semibold text-white whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            >
              Order now <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+919390105767"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 hover:bg-white/10 px-7 py-3.5 font-semibold text-white whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            >
              <Phone className="w-4 h-4" /> 93901 05767
            </a>
          </div>
        </div>
      </section>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-3xl w-[calc(100%-2rem)] p-0 gap-0 overflow-y-auto max-h-[90vh] rounded-3xl sm:rounded-3xl border-0">
          {open && <RecipeSheet key={open.id} recipe={open} />}
        </DialogContent>
      </Dialog>

      <SimpleFooter />
    </div>
  );
};

export default Recipes;
