/* Hallmark · genre: editorial · macrostructure: Split Studio · shared system */
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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

const categories = [
  { value: "all", label: "All" },
  { value: "events", label: "CM Events" },
  { value: "workshop", label: "Workshops" },
  { value: "school", label: "School Events" },
  { value: "bts", label: "Behind the Scenes" },
];

type GalleryItem = (typeof galleryItems)[0];

// ── Editorial gallery card ──
const GalleryCard = ({
  item,
  onClick,
  className = "",
  large = false,
}: {
  item: GalleryItem;
  onClick: () => void;
  className?: string;
  large?: boolean;
}) => (
  <button
    className={`group relative overflow-hidden cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${className}`}
    onClick={onClick}
  >
    <img
      src={item.image}
      alt={item.title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
    <div className="absolute top-4 left-4">
      <span className="text-orange-300 text-[0.6rem] tracking-[0.22em] uppercase font-semibold">
        {item.tag}
      </span>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-5">
      <h3
        className={`text-white font-bold leading-tight mb-1.5 ${large ? "text-2xl md:text-3xl" : "text-lg"}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {item.title}
      </h3>
      <div className="flex items-center gap-3 text-white/60 text-xs">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.date}</span>
      </div>
    </div>
  </button>
);

const Gallery = () => {
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const currentItem = galleryItems.find((g) => g.id === lightboxId) ?? null;

  const navigateLightbox = (dir: 1 | -1) => {
    if (!currentItem) return;
    const pool = activeTab === "all" ? galleryItems : galleryItems.filter((g) => g.category === activeTab);
    const idx = pool.findIndex((g) => g.id === currentItem.id);
    const next = pool[(idx + dir + pool.length) % pool.length];
    setLightboxId(next.id);
  };

  const filtered = activeTab === "all" ? galleryItems : galleryItems.filter((g) => g.category === activeTab);

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Editorial hero: text left, photo right ── */}
      <section className="grid md:grid-cols-2 border-b border-stone-200">
        <div className="flex flex-col justify-center px-8 md:px-14 xl:px-20 py-16 md:py-24 order-2 md:order-1">
          <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold mb-8">
            Community & Gallery
          </span>
          <h1
            className="text-[2.6rem] md:text-[3.6rem] xl:text-[4.4rem] font-bold leading-[1.05] text-stone-900 mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where pasta brings <span className="text-orange-600">people together.</span>
          </h1>
          <div className="w-10 h-px bg-orange-600 mb-8" />
          <p className="text-stone-600 text-lg leading-relaxed max-w-md">
            From intimate workshops to lively community events — every image is a chapter in the
            story of a brand built on craft, passion, and the love of Italian food.
          </p>
        </div>
        <div className="relative overflow-hidden order-1 md:order-2 h-[60vw] md:h-auto md:min-h-[520px]">
          <img src="/bts1.webp" alt="Bon Appetit community" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      {/* ── Featured grid: 1 large + 5 ── */}
      <section className="py-16 md:py-20 px-8 md:px-14 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-3 block">Highlights</span>
              <h2
                className="text-[2rem] md:text-[2.8rem] font-bold text-stone-900 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Featured moments.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gridAutoRows: "minmax(0, 260px)" }}>
            <GalleryCard
              item={galleryItems[0]}
              onClick={() => setLightboxId(galleryItems[0].id)}
              className="md:col-span-2 md:row-span-2"
              large
            />
            {galleryItems.slice(1, 6).map((item) => (
              <GalleryCard key={item.id} item={item} onClick={() => setLightboxId(item.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter + full grid ── */}
      <section className="py-16 md:py-20 px-8 md:px-14 xl:px-20 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <span className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-3 block">Browse</span>
              <h2
                className="text-[2rem] md:text-[2.8rem] font-bold text-stone-900 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                All stories.
              </h2>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-stone-200 p-1 h-auto gap-1 rounded-none flex-wrap">
                {categories.map((c) => (
                  <TabsTrigger
                    key={c.value}
                    value={c.value}
                    className="px-4 py-2 text-xs font-semibold rounded-none data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-colors"
                  >
                    {c.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onClick={() => setLightboxId(item.id)}
                  className="aspect-[4/3]"
                />
              ))}
            </div>
          ) : (
            <p className="text-stone-400 py-20 text-center text-lg">No photos in this category yet — check back soon.</p>
          )}
        </div>
      </section>

      {/* ── Join the community ── */}
      <section className="py-16 md:py-20 px-8 md:px-14 xl:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-[2rem] md:text-[2.8rem] font-bold text-stone-900 mb-10 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Be part of our story.
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="group relative overflow-hidden h-80">
              <img src="/pastaworkshop.webp" alt="Pasta Workshops" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-orange-300 text-[0.6rem] tracking-[0.22em] uppercase font-semibold mb-3 block">Every Month</span>
                <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>Join a workshop</h3>
                <p className="text-white/70 text-sm mb-5 leading-relaxed max-w-sm">Make pasta from scratch alongside other enthusiasts. Beginners always welcome.</p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-none">
                  <Link to="/pasta-workshops">Book Your Slot →</Link>
                </Button>
              </div>
            </div>
            <div className="group relative overflow-hidden h-80">
              <img src="/cmpic21.webp" alt="Community" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-white/70 text-[0.6rem] tracking-[0.22em] uppercase font-semibold mb-3 block">Follow Along</span>
                <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>Follow our story</h3>
                <p className="text-white/70 text-sm mb-5 leading-relaxed max-w-sm">Daily pasta inspiration, recipes & behind-the-scenes on Instagram.</p>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-stone-900 font-semibold rounded-none">
                  <a href="https://www.instagram.com/bonappetitcafe_hyd" target="_blank" rel="noopener noreferrer">@bonappetitcafe_hyd</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <Dialog open={lightboxId !== null} onOpenChange={(open) => !open && setLightboxId(null)}>
        <DialogContent className="max-w-5xl w-full p-0 overflow-hidden border-0 gap-0 rounded-none">
          <DialogTitle className="sr-only">{currentItem?.title ?? "Gallery image"}</DialogTitle>
          {currentItem && (
            <div className="grid md:grid-cols-[3fr_2fr] min-h-[520px]">
              <div className="relative bg-black min-h-[300px]">
                <img src={currentItem.image} alt={currentItem.title} className="w-full h-full object-cover max-h-[80vh]" />
                <button onClick={() => navigateLightbox(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2.5 transition-colors" aria-label="Previous image">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => navigateLightbox(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2.5 transition-colors" aria-label="Next image">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                  {galleryItems.findIndex((g) => g.id === currentItem.id) + 1} / {galleryItems.length}
                </div>
              </div>
              <div className="bg-white flex flex-col p-8">
                <span className="text-orange-600 text-[0.6rem] font-semibold uppercase tracking-[0.22em] mb-5">{currentItem.tag}</span>
                <h2 className="text-2xl font-bold text-stone-900 mb-4 leading-tight" style={{ fontFamily: "var(--font-display)" }}>{currentItem.title}</h2>
                <p className="text-stone-600 leading-relaxed text-sm flex-1">{currentItem.desc}</p>
                <div className="mt-6 pt-6 border-t border-stone-100 space-y-3">
                  <div className="flex items-center gap-2.5 text-sm text-stone-500"><MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />{currentItem.location}</div>
                  <div className="flex items-center gap-2.5 text-sm text-stone-500"><Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />{currentItem.date}</div>
                </div>
                <Button asChild className="mt-6 bg-orange-600 hover:bg-orange-700 text-white w-full rounded-none">
                  <Link to="/pasta-workshops">Join Our Next Workshop →</Link>
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
