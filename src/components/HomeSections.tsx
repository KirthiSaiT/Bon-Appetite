/* Homepage sections added in the restructure.
 * Flyer · product showcase · nutrition + featured-moments slots · journey (About) teaser · Available On · Careers call-out.
 * Slots for content that is still being designed render a quiet placeholder; set SHOW_PLACEHOLDERS to false to hide them.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Facebook, Instagram } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-cafe-data";
import PackOrder from "@/components/PackOrder";

export const SHOW_PLACEHOLDERS = true;

/** Drop the designer's flyer at public/flyer.webp and it appears; until then a placeholder holds the space. */
export const FLYER_SRC = "/flyer.webp";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600";

const heading = "font-semibold leading-[1.02] text-stone-900 [overflow-wrap:break-word] min-w-0";

const pill =
  "group inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 active:translate-y-px text-white px-8 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors";

/* ── Main flyer ── */
export const Flyer = () => {
  const [missing, setMissing] = useState(false);
  return (
    <section aria-label="Bon Appetit" className="bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-8 md:pb-12">
        {missing ? (
          SHOW_PLACEHOLDERS ? (
            <div className="flex aspect-[16/9] md:aspect-[21/9] w-full items-center justify-center rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-dashed border-orange-300 bg-orange-50 px-6 text-center">
              <p className="text-lg md:text-2xl text-orange-800" style={{ fontFamily: "var(--font-display)" }}>
                Main flyer goes here
              </p>
            </div>
          ) : null
        ) : (
          <img
            src={FLYER_SRC}
            alt="Bon Appetit"
            onError={() => setMissing(true)}
            className="block w-full h-auto rounded-[1.5rem] md:rounded-[2.5rem]"
          />
        )}
      </div>
    </section>
  );
};

/* ── Small product showcase ── */
const showcase = [
  { name: "Pasta", image: "/freshpasta.webp" },
  { name: "Brownies", image: "/dessertplatter.webp" },
  { name: "Combos", image: "/cooked.webp" },
];

export const ProductShowcase = () => (
  <section aria-labelledby="showcase-title" className="px-6 md:px-14 xl:px-20 pt-20 md:pt-28">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <h2 id="showcase-title" className={`text-[2.2rem] md:text-[3rem] ${heading}`} style={{ fontFamily: "var(--font-display)" }}>
          Fresh from our kitchen.
        </h2>
        <Link to="/cafe" className={`${pill} !px-6 !py-3 shrink-0 ${focusRing}`}>
          Order now
          <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <ul className="mt-8 grid grid-cols-3 gap-3 md:gap-6">
        {showcase.map((s) => (
          <li key={s.name} className="min-w-0">
            <Link
              to="/cafe"
              className={`group block rounded-3xl border border-stone-200 bg-white p-2.5 md:p-4 transition-colors hover:border-orange-600 ${focusRing}`}
            >
              <span className="block aspect-square overflow-hidden rounded-2xl">
                <img
                  src={s.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain scale-[1.25] motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.32]"
                />
              </span>
              <span
                className="mt-2 block text-center text-lg md:text-2xl font-semibold text-stone-900 group-hover:text-orange-700"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ── Slots for material still being made ── */
const Slot = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div
    className={`flex items-center justify-center rounded-3xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 text-center text-stone-500 ${className}`}
  >
    {children}
  </div>
);

export const NutritionSlot = () =>
  SHOW_PLACEHOLDERS ? (
    <section aria-labelledby="nutrition-title" className="px-6 md:px-14 xl:px-20 pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto">
        <h2 id="nutrition-title" className={`text-[2.2rem] md:text-[3rem] ${heading}`} style={{ fontFamily: "var(--font-display)" }}>
          What's in every bowl.
        </h2>
        <Slot className="mt-8 min-h-[16rem] md:min-h-[22rem]">Nutrition information goes here</Slot>
      </div>
    </section>
  ) : null;

export const MomentsSlot = () =>
  SHOW_PLACEHOLDERS ? (
    <section aria-labelledby="moments-title" className="px-6 md:px-14 xl:px-20 pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto">
        <h2 id="moments-title" className={`text-[2.2rem] md:text-[3rem] ${heading}`} style={{ fontFamily: "var(--font-display)" }}>
          Our best moments.
        </h2>
        <ul className="mt-8 grid sm:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((n) => (
            <li key={n} className="min-w-0">
              <Slot className="aspect-[4/3]">Photo and caption {n}</Slot>
            </li>
          ))}
        </ul>
      </div>
    </section>
  ) : null;

/* ── Photo collage: three real photos, tilted and overlapping. Swap the files for making / drying shots when they exist. ── */
export const collagePhotos = [
  { src: "/bts1.webp", alt: "The team at work in our first home kitchen", pos: "50% 40%" },
  { src: "/aboutus.webp", alt: "Our handmade pasta in kraft boxes: artisanal, paprika, spinach and beetroot", pos: "50% 50%" },
  { src: "/cmpic21.webp", alt: "Our founder at a food-startup expo with our pasta boxes", pos: "50% 62%" },
];

export const PhotoCollage = () => (
  <div className="relative min-w-0 aspect-[5/4]">
    <figure className="absolute left-0 top-0 w-[58%] aspect-[4/5] overflow-hidden rounded-3xl border-[6px] border-white shadow-xl -rotate-[3deg]">
      <img src={collagePhotos[0].src} alt={collagePhotos[0].alt} loading="lazy" className="w-full h-full object-cover" style={{ objectPosition: collagePhotos[0].pos }} />
    </figure>
    <figure className="absolute right-0 top-[6%] w-[46%] aspect-square overflow-hidden rounded-3xl border-[6px] border-white shadow-xl rotate-[4deg]">
      <img src={collagePhotos[1].src} alt={collagePhotos[1].alt} loading="lazy" className="w-full h-full object-cover" style={{ objectPosition: collagePhotos[1].pos }} />
    </figure>
    <figure className="absolute right-[10%] bottom-0 w-[40%] aspect-[4/5] overflow-hidden rounded-3xl border-[6px] border-white shadow-xl -rotate-[2deg]">
      <img src={collagePhotos[2].src} alt={collagePhotos[2].alt} loading="lazy" className="w-full h-full object-cover" style={{ objectPosition: collagePhotos[2].pos }} />
    </figure>
  </div>
);

/* ── About teaser: the collage and our journey ── */
export const JourneyTeaser = () => (
  <section aria-labelledby="journey-title" className="px-6 md:px-14 xl:px-20 pt-24 md:pt-28">
    <div className="max-w-6xl mx-auto grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 md:gap-14 items-center">
      <PhotoCollage />
      <div className="min-w-0">
        <h2 id="journey-title" className={`text-[2.2rem] md:text-[3rem] ${heading}`} style={{ fontFamily: "var(--font-display)" }}>
          Our journey.
        </h2>
        <p className="mt-5 text-stone-600 text-base md:text-lg leading-relaxed max-w-lg">
          We started from scratch in 2020. Today Bon Appetit makes fresh and dry pasta by hand, runs pasta workshops and
          delivers across India.
        </p>
        <Link to="/about" className={`${pill} mt-8 ${focusRing}`}>
          Know more about us
          <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  </section>
);

/* ── Our pasta: the three packs, each with a size picker and Add to Cart ── */
const packs = [
  { id: "plain", name: "Artisanal (plain)", src: "/pack-plain.webp", alt: "Artisanal plain pasta in a kraft pouch with a window", swatch: "var(--flavour-plain)" },
  { id: "spinach", name: "Spinach", src: "/pack-spinach.webp", alt: "Spinach pasta in a kraft pouch with a window", swatch: "var(--flavour-spinach)" },
  { id: "beetroot", name: "Beetroot", src: "/pack-beetroot.webp", alt: "Beetroot pasta in a kraft pouch with a window", swatch: "var(--flavour-beetroot)" },
];

export const PastaPacks = () => (
  <section aria-labelledby="packs-title" className="px-6 md:px-14 xl:px-20 pt-24 md:pt-28">
    <div className="max-w-6xl mx-auto">
      <h2 id="packs-title" className={`text-[2.2rem] md:text-[3rem] ${heading}`} style={{ fontFamily: "var(--font-display)" }}>
        Our pasta.
      </h2>
      <p className="mt-3 text-lg text-stone-600">Plain, spinach and beetroot, in kraft pouches with a window.</p>
      <ul className="mt-10 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-6 md:gap-8">
        {packs.map((p) => (
          <li key={p.id} className="min-w-0">
            <figure>
              <div className="aspect-square overflow-hidden rounded-3xl bg-stone-200">
                <img src={p.src} alt={p.alt} width={1000} height={1000} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <figcaption className="mt-3 flex items-center gap-2.5 px-1 text-base font-semibold text-stone-900">
                <span aria-hidden="true" className="w-3 h-3 rounded-full ring-1 ring-stone-900/10" style={{ background: p.swatch }} />
                {p.name}
              </figcaption>
              <PackOrder id={p.id} name={p.name} image={p.src} />
            </figure>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ── Available on: real brand logos ──
 * Logos for Zomato, Swiggy and Amazon come from Admin → Cafe (logo + link per app).
 * Others: put the file at public/logos/<id>.svg (or .png) and it shows; until then the name is shown. */
type Platform = { id: string; name: string; href?: string; logo?: string };

const staticPlatforms: Platform[] = [
  { id: "flipkart", name: "Flipkart", href: "https://www.flipkart.com", logo: "/logos/flipkart.svg" },
  { id: "meesho", name: "Meesho", href: "https://www.meesho.com", logo: "/logos/meesho.svg" },
];

const PlatformMark = ({ p }: { p: Platform }) => {
  const [failed, setFailed] = useState(false);
  const mark =
    p.logo && !failed ? (
      <img src={p.logo} alt={p.name} onError={() => setFailed(true)} className="h-9 md:h-11 w-auto max-w-[8.5rem] object-contain" />
    ) : (
      <span className="text-xl md:text-2xl font-semibold text-stone-800" style={{ fontFamily: "var(--font-display)" }}>
        {p.name}
      </span>
    );
  return p.href ? (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buy on ${p.name}`}
      className={`flex h-16 items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 transition-colors hover:border-orange-600 ${focusRing}`}
    >
      {mark}
    </a>
  ) : (
    <div className="flex h-16 items-center justify-center rounded-2xl border border-stone-200 bg-white px-6">{mark}</div>
  );
};

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/bonappetitcafe_hyd", icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/bonappetitcafe", icon: Facebook },
];

export const AvailableOn = () => {
  const { get } = useSiteSettings();
  const apps: Platform[] = (["zomato", "swiggy", "amazon"] as const).map((id) => ({
    id,
    name: id[0].toUpperCase() + id.slice(1),
    href: get(`cafe.${id}_url`) || (id === "amazon" ? "https://www.amazon.in" : undefined),
    logo: get(`cafe.${id}_logo`) || `/logos/${id}.svg`,
  }));
  const platforms = [...apps, ...staticPlatforms];

  return (
    <section aria-labelledby="available-title" className="px-6 md:px-14 xl:px-20 pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto">
        <h2 id="available-title" className={`text-[2.2rem] md:text-[3rem] ${heading}`} style={{ fontFamily: "var(--font-display)" }}>
          Available on.
        </h2>
        <ul className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
          {platforms.map((p) => (
            <li key={p.id} className="min-w-0">
              <PlatformMark p={p} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center gap-4">
          <p className="text-stone-600">Follow us</p>
          <ul className="flex gap-3">
            {socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition-colors hover:border-orange-600 hover:bg-orange-600 hover:text-white ${focusRing}`}
                >
                  <s.icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

/* ── Careers call-out ── */
export const CareersCallout = () => (
  <section aria-labelledby="careers-title" className="px-6 md:px-14 xl:px-20 py-24 md:py-28">
    <div className="max-w-6xl mx-auto rounded-[2rem] md:rounded-[3rem] bg-orange-100 px-6 py-14 md:px-16 md:py-20 text-center">
      <h2
        id="careers-title"
        className="mx-auto max-w-2xl text-[2.2rem] md:text-[3.2rem] font-semibold leading-[1.05] text-orange-900 [overflow-wrap:break-word]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Want to join us on this mission?
      </h2>
      <Link to="/careers" className={`${pill} mt-8 ${focusRing}`}>
        Explore opportunities
        <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  </section>
);
