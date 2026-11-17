/* Hallmark · redesign · macrostructure: Flush Mosaic (photos locked into columns that all end at the same height, no cropping on desktop → 2-up grid on phones → full-screen viewer with a thumbnail strip)
 * theme: custom (project tokens · Cormorant Garamond + DM Sans · orange accent on white / stone-950 viewer)
 * nav: shared · footer: shared · earlier shapes of this page: Film Roll, Sectioned Catalogue
 * references: justified / flush photo layouts (Flickr, Google Photos style), lightbox galleries with a thumbnail strip (Awwwards-style)
 * audience: people curious about the kitchen · use: look through the photos · tone: warm editorial
 * enrichment: only photos that appear nowhere else on the site, honest captions (no invented dates or places)
 * motion: image hover-zoom (transform) · viewer · no scroll-linked effects
 * pre-emit critique: P5 H4 E4 S5 R5 V5
 *
 * To add photos: append to `photos` below. Anything not placed in `columns` shows in a grid under the mosaic,
 * so a new photo never disappears. Add its index to `columns` to build it into the mosaic.
 */
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Instagram, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";

type Photo = { src: string; w: number; h: number; caption: string };

const photos: Photo[] = [
  { src: "/workshop1.webp", w: 1300, h: 1300, caption: "A live pasta demo" },
  { src: "/school2.webp", w: 1600, h: 1200, caption: "A cooking session with students" },
  { src: "/cmpic21.webp", w: 569, h: 1300, caption: "At our stall" },
  { src: "/cmpic1.webp", w: 505, h: 1300, caption: "Meeting people at our stall" },
];

/* Desktop mosaic recipe: indexes into `photos`, grouped into columns. A column holding photos of ratio r1, r2…
 * gets a width of 1 / (1/r1 + 1/r2 + …), which makes every column end at exactly the same height. */
const columns: number[][] = [[0, 1], [2], [3]];

const ratio = (p: Photo) => p.w / p.h;
const colFr = columns.map((c) => 1 / c.reduce((sum, i) => sum + 1 / ratio(photos[i]), 0));
const placed = new Set(columns.flat());
const extra = photos.map((_, i) => i).filter((i) => !placed.has(i));

const no = (i: number) => String(i + 1).padStart(2, "0");
const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";

const RoundBtn = ({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`flex items-center justify-center w-11 h-11 rounded-full border border-stone-600 text-stone-100 transition-colors hover:border-orange-500 hover:bg-orange-600 active:translate-y-px ${focusRing}`}
  >
    {children}
  </button>
);

/* One photo you can open. `fill` makes it fill its parent's height (cropping a hair); otherwise it keeps its own ratio via `ar`. */
const Tile = ({ index, onOpen, className = "", fill = false }: { index: number; onOpen: (i: number) => void; className?: string; fill?: boolean }) => {
  const p = photos[index];
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${no(index)}: ${p.caption}`}
      style={{ ["--ar" as string]: `${p.w} / ${p.h}` }}
      className={`group relative block w-full overflow-hidden rounded-3xl bg-stone-100 text-left ${fill ? "h-full" : "[aspect-ratio:var(--ar)]"} ${className} ${focusRing}`}
    >
      <img
        src={p.src}
        alt={p.caption}
        width={p.w}
        height={p.h}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        className="block w-full h-full object-cover will-change-transform motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out group-hover:scale-[1.03]"
      />
      <span className="absolute inset-x-0 bottom-0 flex items-baseline gap-2.5 bg-gradient-to-t from-stone-950/75 via-stone-950/30 to-transparent px-4 pb-3.5 pt-12 text-white">
        <span className="text-xs font-semibold text-orange-300 tabular-nums">{no(index)}</span>
        <span className="text-sm leading-snug">{p.caption}</span>
      </span>
    </button>
  );
};

const Gallery = () => {
  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback((dir: 1 | -1) => setOpen((o) => (o === null ? o : (o + dir + photos.length) % photos.length)), []);

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      <header className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 pt-12 md:pt-16 pb-8 md:pb-12 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="min-w-0">
          <h1
            className="text-[3rem] sm:text-[4rem] xl:text-[5rem] font-semibold leading-[1.02] text-stone-900 [overflow-wrap:anywhere]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The <span className="text-orange-600">Gallery.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-stone-600">Workshops, classes and our stall, in photos. Tap one to see it big.</p>
        </div>
        <p className="text-sm text-stone-500 tabular-nums whitespace-nowrap">{photos.length} photos</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 pb-16 md:pb-24">
        {/* phones and tablets: 2-up grid, wide photos span both columns, tall ones are cropped to 3:4 */}
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:hidden">
          {photos.map((p, i) => (
            <li key={p.src} className={`min-w-0 ${p.w >= p.h ? "col-span-2" : ""}`}>
              <Tile index={i} onOpen={setOpen} className={p.w >= p.h ? "" : "!aspect-[3/4]"} />
            </li>
          ))}
        </ul>

        {/* desktop: flush mosaic, every column ends at the same height and nothing is cropped (give or take a pixel) */}
        <div className="hidden lg:grid gap-4" style={{ gridTemplateColumns: colFr.map((f) => `${f}fr`).join(" ") }}>
          {columns.map((col, ci) => (
            <div key={ci} className="flex min-w-0 flex-col gap-4">
              {col.map((i) => (
                <div key={i} className={col.length > 1 ? "" : "flex-1 min-h-0"}>
                  <Tile index={i} onOpen={setOpen} fill={col.length === 1} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* photos added to the list but not yet placed in the mosaic */}
        {extra.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 [&>li]:min-w-0 hidden lg:grid">
            {extra.map((i) => (
              <li key={photos[i].src}>
                <Tile index={i} onOpen={setOpen} className="!aspect-[4/3]" />
              </li>
            ))}
          </ul>
        )}
      </main>

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

      {/* ── Full-screen viewer with a thumbnail strip ── */}
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent
          className="max-w-none w-screen h-[100dvh] p-0 border-0 rounded-none bg-stone-950/95 text-stone-100 flex flex-col [&>button:last-child]:hidden"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <DialogTitle className="sr-only">{open !== null ? photos[open].caption : "Photo"}</DialogTitle>
          {open !== null && (
            <>
              <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-4">
                <p className="min-w-0 flex items-baseline gap-3">
                  <span className="text-sm font-semibold text-orange-400 tabular-nums">{no(open)}</span>
                  <span className="truncate">{photos[open].caption}</span>
                </p>
                <RoundBtn onClick={() => setOpen(null)} label="Close photo"><X className="w-5 h-5" /></RoundBtn>
              </div>

              <div className="relative flex-1 min-h-0 px-4 md:px-20 pb-4">
                <img src={photos[open].src} alt={photos[open].caption} className="w-full h-full object-contain" />
                <div className="pointer-events-none absolute inset-y-0 left-2 right-2 md:left-6 md:right-6 flex items-center justify-between">
                  <span className="pointer-events-auto"><RoundBtn onClick={() => step(-1)} label="Previous photo"><ArrowLeft className="w-4 h-4" /></RoundBtn></span>
                  <span className="pointer-events-auto"><RoundBtn onClick={() => step(1)} label="Next photo"><ArrowRight className="w-4 h-4" /></RoundBtn></span>
                </div>
              </div>

              <ul className="flex items-center justify-center gap-2 px-4 pb-6" aria-label="All photos">
                {photos.map((p, i) => (
                  <li key={p.src}>
                    <button
                      type="button"
                      onClick={() => setOpen(i)}
                      aria-label={`Show photo ${no(i)}: ${p.caption}`}
                      aria-current={i === open ? "true" : undefined}
                      className={`block w-12 h-12 md:w-14 md:h-14 overflow-hidden rounded-xl ring-2 transition-opacity ${focusRing} ${
                        i === open ? "ring-orange-500 opacity-100" : "ring-transparent opacity-55 hover:opacity-100"
                      }`}
                    >
                      <img src={p.src} alt="" width={112} height={112} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>

      <SimpleFooter />
    </div>
  );
};

export default Gallery;
