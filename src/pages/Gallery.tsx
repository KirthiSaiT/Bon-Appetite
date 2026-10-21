import { useState } from "react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { value: "500+", label: "Happy Customers" },
  { value: "20+", label: "Workshops Conducted" },
  { value: "30+", label: "Retail Store Partners" },
  { value: "6", label: "Years of Craftsmanship" },
];

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

// ── Sub-component: masonry card ───────────────────────────────────────────────

type GalleryItem = (typeof galleryItems)[0];

const MasonryCard = ({
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
  <div
    className={`group relative overflow-hidden rounded-2xl cursor-pointer ${className}`}
    onClick={onClick}
  >
    <img
      src={item.image}
      alt={item.title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
    {/* Badge */}
    <div className="absolute top-4 left-4">
      <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow">
        {item.tag}
      </span>
    </div>
    {/* Info */}
    <div className="absolute bottom-0 left-0 right-0 p-5">
      <h3
        className={`text-white font-bold leading-tight mb-1 ${
          large ? "text-2xl" : "text-base"
        }`}
      >
        {item.title}
      </h3>
      <div className="flex items-center gap-3 text-white/60 text-xs">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {item.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {item.date}
        </span>
      </div>
    </div>
  </div>
);

// ── Sub-component: filter grid card ──────────────────────────────────────────

const GridCard = ({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) => (
  <div
    className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
    onClick={onClick}
  >
    <img
      src={item.image}
      alt={item.title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
      <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-2">
        {item.tag}
      </span>
      <h3 className="text-white font-semibold text-sm leading-tight">{item.title}</h3>
      <div className="flex items-center gap-3 text-white/65 text-xs mt-1">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {item.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {item.date}
        </span>
      </div>
    </div>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const Gallery = () => {
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const currentItem = galleryItems.find((g) => g.id === lightboxId) ?? null;

  const navigateLightbox = (dir: 1 | -1) => {
    if (!currentItem) return;
    const pool =
      activeTab === "all"
        ? galleryItems
        : galleryItems.filter((g) => g.category === activeTab);
    const idx = pool.findIndex((g) => g.id === currentItem.id);
    const next = pool[(idx + dir + pool.length) % pool.length];
    setLightboxId(next.id);
  };

  const filtered =
    activeTab === "all"
      ? galleryItems
      : galleryItems.filter((g) => g.category === activeTab);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[72vh] min-h-[500px] flex items-end overflow-hidden">
        <img
          src="/bts1.webp"
          alt="Bon Appetit Community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Layered gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-20">
          <p className="text-orange-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">
            Community & Gallery
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-5 leading-[1.05] max-w-3xl">
            Where Pasta Brings<br />
            <span className="text-orange-400">People Together</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed">
            From intimate workshops to lively community events — every image
            is a chapter in the story of a brand built on craft, passion, and
            the love of Italian food.
          </p>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className="bg-orange-600">
        <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1">
                {s.value}
              </div>
              <div className="text-orange-200 text-xs font-semibold uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Masonry featured grid ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-orange-600 text-sm font-bold uppercase tracking-widest mb-2">
                Highlights
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Featured Moments
              </h2>
            </div>
            <button
              onClick={() => setActiveTab("all")}
              className="hidden md:flex items-center gap-1.5 text-gray-400 hover:text-orange-600 text-sm font-semibold transition-colors"
            >
              Browse all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Masonry: 1 large (2×2) + 5 small */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            style={{ gridAutoRows: "260px" }}
          >
            <MasonryCard
              item={galleryItems[0]}
              onClick={() => setLightboxId(galleryItems[0].id)}
              className="md:col-span-2 md:row-span-2"
              large
            />
            {galleryItems.slice(1, 6).map((item) => (
              <MasonryCard
                key={item.id}
                item={item}
                onClick={() => setLightboxId(item.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Category filter + full grid ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 text-sm font-bold uppercase tracking-widest mb-2">
              Browse
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
              All Stories
            </h2>
            {/* shadcn Tabs as filter */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-center">
                <TabsList className="bg-white border border-gray-200 shadow-sm p-1 h-auto gap-1 rounded-xl">
                  {categories.map((c) => (
                    <TabsTrigger
                      key={c.value}
                      value={c.value}
                      className="px-5 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow transition-all"
                    >
                      {c.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Filtered grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <GridCard
                  key={item.id}
                  item={item}
                  onClick={() => setLightboxId(item.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-20 text-lg">
              No photos in this category yet — check back soon.
            </p>
          )}
        </div>
      </section>

      {/* ── Join the community CTAs ───────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-600 text-sm font-bold uppercase tracking-widest mb-2">
              Get Involved
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900">
              Be Part of Our Story
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Workshop CTA card */}
            <div className="group relative overflow-hidden rounded-2xl h-80 cursor-pointer">
              <img
                src="/pastaworkshop.webp"
                alt="Pasta Workshops"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <Badge className="bg-orange-600 text-white hover:bg-orange-600 mb-3 text-xs uppercase tracking-wider">
                  Every Month
                </Badge>
                <h3 className="text-white text-2xl font-extrabold mb-2">
                  Join a Workshop
                </h3>
                <p className="text-white/70 text-sm mb-5 leading-relaxed">
                  Make pasta from scratch alongside other enthusiasts. Beginners
                  always welcome.
                </p>
                <Button
                  asChild
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  <Link to="/pasta-workshops">Book Your Slot →</Link>
                </Button>
              </div>
            </div>

            {/* Instagram / social CTA card */}
            <div className="group relative overflow-hidden rounded-2xl h-80 cursor-pointer">
              <img
                src="/cmpic21.webp"
                alt="Community"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <Badge className="bg-white/20 text-white hover:bg-white/20 border border-white/30 mb-3 text-xs uppercase tracking-wider backdrop-blur-sm">
                  Follow Along
                </Badge>
                <h3 className="text-white text-2xl font-extrabold mb-2">
                  Follow Our Story
                </h3>
                <p className="text-white/70 text-sm mb-5 leading-relaxed">
                  Daily pasta inspiration, recipes & behind-the-scenes on
                  Instagram.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold"
                >
                  <a
                    href="https://www.instagram.com/bonappetitcafe_hyd"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @bonappetitcafe_hyd
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox Dialog ───────────────────────────────────────────────── */}
      <Dialog
        open={lightboxId !== null}
        onOpenChange={(open) => !open && setLightboxId(null)}
      >
        <DialogContent className="max-w-5xl w-full p-0 overflow-hidden border-0 gap-0">
          <DialogTitle className="sr-only">
            {currentItem?.title ?? "Gallery image"}
          </DialogTitle>

          {currentItem && (
            <div className="grid md:grid-cols-[3fr_2fr] min-h-[520px]">
              {/* Image pane */}
              <div className="relative bg-black min-h-[300px]">
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover max-h-[80vh]"
                />
                {/* Prev */}
                <button
                  onClick={() => navigateLightbox(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2.5 backdrop-blur-sm transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {/* Next */}
                <button
                  onClick={() => navigateLightbox(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2.5 backdrop-blur-sm transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Image counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  {galleryItems.findIndex((g) => g.id === currentItem.id) + 1} /{" "}
                  {galleryItems.length}
                </div>
              </div>

              {/* Info pane */}
              <div className="bg-white flex flex-col p-8">
                <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider w-fit mb-5">
                  {currentItem.tag}
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {currentItem.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm flex-1">
                  {currentItem.desc}
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    {currentItem.location}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    {currentItem.date}
                  </div>
                </div>
                <Button
                  asChild
                  className="mt-6 bg-orange-600 hover:bg-orange-700 text-white w-full"
                >
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
