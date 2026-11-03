/* Hallmark · genre: editorial · macrostructure: Catalogue (masonry) · shared system
 * theme: custom (light / classical-serif / warm-orange) · enrichment: photographic
 * pre-emit critique: P4 H4 E4 S4 R5 V4
 */
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Images,
  Users,
  ChefHat,
  GraduationCap,
  Camera,
  PartyPopper,
  Instagram,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const galleryItems = [
  {
    id: 1,
    title: "Our Professional Kitchen",
    image: "/cmpic1.webp",
    category: "events",
    tag: "CM Event",
    location: "Main Kitchen",
    date: "Est. 2023",
    desc: "State-of-the-art commercial kitchen where every pasta is crafted with precision and love.",
  },
  {
    id: 2,
    title: "Community Gathering",
    image: "/cmpic21.webp",
    category: "events",
    tag: "CM Event",
    location: "Event Venue",
    date: "August 2025",
    desc: "A vibrant gathering that showcases the growing community of pasta lovers around our brand.",
  },
  {
    id: 3,
    title: "Behind the Scenes",
    image: "/bts1.webp",
    category: "bts",
    tag: "Behind the Scenes",
    location: "Prep Station",
    date: "Daily Operations",
    desc: "The unseen care and dedication that goes into every single batch of pasta we make.",
  },
  {
    id: 4,
    title: "School Cooking Class",
    image: "/school1.webp",
    category: "school",
    tag: "School Event",
    location: "School Kitchen",
    date: "Spring 2025",
    desc: "Inspiring the next generation of chefs through interactive, hands-on cooking experiences.",
  },
  {
    id: 5,
    title: "Pasta Making Workshop",
    image: "/workshop1.webp",
    category: "workshop",
    tag: "Workshop",
    location: "Workshop Studio",
    date: "Summer 2025",
    desc: "Participants mastering the art of fresh pasta from scratch — flour, eggs, and passion.",
  },
  {
    id: 6,
    title: "Italian Baking Session",
    image: "/school2.webp",
    category: "workshop",
    tag: "Workshop",
    location: "Baking Studio",
    date: "Autumn 2025",
    desc: "Exploring Italian flavours through a collaborative workshop full of laughter and learning.",
  },
];

const categories: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "all", label: "All", icon: Images },
  { value: "events", label: "CM Events", icon: Users },
  { value: "workshop", label: "Workshops", icon: ChefHat },
  { value: "school", label: "School Events", icon: GraduationCap },
  { value: "bts", label: "Behind the Scenes", icon: Camera },
];

const iconFor = (category: string) => categories.find((c) => c.value === category)?.icon ?? Images;

// Alternating ratios give the masonry its rhythm
const ratios = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[4/5]"];

const involvement: { title: string; text: string; icon: LucideIcon; to?: string; href?: string }[] = [
  { title: "Join a workshop", text: "Make fresh pasta from scratch. Beginners welcome.", icon: ChefHat, to: "/pasta-workshops" },
  { title: "Bring us to school", text: "Hands-on cooking classes for young chefs.", icon: GraduationCap, to: "/contact" },
  { title: "Host an event", text: "Pasta for gatherings, big or small.", icon: PartyPopper, to: "/contact" },
  { title: "Follow along", text: "Recipes and kitchen moments on Instagram.", icon: Instagram, href: "https://www.instagram.com/bonappetitcafe_hyd" },
];

type GalleryItem = (typeof galleryItems)[0];

// ── Circle icon + label, per the circles sketch ──
const CircleIcon = ({ icon: Icon, active = false, size = "lg" }: { icon: LucideIcon; active?: boolean; size?: "lg" | "sm" }) => (
  <span
    className={`flex items-center justify-center rounded-full transition-colors duration-200 ${
      size === "lg" ? "w-[4.5rem] h-[4.5rem] md:w-24 md:h-24" : "w-7 h-7"
    } ${
      active
        ? "bg-orange-600 text-white ring-2 ring-orange-600 ring-offset-4 ring-offset-white"
        : "bg-stone-100 text-stone-700 group-hover:bg-orange-50 group-hover:text-orange-700"
    }`}
  >
    <Icon className={size === "lg" ? "w-7 h-7 md:w-8 md:h-8" : "w-3.5 h-3.5"} strokeWidth={1.5} />
  </span>
);

// ── Masonry tile: photo with caption beneath ──
const GalleryTile = ({ item, ratio, onClick }: { item: GalleryItem; ratio: string; onClick: () => void }) => {
  const Icon = iconFor(item.category);
  return (
    <figure className="break-inside-avoid mb-8">
      <button
        onClick={onClick}
        className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
        aria-label={`Open ${item.title}`}
      >
        <div className={`relative overflow-hidden bg-stone-100 ${ratio}`}>
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <figcaption className="pt-4 flex gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center mt-0.5">
            <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
          <span className="min-w-0">
            <span
              className="block text-xl md:text-2xl font-semibold text-stone-900 leading-tight group-hover:text-orange-700 transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.title}
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
              <span>{item.tag}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.date}</span>
            </span>
          </span>
        </figcaption>
      </button>
    </figure>
  );
};

const Gallery = () => {
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? galleryItems : galleryItems.filter((g) => g.category === activeTab);
  const currentItem = galleryItems.find((g) => g.id === lightboxId) ?? null;
  const currentIndex = currentItem ? filtered.findIndex((g) => g.id === currentItem.id) : -1;

  const navigateLightbox = (dir: 1 | -1) => {
    if (currentIndex < 0) return;
    setLightboxId(filtered[(currentIndex + dir + filtered.length) % filtered.length].id);
  };

  const countFor = (value: string) =>
    value === "all" ? galleryItems.length : galleryItems.filter((g) => g.category === value).length;

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Intro + circle filters ── */}
      <section className="px-6 md:px-14 xl:px-20 pt-14 md:pt-20 pb-10 md:pb-14 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 md:gap-16 md:items-end">
            <h1
              className="text-[2.6rem] md:text-[3.6rem] xl:text-[4.4rem] font-bold leading-[1.02] text-stone-900 [overflow-wrap:anywhere] min-w-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Where pasta brings <span className="text-orange-600">people together.</span>
            </h1>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-md">
              Workshops, school classes, community events and the quiet hours in our Hyderabad kitchen —
              pick a moment below.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter photos by category"
            className="mt-12 md:mt-16 -mx-6 px-6 md:mx-0 md:px-0 flex gap-6 md:gap-12 overflow-x-auto md:overflow-visible snap-x scroll-px-6 md:scroll-px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-2 pb-2"
          >
            {categories.map((c) => {
              const active = activeTab === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => setActiveTab(c.value)}
                  aria-pressed={active}
                  className="group snap-start flex-shrink-0 flex flex-col items-center gap-3 pt-1 focus-visible:outline-none [&:focus-visible>span:first-child]:ring-2 [&:focus-visible>span:first-child]:ring-orange-600 [&:focus-visible>span:first-child]:ring-offset-4"
                >
                  <CircleIcon icon={c.icon} active={active} />
                  <span className="text-center">
                    <span className={`block text-sm font-semibold whitespace-nowrap ${active ? "text-orange-700" : "text-stone-800"}`}>
                      {c.label}
                    </span>
                    <span className="block text-xs text-stone-400 mt-0.5">
                      {countFor(c.value)} {countFor(c.value) === 1 ? "photo" : "photos"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Masonry ── */}
      <section className="px-6 md:px-14 xl:px-20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-stone-500 mb-8" aria-live="polite">
            Showing {filtered.length} {filtered.length === 1 ? "moment" : "moments"}
            {activeTab !== "all" && ` in ${categories.find((c) => c.value === activeTab)?.label}`}
          </p>
          {filtered.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
              {filtered.map((item) => (
                <GalleryTile
                  key={item.id}
                  item={item}
                  ratio={ratios[(item.id - 1) % ratios.length]}
                  onClick={() => setLightboxId(item.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-stone-400 py-20 text-center text-lg">No photos in this category yet — check back soon.</p>
          )}
        </div>
      </section>

      {/* ── Be part of our story: circle icons ── */}
      <section className="px-6 md:px-14 xl:px-20 py-16 md:py-24 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-[2rem] md:text-[2.8rem] font-bold text-stone-900 leading-tight mb-12 md:mb-16"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Be part of our story.
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-y-12">
            {involvement.map((it) => {
              const inner = (
                <>
                  <span className="flex-shrink-0 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border border-stone-200 text-stone-700 transition-colors duration-200 group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white">
                    <it.icon className="w-8 h-8" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 sm:mt-5">
                    <span className="flex items-center gap-1 text-base md:text-lg font-semibold text-stone-900 whitespace-nowrap group-hover:text-orange-700 transition-colors">
                      {it.title}
                      <ArrowUpRight className="w-4 h-4 flex-shrink-0 motion-safe:transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    <span className="block mt-1.5 text-sm text-stone-500 leading-relaxed max-w-[16rem]">{it.text}</span>
                  </span>
                </>
              );
              const cls =
                "group flex flex-row sm:flex-col items-center sm:items-start gap-5 sm:gap-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600";
              return (
                <li key={it.title} className="min-w-0">
                  {it.to ? (
                    <Link to={it.to} className={cls}>{inner}</Link>
                  ) : (
                    <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <Dialog open={lightboxId !== null} onOpenChange={(open) => !open && setLightboxId(null)}>
        <DialogContent className="max-w-5xl w-full p-0 overflow-hidden border-0 gap-0 rounded-none">
          <DialogTitle className="sr-only">{currentItem?.title ?? "Gallery image"}</DialogTitle>
          {currentItem && (
            <div className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:min-h-[520px]">
              <div className="relative bg-stone-900 min-h-[300px]">
                <img src={currentItem.image} alt={currentItem.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="bg-white flex flex-col p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <CircleIcon icon={iconFor(currentItem.category)} size="sm" />
                  <span className="text-orange-700 text-xs font-semibold">{currentItem.tag}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {currentItem.title}
                </h2>
                <p className="text-stone-600 leading-relaxed text-sm flex-1">{currentItem.desc}</p>
                <div className="mt-6 pt-6 border-t border-stone-100 space-y-3">
                  <div className="flex items-center gap-2.5 text-sm text-stone-500"><MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />{currentItem.location}</div>
                  <div className="flex items-center gap-2.5 text-sm text-stone-500"><Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />{currentItem.date}</div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button onClick={() => navigateLightbox(-1)} className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:border-orange-600 hover:text-orange-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600" aria-label="Previous photo">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => navigateLightbox(1)} className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:border-orange-600 hover:text-orange-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600" aria-label="Next photo">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-stone-400 tabular-nums">{currentIndex + 1} / {filtered.length}</span>
                </div>
                <Button asChild className="mt-6 bg-orange-600 hover:bg-orange-700 text-white w-full rounded-none whitespace-nowrap">
                  <Link to="/pasta-workshops">Join our next workshop</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <SimpleFooter />
    </div>
  );
};

export default Gallery;
