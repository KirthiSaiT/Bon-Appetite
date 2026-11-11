/* Hallmark · macrostructure: Logo Menu (logo-led header + logo rail + menu cards with recipe dropdowns)
 * shared by the four cafe ordering pages · theme: custom (project tokens · Cormorant Garamond + DM Sans · orange)
 * audience: Hyderabad home cooks · use: pick a pack and order it · tone: warm editorial
 * pre-emit critique: P4 H5 E4 S5 R4 V5
 */
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowLeft, CalendarClock, Check, ChevronDown, Clock, ShoppingBag } from "lucide-react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";

/** Swatch colours for every flavour / filling name used on the ordering pages. */
export const flavourSwatch: Record<string, string> = {
  Plain: "var(--flavour-plain)",
  Spinach: "var(--flavour-spinach)",
  Paprika: "var(--flavour-paprika)",
  Beetroot: "var(--flavour-beetroot)",
  Wheat: "var(--flavour-wheat)",
  "Ricotta Spinach": "var(--flavour-spinach)",
  "Chicken Cheese": "var(--flavour-plain)",
  "Corn Cheese": "var(--flavour-wheat)",
};

/** Whole rupees stay whole (₹75), fractional prices keep their paise (₹37.50). */
export const formatRupees = (n: number) => `₹${Number.isInteger(n) ? n : n.toFixed(2)}`;

/** The cafe's menu sections, each shown by its own logo artwork. */
export const cafeMenus = [
  { path: "/fresh-pasta", name: "Fresh Pasta", logo: "/freshpasta.webp" },
  { path: "/seasonal-sauces", name: "Seasonal Sauces", logo: "/seaonal.webp" },
  { path: "/cooked-pasta", name: "Cooked Pasta", logo: "/cooked.webp" },
  { path: "/dessert-platters", name: "Dessert Platters", logo: "/dessertplatter.webp" },
] as const;

/* ── Logo rail: move between the four menus ─────────────── */

export const LogoRail = () => {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Cafe menus" className="border-y border-stone-200 bg-stone-50">
      <ul className="max-w-6xl mx-auto px-4 md:px-14 xl:px-6 grid grid-cols-4 gap-2 md:gap-4 py-3">
        {cafeMenus.map((m) => {
          const here = pathname === m.path;
          return (
            <li key={m.path} className="min-w-0">
              <Link
                to={m.path}
                aria-current={here ? "page" : undefined}
                className={`group flex flex-col md:flex-row items-center gap-1.5 md:gap-3 rounded-2xl px-1 py-2 md:px-3 transition-colors ${focusRing} ${
                  here ? "bg-white ring-2 ring-orange-600" : "hover:bg-white"
                }`}
              >
                <span className="block w-12 h-12 md:w-14 md:h-14 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-stone-200">
                  <img src={m.logo} alt="" className="w-full h-full object-contain scale-[1.4]" />
                </span>
                <span
                  className={`text-[0.7rem] md:text-sm font-semibold text-center md:text-left leading-tight ${
                    here ? "text-orange-700" : "text-stone-700 group-hover:text-stone-900"
                  }`}
                >
                  {m.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/* ── Page shell: the menu's own logo leads ───────────────── */

interface OrderPageProps {
  /** kept for older callers; not shown */
  eyebrow?: string;
  title: string;
  accent: string;
  intro: string;
  leadTime?: string;
  shelfLife?: string;
  stamp: string;
  children: ReactNode;
}

export const OrderPage = ({ title, accent, intro, leadTime, shelfLife, stamp, children }: OrderPageProps) => (
  <div className="min-h-screen bg-white overflow-x-clip">
    <Navigation />

    <header className="px-6 md:px-14 xl:px-20 pt-8 md:pt-12 pb-10 md:pb-14">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/products"
          className={`group inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-orange-700 whitespace-nowrap rounded-sm ${focusRing}`}
        >
          <ArrowLeft className="w-4 h-4 motion-safe:transition-transform group-hover:-translate-x-1" />
          Back to the Cafe
        </Link>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-8 md:gap-14 items-center">
          {/* Logo artwork shown whole, as supplied */}
          <span className="block w-56 sm:w-64 md:w-full mx-auto md:mx-0 aspect-square overflow-hidden rounded-[2rem] bg-white ring-1 ring-stone-200">
            <img src={stamp} alt={accent} className="w-full h-full object-contain scale-[1.3]" />
          </span>
          <div className="min-w-0 text-center md:text-left">
            <h1
              className="text-[2.6rem] md:text-[3.4rem] xl:text-[4rem] font-bold leading-[1.02] text-stone-900 [overflow-wrap:anywhere]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title} <span className="text-orange-600">{accent}</span>
            </h1>
            <p className="mt-5 text-stone-600 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">{intro}</p>
            {(leadTime || shelfLife) && (
              <ul className="mt-6 flex flex-wrap justify-center md:justify-start gap-2 text-sm text-stone-700">
                {leadTime && (
                  <li className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-orange-50 px-3.5 py-1.5">
                    <CalendarClock className="w-4 h-4 text-orange-600" strokeWidth={1.75} />
                    {leadTime}
                  </li>
                )}
                {shelfLife && (
                  <li className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-orange-50 px-3.5 py-1.5">
                    <Clock className="w-4 h-4 text-orange-600" strokeWidth={1.75} />
                    {shelfLife}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>

    <LogoRail />

    <main className="px-4 sm:px-6 md:px-14 xl:px-20 pt-10 md:pt-14 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto">{children}</div>
    </main>

    <SimpleFooter />
  </div>
);

/* ── Segmented choice ───────────────────────────────────── */

interface ChoiceOption<T> {
  value: T;
  label: string;
  hint?: string;
  swatch?: string;
}

interface ChoiceProps<T> {
  label: string;
  options: ChoiceOption<T>[];
  value: T;
  onChange: (value: NoInfer<T>) => void;
}

export function Choice<T extends string | number>({ label, options, value, onChange }: ChoiceProps<T>) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-xs font-semibold text-stone-500 mb-2">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold whitespace-nowrap border rounded-full transition-colors active:translate-y-px ${focusRing} ${
                active ? "bg-stone-900 border-stone-900 text-white" : "bg-white border-stone-300 text-stone-700 hover:border-stone-900"
              }`}
            >
              {o.swatch && <span className="w-3 h-3 rounded-full ring-1 ring-black/10 shrink-0" style={{ background: o.swatch }} />}
              {o.label}
              {o.hint && <span className={active ? "text-stone-300 font-normal" : "text-stone-400 font-normal"}>{o.hint}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ── Order button with a short confirmation state ───────── */

export const AddButton = ({ onAdd, label = "Order" }: { onAdd: () => void; label?: ReactNode }) => {
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        onAdd();
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors active:translate-y-px ${focusRing} ${
        added ? "bg-green-700" : "bg-orange-600 hover:bg-orange-700"
      }`}
    >
      {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
      {added ? "Added to cart" : label}
    </button>
  );
};

/* ── Product picture; falls back to the menu logo, then a tinted disc ── */

const isDark = (tint: string) => /spinach|paprika|beetroot/.test(tint);

export const Thumb = ({
  src, fallbackSrc, alt, tint, index,
}: { src?: string; fallbackSrc?: string; alt: string; tint: string; index: number }) => {
  const [attempt, setAttempt] = useState(src ? 0 : fallbackSrc ? 1 : 2);
  const current = attempt === 0 ? src : attempt === 1 ? fallbackSrc : undefined;
  const failed = () => setAttempt((a) => (a === 0 && fallbackSrc ? 1 : 2));

  return (
    <span className="relative block w-16 h-16 md:w-20 md:h-20 shrink-0">
      {current ? (
        <img
          key={current}
          src={current}
          alt={alt}
          loading="lazy"
          onError={failed}
          className={`w-full h-full rounded-2xl ring-1 ring-stone-200 ${attempt === 1 ? "object-contain bg-white p-1" : "object-cover bg-stone-100"}`}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`w-full h-full rounded-2xl flex items-center justify-center text-base font-semibold ${isDark(tint) ? "text-white" : "text-stone-900"}`}
          style={{ background: tint }}
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
      {tint && <span aria-hidden="true" className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full ring-2 ring-white" style={{ background: tint }} />}
    </span>
  );
};

/* ── Recipe dropdown ─────────────────────────────────────── */

export interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
}

const RecipeBody = ({ recipe }: { recipe: Recipe }) => (
  <div className="mt-4 rounded-2xl bg-stone-50 p-5 md:p-6">
    <h3 className="text-xl md:text-2xl font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
      {recipe.title}
    </h3>
    <div className="mt-4 grid gap-6">
      {recipe.ingredients.length > 0 && (
        <div className="min-w-0">
          <p className="text-xs font-semibold text-stone-500">You'll need</p>
          <ul className="mt-2.5 space-y-1.5 text-sm text-stone-700">
            {recipe.ingredients.map((i) => (
              <li key={i} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      )}
      {recipe.steps.length > 0 && (
        <div className="min-w-0">
          <p className="text-xs font-semibold text-stone-500">Method</p>
          <ol className="mt-2.5 space-y-2.5 text-sm text-stone-700">
            {recipe.steps.map((s, n) => (
              <li key={s} className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-white ring-1 ring-stone-300 text-xs font-semibold">
                  {n + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  </div>
);

/* ── Menu card: picture, name, price, choices, recipe dropdown, order button ── */

interface OrderRowProps {
  index: number;
  image?: string;
  fallbackImage?: string;
  name: string;
  description: string;
  tint: string;
  price: number;
  priceNote: string;
  onAdd: () => void;
  recipe?: Recipe | null;
  children?: ReactNode;
}

export const OrderRow = ({
  index, image, fallbackImage, name, description, tint, price, priceNote, onAdd, recipe, children,
}: OrderRowProps) => (
  <AccordionPrimitive.Root type="single" collapsible asChild>
    <article className="rounded-3xl border border-stone-200 bg-white p-5 md:p-7 transition-colors hover:border-stone-300">
      <AccordionPrimitive.Item value="recipe" className="group/item">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 md:gap-5 items-start">
          <Thumb src={image} fallbackSrc={fallbackImage} alt={name} tint={tint} index={index} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2
                className="text-2xl md:text-[1.8rem] font-bold leading-tight text-stone-900 [overflow-wrap:anywhere]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {name}
              </h2>
              <span className="text-right">
                <span className="text-2xl font-bold text-orange-700 tabular-nums" style={{ fontFamily: "var(--font-display)" }} aria-live="polite">
                  {formatRupees(price)}
                </span>
                <span className="ml-1.5 text-xs text-stone-500 whitespace-nowrap">{priceNote}</span>
              </span>
            </div>
            <p className="mt-1.5 text-sm md:text-base text-stone-600 leading-relaxed">{description}</p>
          </div>
        </div>

        {children && <div className="mt-5 flex flex-col gap-4">{children}</div>}

        <div className="mt-6 pt-5 border-t border-dashed border-stone-200 flex flex-wrap items-center justify-between gap-3">
          {recipe ? (
            <AccordionPrimitive.Header asChild>
              <div>
                <AccordionPrimitive.Trigger
                  className={`inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 whitespace-nowrap transition-colors hover:border-stone-900 data-[state=open]:border-orange-600 data-[state=open]:text-orange-700 ${focusRing}`}
                >
                  Recipe
                  <ChevronDown className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-200 group-data-[state=open]/item:rotate-180" />
                </AccordionPrimitive.Trigger>
              </div>
            </AccordionPrimitive.Header>
          ) : (
            <span />
          )}
          {/* price is already in the card head; on the narrowest phones the button just says Order */}
          <AddButton onAdd={onAdd} label={<>Order<span className="hidden min-[360px]:inline"> · {formatRupees(price)}</span></>} />
        </div>

        {recipe && (
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
            <RecipeBody recipe={recipe} />
          </AccordionPrimitive.Content>
        )}
      </AccordionPrimitive.Item>
    </article>
  </AccordionPrimitive.Root>
);

/** Grid of menu cards. */
export const OrderList = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 md:gap-6 items-start">{children}</div>
);
