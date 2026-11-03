/* Hallmark · genre: editorial · macrostructure: Order Sheet · shared by the four cafe ordering pages
 * pre-emit critique: P4 H5 E4 S4 R5 V4
 */
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CalendarClock, Plus, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600";

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
export const formatRupees = (n: number) =>
  `₹${Number.isInteger(n) ? n : n.toFixed(2)}`;

/* ── Page shell ─────────────────────────────────────────── */

interface OrderPageProps {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  leadTime?: string;
  shelfLife?: string;
  stamp: string;
  children: ReactNode;
}

export const OrderPage = ({
  eyebrow, title, accent, intro, leadTime, shelfLife, stamp, children,
}: OrderPageProps) => (
  <div className="min-h-screen bg-white overflow-x-clip">
    <Navigation />

    <header className="px-6 md:px-14 xl:px-20 pt-10 md:pt-14 pb-12 md:pb-16">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/products"
          className={`group inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-orange-600 whitespace-nowrap motion-safe:transition-colors rounded-sm ${focusRing}`}
        >
          <ArrowLeft className="w-4 h-4 motion-safe:transition-transform group-hover:-translate-x-1" />
          Back to the cafe menu
        </Link>

        <div className="mt-10 md:mt-14 grid md:grid-cols-[minmax(0,1fr)_auto] gap-8 md:gap-16 items-end">
          <div className="min-w-0">
            <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold block mb-5">
              {eyebrow}
            </span>
            <h1
              className="text-[2.6rem] md:text-[3.6rem] xl:text-[4.2rem] font-bold leading-[1.02] text-stone-900 [overflow-wrap:anywhere]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title} <span className="text-orange-600">{accent}</span>
            </h1>
            <p className="mt-6 text-stone-600 text-lg leading-relaxed max-w-xl">{intro}</p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-700">
              {leadTime && (
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <CalendarClock className="w-4 h-4 text-orange-600" strokeWidth={1.75} />
                  {leadTime}
                </li>
              )}
              {shelfLife && (
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <Clock className="w-4 h-4 text-orange-600" strokeWidth={1.75} />
                  {shelfLife}
                </li>
              )}
            </ul>
          </div>
          <img
            src={stamp}
            alt=""
            aria-hidden="true"
            className="hidden md:block w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover ring-1 ring-stone-200"
          />
        </div>
      </div>
    </header>

    <main className="px-6 md:px-14 xl:px-20 pb-20 md:pb-28">
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
      <legend className="text-[0.63rem] tracking-[0.2em] uppercase font-semibold text-stone-500 mb-2.5">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold whitespace-nowrap border rounded-full motion-safe:transition-colors active:translate-y-px ${focusRing} ${
                active
                  ? "bg-stone-900 border-stone-900 text-white"
                  : "bg-white border-stone-300 text-stone-700 hover:border-stone-900"
              }`}
            >
              {o.swatch && (
                <span
                  className="w-3 h-3 rounded-full ring-1 ring-black/10 flex-shrink-0"
                  style={{ background: o.swatch }}
                />
              )}
              {o.label}
              {o.hint && (
                <span className={active ? "text-stone-300 font-normal" : "text-stone-400 font-normal"}>
                  {o.hint}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ── Add-to-cart button with a short confirmation state ──── */

export const AddButton = ({ onAdd, label = "Add to cart" }: { onAdd: () => void; label?: string }) => {
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        onAdd();
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold whitespace-nowrap text-white motion-safe:transition-colors active:translate-y-px ${focusRing} ${
        added ? "bg-stone-900" : "bg-orange-600 hover:bg-orange-700"
      }`}
    >
      {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      {added ? "Added" : label}
    </button>
  );
};

/* ── Small product photo; falls back to the tinted number disc until a photo exists ── */

const isDark = (tint: string) => /spinach|paprika|beetroot/.test(tint);

export const Thumb = ({
  src, fallbackSrc, alt, tint, index,
}: { src?: string; fallbackSrc?: string; alt: string; tint: string; index: number }) => {
  // 0 = product photo, 1 = category image, 2 = tinted number disc
  const [attempt, setAttempt] = useState(src ? 0 : fallbackSrc ? 1 : 2);
  const label = String(index).padStart(2, "0");
  const current = attempt === 0 ? src : attempt === 1 ? fallbackSrc : undefined;
  const showPhoto = !!current;
  const failed = () => setAttempt((a) => (a === 0 && fallbackSrc ? 1 : 2));

  return (
    <span className="relative block w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
      {showPhoto ? (
        <img
          key={current}
          src={current}
          alt={alt}
          loading="lazy"
          onError={failed}
          className={`w-full h-full rounded-xl ring-1 ring-stone-200 ${
            attempt === 1 ? "object-contain bg-white p-1" : "object-cover bg-stone-100"
          }`}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`w-full h-full rounded-xl flex items-center justify-center text-sm md:text-base font-semibold ring-1 ring-black/5 motion-safe:transition-colors ${
            isDark(tint) ? "text-white" : "text-stone-900"
          }`}
          style={{ background: tint }}
        >
          {label}
        </span>
      )}
      {showPhoto && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full ring-2 ring-white motion-safe:transition-colors"
          style={{ background: tint }}
        />
      )}
    </span>
  );
};

/* ── One menu row: name + choices on the left, price + button on the right ── */

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
  children: ReactNode;
}

export const OrderRow = ({ index, image, fallbackImage, name, description, tint, price, priceNote, onAdd, children }: OrderRowProps) => (
  <article className="grid grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)_auto] gap-x-5 md:gap-x-8 gap-y-6 py-8 md:py-10 border-b border-stone-200">
    <Thumb src={image} fallbackSrc={fallbackImage} alt={name} tint={tint} index={index} />

    <h2
      className="self-center min-w-0 text-2xl md:text-[2rem] font-bold leading-tight text-stone-900 [overflow-wrap:anywhere]"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {name}
    </h2>

    <div className="min-w-0 col-span-2 md:col-span-1 md:col-start-2 -mt-2 md:-mt-4">
      <p className="text-stone-600 leading-relaxed max-w-lg">{description}</p>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </div>

    <div className="col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2 flex items-center justify-between lg:flex-col lg:items-end lg:justify-end gap-4 lg:min-w-[11rem] pt-5 lg:pt-0 border-t border-dashed border-stone-200 lg:border-0">
      <div className="lg:text-right">
        <div
          className="text-3xl font-bold text-stone-900 tabular-nums"
          style={{ fontFamily: "var(--font-display)" }}
          aria-live="polite"
        >
          {formatRupees(price)}
        </div>
        <div className="text-xs text-stone-500 whitespace-nowrap">{priceNote}</div>
      </div>
      <AddButton onAdd={onAdd} />
    </div>
  </article>
);

/** Ruled list wrapper so the first row gets the heavy ink rule. */
export const OrderList = ({ children }: { children: ReactNode }) => (
  <div className="border-t-2 border-stone-900">{children}</div>
);
