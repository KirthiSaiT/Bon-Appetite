/* Hallmark · redesign · genre: editorial · macrostructure: Marquee Hero · theme: custom
 * tone: warm editorial · anchor hue: warm orange · nav: shared · footer: shared (Ft2)
 * sections: marquee hero · retail + online · menu card (flavour-tinted circle icons) · craft story · kitchen map
 * pre-emit critique: P4 H5 E4 S5 R4 V5
 */
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Wheat,
  Package,
  CookingPot,
  UtensilsCrossed,
  CakeSlice,
  ChefHat,
  Store,
  ShoppingBag,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Menu card — each circle takes a pasta-flavour token so the rows read like a coloured menu
const menu: { name: string; note: string; icon: LucideIcon; to: string; tint: string; ink: string }[] = [
  { name: "Fresh Pasta", note: "Made fresh to order", icon: Wheat, to: "/fresh-pasta", tint: "var(--flavour-plain)", ink: "var(--color-ink)" },
  { name: "Dry Pasta", note: "Five flavours", icon: Package, to: "/our-pasta-brand", tint: "var(--flavour-wheat)", ink: "var(--color-ink)" },
  { name: "Sauces", note: "Small-batch, seasonal", icon: CookingPot, to: "/seasonal-sauces", tint: "var(--flavour-paprika)", ink: "var(--color-paper)" },
  { name: "Cooked Pasta", note: "Hot and ready to eat", icon: UtensilsCrossed, to: "/cooked-pasta", tint: "var(--flavour-spinach)", ink: "var(--color-paper)" },
  { name: "Desserts", note: "Platters to share", icon: CakeSlice, to: "/dessert-platters", tint: "var(--flavour-beetroot)", ink: "var(--color-paper)" },
  { name: "Workshops", note: "Make pasta from scratch", icon: ChefHat, to: "/pasta-workshops", tint: "var(--color-ink)", ink: "var(--color-paper)" },
];

const shops = [
  { name: "Amazon", href: "https://www.amazon.in" },
  { name: "Meesho", href: "https://www.meesho.com" },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600";

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Marquee hero: headline across the page, photo band beneath ── */}
      <section className="px-6 md:px-14 xl:px-20 pt-14 md:pt-24">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-[3rem] sm:text-[4.2rem] md:text-[5.6rem] xl:text-[7rem] font-light leading-[0.98] text-stone-900 max-w-[14ch] [overflow-wrap:anywhere] min-w-0"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Handmade pasta, <span className="text-orange-600">made to order.</span>
          </h1>
          <div className="mt-10 md:mt-14 grid md:grid-cols-[minmax(0,1fr)_auto] gap-8 md:items-end">
            <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-md">
              Artisan pasta from our Hyderabad kitchen to your table — semolina, '00' flour,
              and nothing else.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/products"
                className={`bg-orange-600 hover:bg-orange-700 active:translate-y-px text-white px-7 py-3.5 text-sm font-semibold tracking-wide whitespace-nowrap transition-colors ${focusRing}`}
              >
                Order Now
              </Link>
              <Link
                to="/our-pasta-brand"
                className={`group text-stone-700 text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap hover:text-orange-700 transition-colors ${focusRing}`}
              >
                Our Pasta Brand
                <ArrowRight className="w-3.5 h-3.5 motion-safe:transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 md:mt-16 px-6 md:px-14 xl:px-20">
        <figure className="max-w-7xl mx-auto relative overflow-hidden aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] bg-stone-100">
          <img
            src="/spinachpasta (1).webp"
            alt="Bon Appetit spinach pasta with tomatoes, semolina and olive oil"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </figure>
      </div>

      {/* ── Where to buy: retail + online, per the stores sketch ── */}
      <section className="mt-16 md:mt-24 px-6 md:px-14 xl:px-20 py-16 md:py-24 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-14 lg:gap-20">
          <div className="min-w-0">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-600 text-white mb-8">
              <Store className="w-6 h-6" strokeWidth={1.5} />
            </span>
            <h2
              className="text-[2.2rem] md:text-[3.2rem] font-light text-stone-900 leading-[1.05] max-w-[16ch]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Present in <span className="text-orange-600">30+ retail stores</span> across Hyderabad.
            </h2>
            <p className="mt-6 text-stone-600 leading-relaxed max-w-md">
              Find our dry pasta at grocery stores, gourmet food halls and specialty outlets
              around the city.
            </p>
            <Link
              to="/our-pasta-brand"
              className={`mt-8 inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 active:translate-y-px text-white px-7 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
            >
              Check our products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="min-w-0 lg:border-l lg:border-stone-200 lg:pl-20 flex flex-col justify-end">
            <h3 className="text-lg font-semibold text-stone-900 mb-6">Available online</h3>
            <ul className="space-y-3">
              {shops.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-4 bg-white border border-stone-200 hover:border-orange-600 px-5 py-4 transition-colors ${focusRing}`}
                  >
                    <span className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-orange-50 text-orange-700 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                      <ShoppingBag className="w-5 h-5" strokeWidth={1.6} />
                    </span>
                    <span className="flex-1 text-base font-semibold text-stone-900 whitespace-nowrap">
                      Shop on {s.name}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-orange-700 motion-safe:transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── What we make: menu card with flavour-tinted circle icons ── */}
      <section className="px-6 md:px-14 xl:px-20 py-20 md:py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-12 lg:gap-20">
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <h2
              className="text-[2.4rem] md:text-[3.4rem] font-light text-stone-900 leading-[1.02]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What we make.
            </h2>
            <p className="mt-5 text-stone-600 leading-relaxed max-w-sm">
              Fresh and dry pasta, sauces, ready meals and desserts — plus workshops if you'd
              rather make it yourself.
            </p>
            <Link
              to="/products"
              className={`group mt-8 text-sm font-semibold text-orange-700 inline-flex items-center gap-1.5 whitespace-nowrap ${focusRing}`}
            >
              See the full menu
              <ArrowRight className="w-3.5 h-3.5 motion-safe:transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ul className="min-w-0 grid sm:grid-cols-2 sm:gap-x-10 border-t border-stone-900">
            {menu.map((m) => (
              <li key={m.name} className="min-w-0 border-b border-stone-200">
                <Link
                  to={m.to}
                  className={`group flex items-center gap-5 py-6 md:py-7 ${focusRing} focus-visible:outline-offset-0`}
                >
                  <span
                    className="flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full motion-safe:transition-transform motion-safe:duration-200 group-hover:scale-105"
                    style={{ background: m.tint, color: m.ink }}
                  >
                    <m.icon className="w-7 h-7" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-[1.45rem] md:text-[1.65rem] font-semibold text-stone-900 leading-tight whitespace-nowrap group-hover:text-orange-700 transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {m.name}
                    </span>
                    <span className="block mt-1 text-sm text-stone-500">{m.note}</span>
                  </span>
                  <ArrowRight className="flex-shrink-0 w-4 h-4 text-stone-300 group-hover:text-orange-700 motion-safe:transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Craft story: statement over a narrow photo column ── */}
      <section className="px-6 md:px-14 xl:px-20 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 md:gap-20 md:items-center">
          <figure className="relative overflow-hidden aspect-[4/5] bg-stone-100 order-2 md:order-1">
            <img
              src="/bts1.webp"
              alt="Pasta being prepared by hand in the Bon Appetit kitchen"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </figure>
          <div className="order-1 md:order-2 min-w-0">
            <h2
              className="text-[2.2rem] md:text-[3.4rem] xl:text-[4rem] font-light text-stone-900 leading-[1.05]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Traditional technique, <span className="text-orange-600">zero shortcuts.</span>
            </h2>
            <p className="mt-8 text-stone-600 text-base md:text-lg leading-relaxed max-w-lg">
              Every strand of pasta at Bon Appetit is made by hand — semolina, '00' flour, and
              nothing else. Artisan craft, delivered India-wide.
            </p>
            <Link
              to="/about"
              className={`group mt-8 text-sm font-semibold text-orange-700 inline-flex items-center gap-1.5 whitespace-nowrap ${focusRing}`}
            >
              Read our story
              <ArrowRight className="w-3.5 h-3.5 motion-safe:transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Kitchen location ── */}
      <section className="px-6 md:px-14 xl:px-20 pb-20 md:pb-28">
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

      <Footer />
    </div>
  );
};

export default Index;
