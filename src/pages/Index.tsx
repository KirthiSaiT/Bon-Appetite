/* Hallmark · study → rebuild · genre: editorial · macrostructure: Shelf Stack · theme: custom (project tokens)
 * tone: warm editorial · anchor hue: warm orange · nav: shared · footer: shared (Ft2)
 * section rhythm studied from a reference D2C food home page; type, colour and copy are Bon Appetit's own
 * sections: banner hero + retail band · "what is" card + ribbon · our stars rail · callout diagram · taped notes rail · kitchen map
 * pre-emit critique: P4 H5 E4 S5 R4 V5
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Ban,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Flame,
  Leaf,
  MapPin,
  Sparkles,
  Timer,
  type LucideIcon,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600";

const facts = [
  ["Handmade", "daily."],
  ["Ready in", "5 minutes."],
  ["No", "preservatives."],
];

const shops = [
  { name: "Amazon", href: "https://www.amazon.in" },
  { name: "Meesho", href: "https://www.meesho.com" },
  { name: "Flipkart", href: "https://www.flipkart.com" },
];

const ribbon = ["Handmade daily", "No preservatives", "5 natural flavours", "Ready in 5 minutes", "Made in Hyderabad"];

// Tiles take the pasta-flavour tokens so the shelf reads like the coloured dough itself
const stars: { name: string; image: string; to: string; tint: string; badge?: string }[] = [
  { name: "Fresh Pasta", image: "/freshpasta.webp", to: "/fresh-pasta", tint: "var(--flavour-paprika)", badge: "Made to order" },
  { name: "Dry Pasta", image: "/drypasta.webp", to: "/our-pasta-brand", tint: "var(--flavour-spinach)" },
  { name: "Seasonal Sauces", image: "/seaonal.webp", to: "/seasonal-sauces", tint: "var(--color-accent)" },
  { name: "Cooked Pasta", image: "/cooked.webp", to: "/cooked-pasta", tint: "var(--flavour-beetroot)" },
  { name: "Dessert Platters", image: "/dessertplatter.webp", to: "/dessert-platters", tint: "var(--flavour-wheat)" },
  { name: "Pasta Workshops", image: "/pastaworkshop.webp", to: "/pasta-workshops", tint: "var(--color-ink)" },
];

// Five doughs — swatches use the pasta-flavour tokens; colour comes from the vegetable itself
const flavours: { name: string; from: string; swatch: string; ink: string }[] = [
  { name: "Plain", from: "Semolina & '00' flour", swatch: "var(--flavour-plain)", ink: "var(--color-ink)" },
  { name: "Spinach", from: "Fresh spinach", swatch: "var(--flavour-spinach)", ink: "var(--color-paper)" },
  { name: "Paprika", from: "Paprika", swatch: "var(--flavour-paprika)", ink: "var(--color-paper)" },
  { name: "Beetroot", from: "Real beetroot", swatch: "var(--flavour-beetroot)", ink: "var(--color-paper)" },
  { name: "Wheat", from: "Wheat flour", swatch: "var(--flavour-wheat)", ink: "var(--color-paper)" },
];

const promises: { title: string; body: string; icon: LucideIcon }[] = [
  { title: "No Preservatives", body: "Nothing added to make it last longer — just flour, water and vegetables.", icon: Ban },
  { title: "Real Vegetable Colours", body: "Spinach, beetroot and paprika give our pasta its colour. No dyes.", icon: Leaf },
  { title: "Made Fresh to Order", body: "Rolled and cut by hand in our kitchen, in small batches, when you order.", icon: Sparkles },
];

const cookSteps: { text: string; icon: LucideIcon }[] = [
  { text: "Bring a big pot of water to a rolling boil and add a good pinch of salt.", icon: Flame },
  { text: "Fresh pasta: drop it in and cook for 5 minutes, then drain.", icon: Timer },
  { text: "Dry pasta: cook for 7–8 minutes, then drain and toss in your sauce.", icon: CookingPot },
];

const callouts = {
  left: ["Handmade daily", "Semolina & '00' flour", "Made to order"],
  right: ["No preservatives", "Five natural flavours", "Ready in 5 minutes"],
};

const notes = [
  { q: "Is the pasta cooked?", a: "All our pastas are uncooked. Boil within 10 minutes and they're ready to savour." },
  { q: "How do I cook it?", a: "Fresh pasta — boil in salted water for 5 minutes. Dry pasta — boil for 7–8 minutes." },
  { q: "Should I rinse it first?", a: "Rinse in cold water for a silky texture — just don't leave it sitting in the water for more than 5 minutes." },
  { q: "How do I store it?", a: "Eat fresh pasta within 48 hours or freeze it within 2. Dry pasta keeps until the date on the pack." },
  { q: "Where can I buy it?", a: "Order here on our website, or find us on Amazon, Meesho and Flipkart." },
  { q: "Can I customise an order?", a: "Yes — tell us the shape, flavour and quantity and we'll make it fresh for you." },
];

/** Horizontal snap rail with arrow + dot paging. */
const useRail = () => {
  const ref = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setPages(Math.max(1, Math.ceil((el.scrollWidth - 4) / el.clientWidth)));
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setPage(atEnd ? Math.ceil((el.scrollWidth - 4) / el.clientWidth) - 1 : Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const behavior = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  const go = (i: number) => ref.current?.scrollTo({ left: i * ref.current.clientWidth, behavior: behavior() });
  const step = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth, behavior: behavior() });

  return { ref, page, pages, go, step };
};

const RailArrows = ({ step, page, pages, label }: { step: (d: 1 | -1) => void; page: number; pages: number; label: string }) => (
  <>
    {([-1, 1] as const).map((d) => (
      <button
        key={d}
        type="button"
        aria-label={d === -1 ? `Previous ${label}` : `Next ${label}`}
        disabled={d === -1 ? page === 0 : page >= pages - 1}
        onClick={() => step(d)}
        className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 border border-stone-200 text-stone-600 items-center justify-center shadow-sm hover:text-orange-700 hover:border-orange-600 disabled:opacity-0 disabled:pointer-events-none transition ${
          d === -1 ? "-left-5" : "-right-5"
        } ${focusRing}`}
      >
        {d === -1 ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    ))}
  </>
);

const RailDots = ({ page, pages, go, label }: { page: number; pages: number; go: (i: number) => void; label: string }) =>
  pages > 1 ? (
    <div className="mt-6 flex justify-center gap-2" aria-label={`${label} pages`}>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${label} page ${i + 1}`}
          aria-current={i === page ? "true" : undefined}
          onClick={() => go(i)}
          className={`h-2 rounded-full transition-all ${i === page ? "w-6 bg-orange-600" : "w-2 bg-stone-300 hover:bg-stone-400"} ${focusRing}`}
        />
      ))}
    </div>
  ) : null;

const Index = () => {
  const starsRail = useRail();
  const notesRail = useRail();

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Banner hero with retail band ── */}
      <section className="relative bg-gradient-to-br from-orange-50 via-stone-50 to-amber-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 pt-14 md:pt-20 pb-16 md:pb-20 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 md:gap-8 items-center">
          <div className="min-w-0">
            <span className="inline-block -rotate-1 bg-stone-900 text-amber-300 px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide whitespace-nowrap">
              Handmade Fresh Pasta
            </span>
            <h1
              className="text-[2.6rem] sm:text-[3.4rem] lg:text-[4.4rem] font-semibold leading-[1] text-stone-900 [overflow-wrap:anywhere] min-w-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Made by hand this morning.
              <span className="block text-orange-600">On your plate tonight.</span>
            </h1>
            <ul className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              {facts.map(([a, b]) => (
                <li
                  key={a}
                  className="text-xl sm:text-2xl font-semibold leading-[1.05] text-stone-800"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {a}
                  <br />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                to="/products"
                className={`group inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 active:translate-y-px text-white px-8 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
              >
                Order now
                <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Two "packs" leaning on each other */}
          <div className="relative min-w-0 h-[300px] sm:h-[380px] md:h-[420px]">
            <figure className="absolute right-[4%] top-0 w-[62%] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl rotate-[5deg] border-[6px] border-white">
              <img src="/aboutus.webp" alt="Packs of Bon Appetit pasta" className="w-full h-full object-cover" />
            </figure>
            <figure className="absolute left-[2%] bottom-0 w-[62%] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl -rotate-[4deg] border-[6px] border-white">
              <img
                src="/spinachpasta (1).webp"
                alt="Bon Appetit spinach pasta with tomatoes, semolina and olive oil"
                className="w-full h-full object-cover"
              />
            </figure>
          </div>
        </div>

        <div className="bg-stone-900 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 py-5 flex flex-wrap items-center gap-x-10 gap-y-3">
            <span className="text-sm font-medium text-stone-300 whitespace-nowrap">Also available on</span>
            {shops.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-2xl md:text-[1.75rem] font-semibold whitespace-nowrap hover:text-orange-300 transition-colors ${focusRing}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.name}
              </a>
            ))}
            <img
              src="/bonappetitlogo.jpeg"
              alt="Bon Appetit"
              className="hidden sm:block ml-auto w-12 h-12 rounded-full object-cover bg-white"
            />
          </div>
        </div>
      </section>

      {/* ── What is Bon Appetit pasta? ── */}
      <section className="px-6 md:px-14 xl:px-20 pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto relative">
          <figure className="hidden sm:block absolute -top-14 -right-4 md:-right-10 w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-[8px] border-white shadow-md z-10 bg-white">
            <img src="/drypasta.webp" alt="" className="w-full h-full object-contain p-3" />
          </figure>
          <div className="rounded-2xl overflow-hidden bg-orange-100">
            <div className="px-7 sm:px-12 pt-12 pb-10 sm:pr-44 md:pr-52">
              <h2
                className="text-[2.2rem] md:text-[3rem] font-semibold text-orange-800 leading-[1.05]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What is Bon Appetit pasta?
              </h2>
              <p className="mt-5 text-stone-700 leading-relaxed max-w-xl">
                Pasta the way it's made in Italian kitchens — rolled and cut by hand in small batches, every day.
                Semolina, '00' flour and water, coloured with real spinach, beetroot and paprika.
              </p>
              <ul className="mt-5 space-y-1.5 text-stone-800">
                <li>• Five flavours: Plain, Spinach, Paprika, Beetroot and Wheat</li>
                <li>• Fresh pasta cooks in 5 minutes</li>
              </ul>
              <Link
                to="/about"
                className={`group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-800 whitespace-nowrap ${focusRing}`}
              >
                Read our story
                <ArrowRight className="w-3.5 h-3.5 motion-safe:transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="bg-orange-600 overflow-hidden py-3" aria-hidden="true">
              <div className="marquee-track">
                {[0, 1].map((copy) => (
                  <span key={copy} className="flex shrink-0">
                    {ribbon.concat(ribbon).map((r, i) => (
                      <span key={i} className="px-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white whitespace-nowrap">
                        • {r}
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our stars ── */}
      <section className="px-6 md:px-14 xl:px-20 pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-[2.4rem] md:text-[3.2rem] font-light text-stone-900 leading-[1.02] mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Our stars.
          </h2>
          <div className="relative">
            <RailArrows step={starsRail.step} page={starsRail.page} pages={starsRail.pages} label="products" />
            <ul ref={starsRail.ref} className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory">
              {stars.map((s) => (
                <li key={s.name} className="snap-start shrink-0 w-[80%] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] flex flex-col items-center">
                  <Link
                    to={s.to}
                    className={`group relative block w-full overflow-hidden ${focusRing}`}
                    style={{ background: s.tint }}
                  >
                    {s.badge && (
                      <span className="absolute top-4 -left-9 z-10 w-36 -rotate-45 bg-amber-100 text-stone-900 text-[0.65rem] font-bold uppercase tracking-wider text-center py-1">
                        {s.badge}
                      </span>
                    )}
                    <div className="aspect-square p-6 pb-0">
                      <div className="w-full h-full bg-white shadow-lg flex items-center justify-center motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.03] group-hover:-rotate-1">
                        <img src={s.image} alt={s.name} className="w-full h-full object-contain p-6" />
                      </div>
                    </div>
                    <p className="px-4 py-4 text-center text-white text-base font-semibold whitespace-nowrap">{s.name}</p>
                  </Link>
                  <Link
                    to={s.to}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="mt-4 rounded-full bg-stone-900 hover:bg-orange-600 text-white px-9 py-2.5 text-sm font-medium whitespace-nowrap transition-colors"
                  >
                    Explore
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <RailDots go={starsRail.go} page={starsRail.page} pages={starsRail.pages} label="Products" />
        </div>
      </section>

      {/* ── Five flavours: a real photo of the packs beside a plain list of what colours each dough ── */}
      <section className="mt-24 md:mt-28 px-6 md:px-14 xl:px-20">
        <div className="max-w-7xl mx-auto grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
          <figure className="min-w-0 relative">
            <div className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden rounded-3xl bg-stone-100">
              <img
                src="/aboutus.webp"
                alt="Paprika, spinach and beetroot pasta packs"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            {/* the five colours as one stacked band along the photo's foot */}
            <div aria-hidden="true" className="absolute inset-x-6 -bottom-3 flex h-6 overflow-hidden rounded-full ring-4 ring-white">
              {flavours.map((f) => (
                <span key={f.name} className="flex-1" style={{ background: f.swatch }} />
              ))}
            </div>
          </figure>

          <div className="min-w-0">
            <h2
              className="text-[2.4rem] md:text-[3.4rem] font-semibold leading-[1.02] text-stone-900 [overflow-wrap:anywhere]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Five flavours, <span className="text-orange-600">one honest dough.</span>
            </h2>
            <p className="mt-4 max-w-lg text-stone-600 leading-relaxed">
              The colour comes from what goes into the dough, nothing else.
            </p>
            <ol className="mt-8 border-t border-stone-200">
              {flavours.map((f) => (
                <li
                  key={f.name}
                  className="grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-0.5 border-b border-stone-200 py-4"
                >
                  <span
                    aria-hidden="true"
                    className="row-span-2 sm:row-span-1 w-10 h-10 rounded-full ring-1 ring-stone-900/10"
                    style={{ background: f.swatch }}
                  />
                  <span
                    className="text-2xl md:text-[1.75rem] font-semibold leading-tight text-stone-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {f.name}
                  </span>
                  <span className="text-sm text-stone-500 sm:text-right">{f.from}</span>
                </li>
              ))}
            </ol>
            <Link
              to="/our-pasta-brand"
              className={`group mt-8 inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 active:translate-y-px text-white px-8 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
            >
              See every shape
              <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── What is handmade pasta? + promise cards ── */}
      <section className="px-6 md:px-14 xl:px-20 pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 md:gap-14 items-center">
            <div className="min-w-0">
              <h2
                className="text-[2.4rem] md:text-[3.2rem] font-semibold text-stone-900 leading-[1.02]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Why handmade?
              </h2>
              <p className="mt-6 text-stone-600 text-base md:text-lg leading-relaxed max-w-xl">
                Pasta rolled and cut by hand keeps a slightly rough surface, so sauce clings to every strand instead
                of sliding off. We make ours in small batches with semolina and '00' flour — the way it's been made in
                Italy for generations.
              </p>
              <Link
                to="/about"
                className={`group mt-8 inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 active:translate-y-px text-white px-8 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
              >
                Read more
                <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <figure className="min-w-0 aspect-[16/10] rounded-3xl overflow-hidden bg-stone-100">
              <img src="/bts1.webp" alt="Our team shaping pasta by hand in the kitchen" className="w-full h-full object-cover" />
            </figure>
          </div>

          <h2
            className="mt-20 md:mt-24 text-[2.2rem] md:text-[3rem] font-semibold text-stone-900 leading-[1.02]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Is it good for you? <span className="text-orange-600">Absolutely.</span>
          </h2>
          <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promises.map((p) => (
              <li key={p.title} className="min-w-0 rounded-3xl border border-orange-200 p-7 md:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-600 shrink-0">
                    <p.icon className="w-7 h-7" strokeWidth={1.6} />
                  </span>
                  <h3 className="text-lg font-semibold text-stone-900 leading-snug">{p.title}</h3>
                </div>
                <p className="mt-5 text-stone-600 leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Callout diagram ── */}
      <section className="px-6 md:px-14 xl:px-20 pt-24 md:pt-28">
        <div className="max-w-6xl mx-auto rounded-2xl bg-gradient-to-b from-stone-50 to-orange-50 border border-stone-200 px-6 sm:px-10 py-14 md:py-16">
          <h2
            className="text-center text-[2.4rem] md:text-[3.4rem] font-semibold text-stone-900 leading-[1.02]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Small batch, <span className="text-orange-600">big flavour.</span>
          </h2>
          <div className="mt-12 grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-8 md:gap-0">
            <figure className="md:order-2 mx-auto w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-[8px] border-white shadow-xl">
              <img src="/spinachpasta (1).webp" alt="Spinach pasta with tomatoes and olive oil" className="w-full h-full object-cover" />
            </figure>
            {(["left", "right"] as const).map((side) => (
              <ul
                key={side}
                className={`grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-12 ${side === "left" ? "md:order-1" : "md:order-3"}`}
              >
                {callouts[side].map((c) => (
                  <li
                    key={c}
                    className={`flex items-center gap-4 ${side === "left" ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <span
                      className={`text-xl lg:text-2xl font-semibold text-stone-900 leading-tight min-w-0 ${side === "left" ? "md:text-right" : ""}`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {c}
                    </span>
                    <span aria-hidden="true" className="hidden md:block flex-1 min-w-8 h-px bg-stone-900" />
                    <span aria-hidden="true" className="hidden md:block w-2 h-2 rounded-full bg-orange-600 shrink-0" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to cook (dark band) ── */}
      <section className="mt-24 md:mt-28 bg-stone-900 text-white py-16 md:py-20 overflow-hidden">
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
          <figure className="min-w-0 aspect-[16/10] lg:aspect-auto lg:h-[440px] mx-6 lg:mx-0 rounded-3xl lg:rounded-l-none lg:rounded-r-[2.5rem] overflow-hidden">
            <img src="/school1.webp" alt="Fresh pasta being cooked in a big pot" className="w-full h-full object-cover" />
          </figure>
          <div className="min-w-0 px-6 md:px-14 lg:px-0 lg:pr-20">
            <h2
              className="text-[2.4rem] md:text-[3.2rem] font-semibold leading-[1.02]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              How to cook Bon Appetit pasta?
            </h2>
            <ol className="mt-10">
              {cookSteps.map((s, i) => (
                <li key={s.text} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < cookSteps.length - 1 && (
                    <span aria-hidden="true" className="absolute left-7 top-14 bottom-0 w-px bg-orange-400/70" />
                  )}
                  <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white text-orange-600 shrink-0">
                    <s.icon className="w-6 h-6" strokeWidth={1.6} />
                  </span>
                  <p className="pt-3.5 text-stone-200 leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-stone-400 leading-relaxed max-w-lg">
              Tip: for a silky texture, rinse the pasta in cold water before boiling — just don't leave it sitting in
              the water for more than 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* ── Good to know: taped notes ── */}
      <section className="px-6 md:px-14 xl:px-20 pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10">
            <h2
              className="text-[2.4rem] md:text-[3.2rem] font-light text-stone-900 leading-[1.02]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Good to know.
            </h2>
            <Link
              to="/faq"
              className={`group text-sm font-semibold text-orange-700 inline-flex items-center gap-1.5 whitespace-nowrap ${focusRing}`}
            >
              All questions
              <ArrowRight className="w-3.5 h-3.5 motion-safe:transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative">
            <RailArrows step={notesRail.step} page={notesRail.page} pages={notesRail.pages} label="notes" />
            <ul ref={notesRail.ref} className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory pt-12">
              {notes.map((n) => (
                <li key={n.q} className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <article className="relative h-full rounded-xl bg-orange-50 border border-orange-100 pb-10">
                    <div className="relative -mt-4 mx-3">
                      <span className="tape -top-2 left-3 -rotate-[24deg]" aria-hidden="true" />
                      <span className="tape -bottom-1 right-4 -rotate-[20deg] z-10" aria-hidden="true" />
                      <h3
                        className="torn-edge bg-white shadow-sm px-6 pt-6 pb-8 text-center text-2xl font-semibold text-stone-900"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {n.q}
                      </h3>
                    </div>
                    <p className="mt-8 px-8 text-center text-lg leading-relaxed text-stone-700">{n.a}</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
          <RailDots go={notesRail.go} page={notesRail.page} pages={notesRail.pages} label="Notes" />
        </div>
      </section>

      {/* ── Kitchen location ── */}
      <section className="px-6 md:px-14 xl:px-20 py-24 md:py-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 md:gap-14 md:items-stretch">
          <div className="flex flex-col justify-between gap-8 border-t border-stone-900 pt-6">
            <div>
              <h2
                className="text-[2rem] md:text-[2.6rem] font-light text-stone-900 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our kitchen.
              </h2>
              <p className="mt-4 flex gap-2.5 text-stone-600 text-sm leading-relaxed">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-600" />
                <span>
                  8-1-284/OU/461, OU Colony
                  <br />
                  Shaikpet, Hyderabad, Telangana 500008
                </span>
              </p>
            </div>
            <Link
              to="/contact"
              className={`group text-sm font-semibold text-orange-700 inline-flex items-center gap-1.5 whitespace-nowrap w-fit ${focusRing}`}
            >
              Get in touch
              <ArrowRight className="w-3.5 h-3.5 motion-safe:transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="h-80 md:h-96 overflow-hidden bg-stone-100">
            <iframe
              title="Bon Appetit kitchen location"
              src="https://www.google.com/maps?q=8-1-284/OU/461,OU+Colony,Shaikpet,Hyderabad,Telangana+500008&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
