/* Hallmark · macrostructure: Film Roll (horizontal snap-scroll film strip → taped photo wall → one-line close)
 * theme: custom (project tokens · Cormorant Garamond + DM Sans · orange accent on a stone-900 roll)
 * inspiration: Awwwards film-roll / horizontal-scroll galleries, contact-sheet navigation (structure only)
 * audience: people curious about the kitchen · use: look through the photos · tone: warm editorial, darkroom
 * enrichment: Tier A CSS sprocket holes · real photos only, honest captions (no invented dates or places)
 * pre-emit critique: P5 H4 E4 S5 R5 V5
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Instagram, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";

const frames = [
  { src: "/bts1.webp", w: 975, h: 1300, caption: "Morning prep with the kitchen team" },
  { src: "/spinachpasta (1).webp", w: 4032, h: 3024, caption: "Spinach pasta and what goes into it" },
  { src: "/workshop1.webp", w: 1300, h: 1300, caption: "A live pasta demo" },
  { src: "/aboutus.webp", w: 682, h: 680, caption: "Paprika, spinach and beetroot packs" },
  { src: "/cmpic21.webp", w: 569, h: 1300, caption: "At our stall" },
  { src: "/school1.webp", w: 973, h: 1300, caption: "Cooking for a crowd" },
  { src: "/cmpic1.webp", w: 505, h: 1300, caption: "Meeting people at our stall" },
  { src: "/school2.webp", w: 1600, h: 1200, caption: "A cooking session with students" },
];

/* Each print on the wall leans a little; the angles repeat so the wall never looks machine-straight */
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-[0.5deg]", "-rotate-[1.5deg]"];

const no = (i: number) => String(i + 1).padStart(2, "0");
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Sprocket holes along the film edge — pure CSS */
const Sprockets = () => (
  <div
    aria-hidden="true"
    className="h-3 mx-4 rounded-sm bg-[length:28px_100%] bg-repeat-x bg-[linear-gradient(90deg,theme(colors.stone.100)_0_14px,transparent_14px)] opacity-80"
  />
);

const RoundBtn = ({ onClick, label, children, dark = false }: { onClick: () => void; label: string; children: React.ReactNode; dark?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`flex items-center justify-center w-11 h-11 rounded-full border transition-colors active:translate-y-px ${focusRing} ${
      dark
        ? "border-stone-600 text-stone-100 hover:border-orange-500 hover:bg-orange-600"
        : "border-stone-300 text-stone-700 hover:border-orange-600 hover:text-orange-700"
    }`}
  >
    {children}
  </button>
);

const Gallery = () => {
  const roll = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  // Which frame is "on": the one nearest the middle; the very ends of the roll count as the first / last frame
  const measure = useCallback(() => {
    const el = roll.current;
    if (!el) return;
    if (el.scrollLeft < 8) return setCurrent(0);
    if (el.scrollLeft + el.clientWidth > el.scrollWidth - 8) return setCurrent(frames.length - 1);
    const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    el.querySelectorAll<HTMLElement>("[data-i]").forEach((f) => {
      const r = f.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestDist) { bestDist = d; best = Number(f.dataset.i); }
    });
    setCurrent(best);
  }, []);

  useEffect(() => {
    const el = roll.current;
    el?.addEventListener("scroll", measure, { passive: true }); // 8 frames: measuring per event is cheap
    return () => el?.removeEventListener("scroll", measure);
  }, [measure]);

  const goTo = useCallback((i: number) => {
    const n = (i + frames.length) % frames.length;
    roll.current
      ?.querySelector<HTMLElement>(`[data-i="${n}"]`)
      ?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, []);

  const step = (dir: 1 | -1) => setOpen((o) => (o === null ? o : (o + dir + frames.length) % frames.length));

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      <header className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 pt-12 md:pt-16 pb-8 md:pb-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="min-w-0">
          <h1
            className="text-[2.8rem] sm:text-[3.6rem] xl:text-[4.6rem] font-semibold leading-[1.02] text-stone-900 [overflow-wrap:anywhere]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The kitchen, <span className="text-orange-600">in pictures.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-stone-600">
            One roll of film from our Hyderabad kitchen. Swipe through it, or tap a frame to see it big.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500 tabular-nums whitespace-nowrap" aria-live="polite">
            Frame <span className="font-semibold text-stone-900">{no(current)}</span> of {no(frames.length - 1)}
          </span>
          <RoundBtn onClick={() => goTo(current - 1)} label="Previous frame"><ArrowLeft className="w-4 h-4" /></RoundBtn>
          <RoundBtn onClick={() => goTo(current + 1)} label="Next frame"><ArrowRight className="w-4 h-4" /></RoundBtn>
        </div>
      </header>

      {/* ── The roll ── */}
      <section aria-label="Film roll of kitchen photos" className="bg-stone-900 py-4 md:py-5">
        <Sprockets />
        <div
          ref={roll}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
          }}
          className={`my-4 md:my-5 flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth motion-reduce:scroll-auto px-[8vw] md:px-[20vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${focusRing}`}
        >
          {frames.map((f, i) => (
            <figure key={f.src} data-i={i} className="snap-center shrink-0 flex flex-col">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open frame ${no(i)}: ${f.caption}`}
                className={`group block h-[clamp(280px,56vh,560px)] overflow-hidden bg-stone-800 ${focusRing}`}
                style={{ aspectRatio: `${f.w} / ${f.h}` }}
              >
                <img
                  src={f.src}
                  alt={f.caption}
                  width={f.w}
                  height={f.h}
                  loading={i < 3 ? "eager" : "lazy"}
                  className={`h-full w-full object-cover motion-safe:transition-[transform,opacity] motion-safe:duration-500 group-hover:scale-[1.02] ${
                    i === current ? "opacity-100" : "opacity-60"
                  }`}
                />
              </button>
              <figcaption className="mt-2.5 flex items-baseline gap-3 text-stone-300">
                <span className="text-xs font-semibold text-orange-400 tabular-nums">{no(i)}</span>
                <span className="text-sm truncate max-w-[16rem] sm:max-w-[22rem]">{f.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <Sprockets />
      </section>

      {/* ── Photo wall: prints taped up at slight angles; tap one to see it big ── */}
      <section aria-labelledby="wall-title" className="bg-stone-100 border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 py-14 md:py-20">
          <h2 id="wall-title" className="text-[2rem] md:text-[2.6rem] font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
            The photo wall
          </h2>
          <p className="mt-1 text-stone-600">Every print from the roll, taped up. Tap one to see it big.</p>
          <ol className="mt-10 columns-2 sm:columns-3 lg:columns-4 gap-4 md:gap-7">
            {frames.map((f, i) => (
              <li key={f.src} className="mb-6 md:mb-8 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Open photo ${no(i)}: ${f.caption}`}
                  className={`group relative block w-full text-left bg-white p-2 pb-3 md:p-2.5 md:pb-4 shadow-[0_10px_24px_-14px_theme(colors.stone.900/0.45)] motion-safe:transition-transform motion-safe:duration-300 hover:rotate-0 hover:scale-[1.03] hover:z-10 focus-visible:rotate-0 ${tilts[i % tilts.length]} ${focusRing}`}
                >
                  {/* tape */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 -rotate-3 w-14 h-5 bg-amber-100/80 shadow-sm"
                  />
                  <img
                    src={f.src}
                    alt=""
                    width={f.w}
                    height={f.h}
                    loading="lazy"
                    className="block w-full h-auto bg-stone-200"
                  />
                  <span className="mt-2 flex items-baseline gap-2 px-0.5">
                    <span className="text-xs font-semibold text-orange-700 tabular-nums">{no(i)}</span>
                    <span className="text-xs md:text-sm text-stone-700 leading-snug">{f.caption}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── One-line close ── */}
      <section className="border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 py-10 flex flex-wrap items-center justify-between gap-5">
          <p className="text-2xl md:text-[2rem] font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
            Be in the next roll.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/pasta-workshops"
              className={`inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 px-5 py-3 text-sm font-semibold text-white whitespace-nowrap transition-colors active:translate-y-px ${focusRing}`}
            >
              Join a workshop <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://www.instagram.com/bonappetitcafe_hyd"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border border-stone-300 hover:border-stone-900 px-5 py-3 text-sm font-semibold text-stone-800 whitespace-nowrap transition-colors active:translate-y-px ${focusRing}`}
            >
              <Instagram className="w-4 h-4" /> Follow on Instagram <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Full-screen frame ── */}
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent
          className="max-w-none w-screen h-[100dvh] p-0 border-0 rounded-none bg-stone-950/95 text-stone-100 flex flex-col [&>button:last-child]:hidden"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <DialogTitle className="sr-only">{open !== null ? frames[open].caption : "Photo"}</DialogTitle>
          {open !== null && (
            <>
              <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-4">
                <p className="min-w-0 flex items-baseline gap-3">
                  <span className="text-sm font-semibold text-orange-400 tabular-nums">{no(open)}</span>
                  <span className="truncate">{frames[open].caption}</span>
                </p>
                <RoundBtn dark onClick={() => setOpen(null)} label="Close photo"><X className="w-5 h-5" /></RoundBtn>
              </div>
              <div className="flex-1 min-h-0 px-4 md:px-20 pb-4">
                <img src={frames[open].src} alt={frames[open].caption} className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center justify-center gap-4 pb-6">
                <RoundBtn dark onClick={() => step(-1)} label="Previous photo"><ArrowLeft className="w-4 h-4" /></RoundBtn>
                <span className="text-sm text-stone-400 tabular-nums w-16 text-center">{no(open)} / {no(frames.length - 1)}</span>
                <RoundBtn dark onClick={() => step(1)} label="Next photo"><ArrowRight className="w-4 h-4" /></RoundBtn>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <SimpleFooter />
    </div>
  );
};

export default Gallery;
