/* Hallmark · redesign · macrostructure: Sectioned Catalogue (jump chips → three labelled sections, each laid out its own way → one-line close)
 * theme: custom (project tokens · Cormorant Garamond + DM Sans · orange accent on white / stone-50)
 * nav: shared · footer: shared · previous page shape was Film Roll (single horizontal roll + photo wall)
 * audience: people curious about the kitchen · use: look through the photos by topic · tone: warm editorial
 * enrichment: real photos only, honest captions (no invented dates or places)
 * motion: image hover-zoom (transform) · lightbox · no scroll-linked effects
 * pre-emit critique: P5 H4 E4 S5 R5 V5
 */
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Instagram, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";

type Frame = { src: string; w: number; h: number; caption: string };
type Layout = "duo" | "feature" | "wall";
type Section = { id: string; title: string; line: string; layout: Layout; band: string; frames: Frame[] };

const sections: Section[] = [
  {
    id: "kitchen",
    title: "Kitchen",
    line: "Where every batch is made by hand.",
    layout: "duo",
    band: "bg-white",
    frames: [
      { src: "/bts1.webp", w: 975, h: 1300, caption: "Morning prep with the kitchen team" },
      { src: "/making-of-our-pasta.webp", w: 1778, h: 885, caption: "How our pasta is made, from flour to beetroot pasta" },
    ],
  },
  {
    id: "products",
    title: "Products",
    line: "The packs, and what goes into them.",
    layout: "feature",
    band: "bg-stone-50",
    frames: [
      { src: "/goodness-without-guilt.webp", w: 1672, h: 941, caption: "What goes into our spinach pasta" },
      { src: "/spinachpasta (1).webp", w: 4032, h: 3024, caption: "Spinach pasta and what goes into it" },
      { src: "/aboutus.webp", w: 682, h: 680, caption: "Paprika, spinach and beetroot packs" },
    ],
  },
  {
    id: "workshops",
    title: "Workshops",
    line: "Live demos, classes and our stall.",
    layout: "wall",
    band: "bg-white",
    frames: [
      { src: "/workshop1.webp", w: 1300, h: 1300, caption: "A live pasta demo" },
      { src: "/school2.webp", w: 1600, h: 1200, caption: "A cooking session with students" },
      { src: "/school1.webp", w: 973, h: 1300, caption: "Cooking for a crowd" },
      { src: "/cmpic21.webp", w: 569, h: 1300, caption: "At our stall" },
      { src: "/cmpic1.webp", w: 505, h: 1300, caption: "Meeting people at our stall" },
    ],
  },
];

/* One flat list for the full-screen viewer, so Next / Previous walk through every section in order */
const all = sections.flatMap((s) => s.frames.map((f) => ({ ...f, section: s.title })));
const starts = sections.reduce<number[]>((acc, s, i) => [...acc, (acc[i - 1] ?? 0) + (sections[i - 1]?.frames.length ?? 0)], []);

const no = (i: number) => String(i + 1).padStart(2, "0");
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/* A photo you can open: rounded picture, caption underneath. `fit` crops to a fixed shape; otherwise the photo keeps its own ratio */
const Tile = ({ frame, index, onOpen, fit, className = "" }: { frame: Frame; index: number; onOpen: (i: number) => void; fit?: string; className?: string }) => (
  <figure className={`min-w-0 ${className}`}>
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${no(index)}: ${frame.caption}`}
      className={`group block w-full overflow-hidden rounded-3xl bg-stone-100 text-left ${focusRing}`}
    >
      <img
        src={frame.src}
        alt={frame.caption}
        width={frame.w}
        height={frame.h}
        loading="lazy"
        decoding="async"
        className={`block w-full ${fit ? `${fit} object-cover` : "h-auto"} motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out group-hover:scale-[1.03]`}
      />
    </button>
    <figcaption className="mt-3 flex items-baseline gap-3 px-1">
      <span className="text-xs font-semibold text-orange-700 tabular-nums">{no(index)}</span>
      <span className="text-sm text-stone-700 leading-snug">{frame.caption}</span>
    </figcaption>
  </figure>
);

const Layouts = ({ section, start, onOpen }: { section: Section; start: number; onOpen: (i: number) => void }) => {
  const f = section.frames;
  if (section.layout === "duo") {
    return (
      <div className="grid gap-6 md:gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start">
        {f.map((fr, n) => <Tile key={fr.src} frame={fr} index={start + n} onOpen={onOpen} />)}
      </div>
    );
  }
  if (section.layout === "feature") {
    return (
      <div className="grid gap-6 md:gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Tile frame={f[0]} index={start} onOpen={onOpen} className="sm:col-span-2" />
        {f.slice(1).map((fr, n) => <Tile key={fr.src} frame={fr} index={start + n + 1} onOpen={onOpen} fit="aspect-[4/3]" />)}
      </div>
    );
  }
  return (
    <div className="columns-2 md:columns-3 gap-4 md:gap-6">
      {f.map((fr, n) => <Tile key={fr.src} frame={fr} index={start + n} onOpen={onOpen} className="mb-6 break-inside-avoid" />)}
    </div>
  );
};

const Gallery = () => {
  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback((dir: 1 | -1) => setOpen((o) => (o === null ? o : (o + dir + all.length) % all.length)), []);

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      <header className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 pt-12 md:pt-16 pb-10 md:pb-12">
        <h1
          className="text-[3rem] sm:text-[4rem] xl:text-[5rem] font-semibold leading-[1.02] text-stone-900 [overflow-wrap:anywhere]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The <span className="text-orange-600">Gallery.</span>
        </h1>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-stone-600">Our kitchen, our packs and our workshops. Tap any photo to see it big.</p>

        <nav aria-label="Gallery sections" className="mt-8">
          <ul className="flex flex-wrap gap-3">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => jump(e, s.id)}
                  className={`inline-flex items-center gap-2.5 rounded-full border border-stone-300 hover:border-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-800 whitespace-nowrap transition-colors active:translate-y-px ${focusRing}`}
                >
                  {s.title}
                  <span className="text-xs font-medium text-stone-500 tabular-nums">{s.frames.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {sections.map((s, si) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className={`scroll-mt-20 border-t border-stone-200 ${s.band}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 py-14 md:py-20">
            <div className="mb-8 md:mb-12 min-w-0">
              <h2
                id={`${s.id}-title`}
                className="text-[2.4rem] md:text-[3.4rem] font-semibold leading-[1.02] text-stone-900 [overflow-wrap:anywhere]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.title}
              </h2>
              <p className="mt-3 text-lg text-stone-600">{s.line}</p>
            </div>
            <Layouts section={s} start={starts[si]} onOpen={setOpen} />
          </div>
        </section>
      ))}

      {/* ── One-line close ── */}
      <section className="border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 py-10 flex flex-wrap items-center justify-between gap-5">
          <p className="text-2xl md:text-[2rem] font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
            Be in the next photo.
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

      {/* ── Full-screen photo ── */}
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent
          className="max-w-none w-screen h-[100dvh] p-0 border-0 rounded-none bg-stone-950/95 text-stone-100 flex flex-col [&>button:last-child]:hidden"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <DialogTitle className="sr-only">{open !== null ? all[open].caption : "Photo"}</DialogTitle>
          {open !== null && (
            <>
              <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-4">
                <p className="min-w-0 flex items-baseline gap-3">
                  <span className="text-sm font-semibold text-orange-400 tabular-nums">{no(open)}</span>
                  <span className="truncate">{all[open].caption}</span>
                  <span className="hidden sm:inline text-sm text-stone-400 whitespace-nowrap">· {all[open].section}</span>
                </p>
                <RoundBtn dark onClick={() => setOpen(null)} label="Close photo"><X className="w-5 h-5" /></RoundBtn>
              </div>
              <div className="flex-1 min-h-0 px-4 md:px-20 pb-4">
                <img src={all[open].src} alt={all[open].caption} className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center justify-center gap-4 pb-6">
                <RoundBtn dark onClick={() => step(-1)} label="Previous photo"><ArrowLeft className="w-4 h-4" /></RoundBtn>
                <span className="text-sm text-stone-400 tabular-nums w-16 text-center">{no(open)} / {no(all.length - 1)}</span>
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
