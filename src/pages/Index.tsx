/* Hallmark · study → rebuild · genre: editorial · macrostructure: Shelf Stack · theme: custom (project tokens)
 * tone: warm editorial · anchor hue: warm orange · nav: shared · footer: shared (Ft2)
 * section rhythm studied from a reference D2C food home page; type, colour and copy are Bon Appetit's own
 * sections: banner hero + retail band · "what is" card + ribbon · our stars spotlight index (names left, logo preview right) · menu · callout diagram · taped notes rail · kitchen map
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
import { SimpleFooter } from "@/components/Footer";
import {
  AvailableOn,
  CareersCallout,
  Flyer,
  JourneyTeaser,
  MomentsSlot,
  NutritionSlot,
  PastaPacks,
  ProductShowcase,
  SHOW_PLACEHOLDERS,
} from "@/components/HomeSections";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600";


const ribbon = ["Handmade daily", "No preservatives", "5 natural flavours", "Ready in 5 minutes", "Made in Hyderabad"];

// The six things we make, each shown by its own logo artwork (pure-white backgrounds, so they sit cleanly on white)
const stars: { name: string; image: string; to: string; badge?: string }[] = [
  { name: "Fresh Pasta", image: "/freshpasta.webp", to: "/fresh-pasta", badge: "Made to order" },
  { name: "Dry Pasta", image: "/drypasta.webp", to: "/our-pasta-brand" },
  { name: "Seasonal Sauces", image: "/seaonal.webp", to: "/seasonal-sauces" },
  { name: "Cooked Pasta", image: "/cooked.webp", to: "/cooked-pasta" },
  { name: "Dessert Platters", image: "/dessertplatter.webp", to: "/dessert-platters" },
  { name: "Pasta Workshops", image: "/pastaworkshop.webp", to: "/pasta-workshops" },
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
    if (!el || !el.clientWidth) return; // not laid out yet (hidden tab): avoid dividing by zero
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
  const [star, setStar] = useState(0);
  const notesRail = useRail();

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Main flyer ── */}
      <Flyer />

      {/* ── What is handmade pasta? (copy to come) ── */}
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
                What is handmade pasta?
              </h2>
              {SHOW_PLACEHOLDERS && <p className="mt-5 text-stone-500 max-w-xl">Content coming soon.</p>}
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
      {/* Spotlight index: big names on one side, the logo of the one you point at on the other (phones: plain rows with a small logo) */}
      <section aria-labelledby="stars-title" className="px-6 md:px-14 xl:px-20 pt-24 md:pt-32">
        <div className="max-w-6xl mx-auto grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
          <div className="min-w-0">
            <h2
              id="stars-title"
              className="text-[2.6rem] md:text-[3.6rem] font-semibold text-stone-900 leading-[1.02]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our <span className="text-orange-600">stars.</span>
            </h2>
            <ul className="mt-8 md:mt-10 border-t border-stone-200">
              {stars.map((s, i) => (
                <li key={s.name} className="border-b border-stone-200">
                  <Link
                    to={s.to}
                    onMouseEnter={() => setStar(i)}
                    onFocus={() => setStar(i)}
                    className={`group flex items-center gap-4 py-3.5 md:py-5 ${focusRing}`}
                  >
                    <span aria-hidden="true" className="lg:hidden block w-14 h-14 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-stone-200">
                      <img src={s.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-contain scale-[1.4]" />
                    </span>
                    <span
                      className={`min-w-0 text-[1.7rem] md:text-[2.5rem] font-semibold leading-none motion-safe:transition-colors motion-safe:duration-200 ${
                        i === star ? "lg:text-orange-600" : "lg:text-stone-900"
                      } text-stone-900 group-hover:text-orange-600`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {s.name}
                    </span>
                    {s.badge && (
                      <span className="hidden sm:inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 whitespace-nowrap">
                        {s.badge}
                      </span>
                    )}
                    <span
                      aria-hidden="true"
                      className="ml-auto flex items-center justify-center w-10 h-10 shrink-0 rounded-full border border-stone-300 text-stone-700 motion-safe:transition-colors group-hover:border-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Preview: all six logos stacked, only opacity changes, so switching never reflows the page */}
          <div aria-hidden="true" className="hidden lg:block relative aspect-square overflow-hidden rounded-[2.5rem] bg-white ring-1 ring-stone-200">
            {stars.map((s, i) => (
              <img
                key={s.name}
                src={s.image}
                alt=""
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-contain scale-[1.2] motion-safe:transition-opacity motion-safe:duration-300 ${
                  i === star ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Small product showcase ── */}
      <ProductShowcase />

      {/* ── The three packs, with size picker and Add to Cart ── */}
      <PastaPacks />

      {/* ── Slots for the nutrition section and featured moments ── */}
      <NutritionSlot />
      <MomentsSlot />

      {/* ── Making of our pasta: full-bleed band in the picture's own paper colour, so the picture has no edges ── */}
      <section aria-label="How our pasta is made" className="mt-24 md:mt-28 bg-[var(--making-paper)] px-4 md:px-14 xl:px-20 pt-10 md:pt-14 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <img
            src="/making-of-our-pasta.webp"
            alt="Making of our pasta: it starts with semolina flour, is mixed with water into a fresh dough, blended with beetroot pulp, and becomes our beetroot pasta."
            loading="lazy"
            width={1778}
            height={885}
            className="block w-full h-auto"
          />
          <div className="mt-6 md:mt-4 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4 text-center">
            <p className="text-lg md:text-xl text-stone-700">Every colour comes from real vegetable pulp.</p>
            <Link
              to="/our-pasta-brand"
              className={`group inline-flex items-center gap-2 rounded-full bg-stone-900 hover:bg-orange-600 active:translate-y-px text-white px-7 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
            >
              See every flavour
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

      {/* ── Goodness without guilt: the supplied callout picture as one big rounded panel, with its next step underneath ── */}
      <section aria-label="What goes into our spinach pasta" className="px-4 md:px-14 xl:px-20 pt-24 md:pt-28">
        <div className="max-w-6xl mx-auto">
          <figure className="overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_60px_-40px_theme(colors.stone.900/0.6)]">
            <img
              src="/goodness-without-guilt.webp"
              alt="Goodness without guilt: 100% semolina, no maida, made with spinach, no artificial colours, no preservatives, ready in 5 minutes."
              loading="lazy"
              width={1672}
              height={941}
              className="block w-full h-auto"
            />
          </figure>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/fresh-pasta"
              className={`group inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 active:translate-y-px text-white px-8 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
            >
              Order fresh pasta
              <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/recipes"
              className={`inline-flex items-center gap-2 rounded-full border border-stone-300 hover:border-stone-900 active:translate-y-px text-stone-800 px-8 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
            >
              Get a recipe
            </Link>
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

      {/* ── Our journey (About teaser) ── */}
      <JourneyTeaser />

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

      {/* ── Available on, then careers ── */}
      <AvailableOn />
      <CareersCallout />

      <SimpleFooter />
    </div>
  );
};

export default Index;
