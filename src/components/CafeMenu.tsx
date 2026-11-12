/* Hallmark · component: menu board · genre: playful-editorial · theme: project tokens + --menu-* (from the printed card)
 * layout: one white menu sheet; category tab strip (arrow-key roving tabs) → dotted-leader price list + a side panel in the category's colour
 * states: default · hover · focus · active · selected (tabs) · no loading/error (static data)
 * Prices and items transcribed from the cafe's printed menu card (public/cafe-menu.jpg).
 */
import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Expand, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Item = { name: string; price: number; veg: boolean };
/* note: a short footer line for cards with only a few items, so a row still reads as one even band */
type Section = { title: string; tone: "olive" | "rust"; items: Item[]; note?: { text: string; to?: string } };

const v = (name: string, price: number): Item => ({ name, price, veg: true });
const n = (name: string, price: number): Item => ({ name, price, veg: false });

const menu: Section[] = [
  // Row 1: the mains, row 2: the small extras. Cards in a row share one height; colours alternate like a checkerboard.
  {
    title: "Pastas",
    tone: "olive",
    items: [
      v("Marinara Pasta", 189),
      n("Chicken Marinara Pasta", 229),
      v("Butter Garlic Pasta", 199),
      n("Chicken Butter Garlic Pasta", 239),
      v("Pesto Pasta", 219),
      n("Chicken Pesto Pasta", 259),
    ],
  },
  {
    title: "Appetizers",
    tone: "rust",
    items: [
      v("French Fries", 99),
      v("Peri Peri Fries", 119),
      v("Cheese Fries", 149),
      v("Cheese Balls", 139),
      n("Chicken Nuggets", 149),
      n("Chicken Popcorn", 159),
    ],
  },
  {
    title: "Combos",
    tone: "olive",
    items: [
      v("Veg Pasta + Fries + Coke", 299),
      n("Chicken Pasta + Coke", 259),
      v("Pasta + Brownie", 269),
      v("Pasta + Cheese Fries + Coke", 349),
    ],
  },
  {
    title: "Desserts",
    tone: "rust",
    items: [v("Brownie", 89)],
    note: { text: "See all dessert platters", to: "/dessert-platters" },
  },
  {
    title: "Beverages",
    tone: "olive",
    items: [v("Coke 200 ml", 30), v("Sprite 200 ml", 30), v("Thums Up 200 ml", 30), v("Water Bottle", 30)],
  },
  {
    title: "Add-ons",
    tone: "rust",
    items: [v("Extra Cheese", 30), n("Extra Chicken", 50)],
    note: { text: "Top up any pasta or combo" },
  },
];

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";
const toneBg = { olive: "var(--menu-olive)", rust: "var(--menu-rust)" };

/* Indian food mark: a square outline with a dot, green for veg and red for non-veg */
const FoodMark = ({ veg }: { veg: boolean }) => (
  <span
    role="img"
    aria-label={veg ? "Veg" : "Non-veg"}
    className="mt-1 flex items-center justify-center w-4 h-4 shrink-0 rounded-[3px] border-2"
    style={{ borderColor: veg ? "var(--menu-veg)" : "var(--menu-nonveg)" }}
  >
    <span className="w-1.5 h-1.5 rounded-full" style={{ background: veg ? "var(--menu-veg)" : "var(--menu-nonveg)" }} />
  </span>
);

/** The printed menu card, opened full screen */
export const MenuCardDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-none w-screen h-[100dvh] p-0 border-0 rounded-none bg-stone-950/95 flex flex-col [&>button:last-child]:hidden">
      <DialogTitle className="sr-only">Bon Appetit Cafe menu card</DialogTitle>
      <div className="flex justify-end px-4 py-4">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close the menu card"
          className={`flex items-center justify-center w-11 h-11 rounded-full border border-stone-600 text-stone-100 hover:bg-orange-600 hover:border-orange-500 active:translate-y-px transition-colors ${focusRing}`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 min-h-0 px-4 pb-6">
        <img src="/cafe-menu.jpg" alt="Bon Appetit Cafe menu card with pastas, appetizers, desserts, beverages, add-ons and combos" className="w-full h-full object-contain" />
      </div>
    </DialogContent>
  </Dialog>
);

/** A small "view our menu" tile: the printed card's thumbnail, opens it big */
export const MenuCardButton = ({ className = "" }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative block w-full overflow-hidden rounded-3xl bg-[var(--menu-cream)] ring-1 ring-stone-200 text-left transition-shadow hover:shadow-xl active:translate-y-px ${focusRing} ${className}`}
      >
        <img
          src="/cafe-menu.jpg"
          alt=""
          loading="lazy"
          className="w-full aspect-[3/4] object-cover object-top motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-md">
          <span className="text-base font-semibold text-stone-900 whitespace-nowrap">View our menu</span>
          <Expand className="w-4 h-4 text-orange-700 shrink-0" />
        </span>
      </button>
      <MenuCardDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

/** The cafe menu on the home page: one category at a time, picked from a tab strip, so the board is always even */
export const CafeMenuBoard = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = menu[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + menu.length) % menu.length;
    setActive(next);
    tabs.current[next]?.focus({ preventScroll: true });
  };

  return (
    <section aria-labelledby="cafe-menu-title" className="mt-24 md:mt-28 bg-[var(--menu-cream)] px-4 sm:px-6 md:px-14 xl:px-20 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="px-2 sm:px-0 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <h2
              id="cafe-menu-title"
              className="text-[2.6rem] md:text-[4rem] font-bold leading-[0.98] text-stone-900 [overflow-wrap:anywhere]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hungry? <span style={{ color: "var(--menu-rust)" }}>Here's the menu.</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-stone-700 leading-relaxed">
              Hot pasta, sides and combos from our Hyderabad cafe. All prices in rupees.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-stone-700">
            <span className="inline-flex items-center gap-2 whitespace-nowrap"><FoodMark veg /> Veg</span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap"><FoodMark veg={false} /> Non-veg</span>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_60px_-40px_theme(colors.stone.900/0.45)] ring-1 ring-stone-900/5">
          {/* category tabs: scroll sideways on phones, never wrap */}
          <div role="tablist" aria-label="Menu categories" className="no-scrollbar flex gap-2 overflow-x-auto border-b border-stone-100 p-3 sm:p-4">
            {menu.map((m, i) => {
              const on = i === active;
              return (
                <button
                  key={m.title}
                  ref={(el) => (tabs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`menu-tab-${i}`}
                  aria-selected={on}
                  aria-controls="menu-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKey}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors active:translate-y-px ${focusRing} ${
                    on ? "text-white" : "text-stone-700 hover:bg-stone-100"
                  }`}
                  style={on ? { background: toneBg[m.tone] } : undefined}
                >
                  {m.title}
                  <span className={`tabular-nums text-xs ${on ? "text-white/75" : "text-stone-400"}`}>{m.items.length}</span>
                </button>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div id="menu-panel" role="tabpanel" aria-labelledby={`menu-tab-${active}`} className="min-w-0 p-5 sm:p-8 lg:min-h-[19rem]">
              <ul key={s.title} className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-8 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
                {s.items.map((it) => (
                  <li key={it.name} className="flex items-baseline gap-3 border-b border-stone-100 py-4">
                    <span className="self-center"><FoodMark veg={it.veg} /></span>
                    <span className="min-w-0 text-base md:text-lg font-medium text-stone-900 leading-snug">{it.name}</span>
                    <span aria-hidden="true" className="flex-1 min-w-4 border-b-2 border-dotted border-stone-200 translate-y-[-0.3rem]" />
                    <span className="text-base md:text-lg font-bold text-stone-900 tabular-nums whitespace-nowrap">₹{it.price}</span>
                  </li>
                ))}
              </ul>
              {s.note && (
                <p className="mt-5 text-sm font-medium text-stone-600">
                  {s.note.to ? (
                    <Link to={s.note.to} className={`group inline-flex items-center gap-1.5 whitespace-nowrap text-orange-700 hover:text-orange-800 ${focusRing}`}>
                      {s.note.text}
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 motion-safe:transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    s.note.text
                  )}
                </p>
              )}
            </div>

            {/* side panel: the category in its own colour, plus the two ways to act */}
            <aside
              className="flex flex-col justify-between gap-8 p-6 sm:p-8 text-white transition-colors duration-300"
              style={{ background: toneBg[s.tone] }}
            >
              <div>
                <p className="text-sm font-medium text-white/75">Now showing</p>
                <p className="mt-1 text-[2.4rem] font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>
                  {s.title}
                </p>
                <p className="mt-3 text-sm text-white/80">
                  {s.items.length} {s.items.length === 1 ? "item" : "items"} · from ₹{Math.min(...s.items.map((i) => i.price))}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  to="/products?tab=order"
                  className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-stone-900 hover:bg-[var(--menu-cream)] active:translate-y-px px-6 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
                >
                  Order from the cafe
                  <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/40 hover:bg-white/10 active:translate-y-px px-6 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
                >
                  <Expand className="w-4 h-4" /> See the printed card
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <MenuCardDialog open={open} onOpenChange={setOpen} />
    </section>
  );
};
