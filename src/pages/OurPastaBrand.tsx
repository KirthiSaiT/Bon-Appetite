/* Hallmark · genre: editorial · macrostructure: Split Studio · shared system */
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";

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

    {/* ── Retailer CTA ── */}
    <section className="py-20 px-8 md:px-14 bg-orange-600">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >Are you a retailer or distributor?</h2>
        <p className="text-orange-100 mb-8 max-w-xl mx-auto">
          We're actively expanding our retail network. Get in touch with our sales team to
          stock Bon Appetit pasta in your store.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold">
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold">
            <Link to="/products">View Catalogue</Link>
          </Button>
        </div>
      </div>
    </section>

    <SimpleFooter />
  </div>
);

export default OurPastaBrand;
