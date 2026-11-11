/* Hallmark · genre: editorial · macrostructure: Split Studio · shared system */
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Handshake } from "lucide-react";

const products = [
  {
    name: "Fettucine",
    description: "Flat, wide ribbons — perfect with creamy Alfredo or rich Bolognese.",
    icon: "🍝",
  },
  {
    name: "Farfalle",
    description: "Bow-tie beauties that hold chunky sauces and look stunning on the plate.",
    icon: "🦋",
  },
  {
    name: "Spaghetti",
    description: "The Italian classic — thin, long strands that pair with anything.",
    icon: "🍜",
  },
  {
    name: "Heart & Star Shapes",
    description: "Playful shapes for special moments, kids' meals and gifting.",
    icon: "⭐",
  },
];

const flavours = [
  { name: "Plain", swatch: "var(--flavour-plain)" },
  { name: "Spinach", swatch: "var(--flavour-spinach)" },
  { name: "Paprika", swatch: "var(--flavour-paprika)" },
  { name: "Beetroot", swatch: "var(--flavour-beetroot)" },
  { name: "Wheat", swatch: "var(--flavour-wheat)" },
];

const stores = [
  "Nature's Basket", "Eataly", "Gourmet Garden", "Fresh Mart",
  "Italian Corner", "Pasta Republic", "Food Hall", "Organic World",
];

const OurPastaBrand = () => (
  <div className="min-h-screen bg-white overflow-x-clip">
    <Navigation />

    {/* ── Hero: Split Studio diptych ── */}
    <section className="grid md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 md:px-14 xl:px-20 py-16 md:py-24 order-2 md:order-1 bg-white">
        <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold mb-8">
          Handmade · 30+ Stores
        </span>
        <h1
          className="text-[2.6rem] md:text-[3.6rem] xl:text-[4.6rem] font-bold leading-[1.05] text-stone-900 mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Our <span className="text-orange-600">Pasta Brand.</span>
        </h1>
        <div className="w-10 h-px bg-orange-600 mb-8" />
        <p className="text-stone-600 text-lg mb-10 max-w-md leading-relaxed">
          Handcrafted in small batches using traditional Italian methods — premium durum
          wheat semolina, three-month shelf life, ready to cook in minutes.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            to="/dry-pasta"
            className="bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Shop Dry Pasta
          </Link>
          <Link
            to="/products"
            className="text-stone-600 text-sm font-semibold inline-flex items-center gap-2 group hover:text-orange-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600 rounded-sm"
          >
            All Products
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-150" />
          </Link>
        </div>
      </div>
      <div className="relative overflow-hidden order-1 md:order-2 h-[65vw] md:h-auto md:min-h-[520px]">
        <img
          src="/drypasta.webp"
          alt="Handmade dry pasta by Bon Appetit"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </section>

    {/* ── Natural colours photo band ── */}
    <section className="relative">
      <div className="relative h-[420px] md:h-[500px] overflow-hidden">
        <img
          src="/spinachpasta (1).webp"
          alt="Natural colour pasta variants"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-14 xl:px-20 max-w-xl">
            <h2
              className="text-white text-[2rem] md:text-[3rem] font-bold leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Five shapes, five natural colours.
            </h2>
            <p className="text-white/80 text-base leading-relaxed mb-8 max-w-sm">
              Every hue comes from real vegetables — spinach, beetroot, paprika — never
              a drop of artificial dye.
            </p>
            <div className="flex flex-wrap gap-4">
              {flavours.map((f) => (
                <div key={f.name} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full ring-1 ring-white/40 flex-shrink-0"
                    style={{ background: f.swatch }}
                  />
                  <span className="text-white text-sm font-semibold">{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── Product range ── */}
    <section className="py-16 md:py-20 px-8 md:px-14 xl:px-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <span className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-4 block">The Range</span>
        <h2
          className="text-[2rem] md:text-[2.8rem] font-bold text-stone-900 mb-4 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Four shapes, endlessly versatile.
        </h2>
        <p className="text-stone-600 mb-12 max-w-2xl">
          Every shape is available in all five flavour variants — pick your favourite or try them all.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {products.map((p) => (
            <div key={p.name} className="border-t-2 border-stone-900 pt-6">
              <span className="text-5xl mb-5 block">{p.icon}</span>
              <h3
                className="text-xl font-bold text-stone-900 mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >{p.name}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <Link
            to="/dry-pasta"
            className="text-orange-600 text-sm font-semibold inline-flex items-center gap-2 group hover:opacity-75 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600 rounded-sm"
          >
            Browse Full Collection
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-150" />
          </Link>
        </div>
      </div>
    </section>

    {/* ── Retail presence ── */}
    <section className="py-16 md:py-20 px-8 md:px-14 xl:px-20 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-[2rem] md:text-[2.8rem] font-bold text-stone-900 mb-4 leading-tight max-w-2xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Present in <span className="text-orange-600">30+ stores</span> across Hyderabad.
        </h2>
        <p className="text-stone-600 mb-10 max-w-2xl">
          Find our pasta at premium grocery stores, gourmet food halls and specialty outlets near you.
        </p>
        <div className="flex flex-wrap gap-3 mb-16">
          {stores.map((s) => (
            <div key={s} className="px-5 py-2 border border-stone-300 text-stone-700 text-sm font-semibold bg-white">
              {s}
            </div>
          ))}
        </div>

        <div className="border-t border-stone-200 pt-12">
          <h3
            className="text-2xl md:text-3xl font-bold text-stone-900 mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >Also available online</h3>
          <p className="text-stone-600 mb-8">Order from the comfort of your home — pan-India delivery.</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.amazon.in" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#FF9900] text-white font-semibold hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              <ShoppingBag className="w-5 h-5" /> Shop on Amazon
            </a>
            <a
              href="https://www.meesho.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#FF3399] text-white font-semibold hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              <ShoppingBag className="w-5 h-5" /> Shop on Meesho
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* ── Retailer CTA: orange band, headline left, a white "how to stock us" card right ── */}
    <section className="px-6 md:px-14 xl:px-20 py-16 md:py-24 bg-orange-700">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 lg:items-center">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-50 whitespace-nowrap">
            <Handshake className="w-5 h-5" strokeWidth={1.75} /> For shops and distributors
          </p>
          <h2
            className="mt-4 text-[2.6rem] md:text-[3.6rem] xl:text-[4.2rem] font-semibold leading-[1.0] text-white max-w-[13ch] [overflow-wrap:anywhere]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Put our pasta on your shelf.
          </h2>
          <p className="mt-5 max-w-md text-orange-50 text-base md:text-lg leading-relaxed">
            We're growing our retail network and would love to hear from stores and distributors.
          </p>
        </div>

        <div className="min-w-0 rounded-3xl bg-white p-6 md:p-9 shadow-[0_24px_48px_-28px_theme(colors.stone.900/0.6)]">
          <h3 className="text-2xl md:text-[1.75rem] font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
            How to stock Bon Appetit
          </h3>
          <ol className="mt-5">
            {[
              ["Tell us about your store", "Where you are and what you'd like to carry."],
              ["Get the catalogue", "Our sales team shares the shapes, flavours and pack sizes."],
              ["Stock the shelf", "We set up your first order with you."],
            ].map(([title, text], i) => (
              <li key={title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-t border-stone-200 py-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-50 text-sm font-semibold text-orange-700 tabular-nums">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-stone-900">{title}</span>
                  <span className="block text-sm text-stone-600 leading-relaxed">{text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 hover:bg-orange-600 active:translate-y-px text-white px-7 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
            >
              Talk to our sales team
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products"
              className="group inline-flex items-center gap-1.5 text-stone-800 hover:text-orange-700 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
            >
              View catalogue
              <ArrowRight className="w-3.5 h-3.5 motion-safe:transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>

    <SimpleFooter />
  </div>
);

export default OurPastaBrand;
