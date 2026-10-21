/* Hallmark · genre: editorial · macrostructure: Split Studio · theme: custom
 * tone: artisan craft · anchor hue: warm orange · nav: N9 · footer: Ft2
 * pre-emit: P5 H5 E4 S5 R5 V5
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Hero: Split Studio ── */}
      <section className="grid md:grid-cols-2 min-h-[92vh]">

        {/* Left: editorial text column */}
        <div className="flex flex-col justify-center px-8 md:px-14 xl:px-20 py-16 order-2 md:order-1 bg-white">
          <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold mb-8">
            Cloud Kitchen · Hyderabad
          </span>
          <h1
            className="text-[2.6rem] md:text-[3.6rem] xl:text-[4.8rem] font-light leading-[1.05] text-stone-900 mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Handmade pasta,{" "}
            <span className="text-orange-600">made to order.</span>
          </h1>
          <div className="w-10 h-px bg-orange-600 mb-8" />
          <p className="text-stone-500 text-lg leading-relaxed mb-10 max-w-[22rem]">
            Artisan pasta from our Hyderabad kitchen to your table — semolina,
            '00' flour, and nothing else.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/products"
              className="bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              Order Now
            </Link>
            <Link
              to="/our-pasta-brand"
              className="text-stone-600 text-sm font-medium inline-flex items-center gap-2 group hover:text-orange-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600 rounded-sm"
            >
              Our Pasta Brand
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-150" />
            </Link>
          </div>
        </div>

        {/* Right: food photograph */}
        <div className="relative overflow-hidden order-1 md:order-2 h-[65vw] md:h-auto">
          <img
            src="/readytoeat.webp"
            alt="Artisan pasta by Bon Appetit"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── Hairline divider ── */}
      <div className="h-px bg-stone-200" />

      {/* ── Categories: asymmetric 3/5 + 2/5 grid ── */}
      <section className="py-14 px-6 md:px-14 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-8">
            What We Offer
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

            {/* Large card — 3 cols */}
            <Link
              to="/products"
              className="group md:col-span-3 relative h-[420px] md:h-[560px] overflow-hidden block focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600"
            >
              <img
                src="/readytoeat.webp"
                alt="Food & Pre-orders"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-orange-300 text-[0.6rem] tracking-[0.25em] uppercase font-semibold mb-3 block">
                  Order Online
                </span>
                <h3
                  className="text-white text-3xl md:text-4xl font-light leading-tight mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Food & Pre-orders
                </h3>
                <p className="text-white/70 text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 leading-relaxed max-w-xs">
                  Fresh pasta, cooked meals, sauces & more — delivered to your door.
                </p>
                <span className="text-orange-300 text-xs font-semibold mt-4 inline-flex items-center gap-1.5">
                  Order Now
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1 duration-150" />
                </span>
              </div>
            </Link>

            {/* Two stacked cards — 2 cols */}
            <div className="md:col-span-2 flex flex-col gap-3">
              {[
                {
                  to: "/pasta-workshops",
                  image: "/pastaworkshop.webp",
                  badge: "Every Month",
                  title: "Pasta Workshops",
                  cta: "Book a Slot",
                },
                {
                  to: "/our-pasta-brand",
                  image: "/drypasta.webp",
                  badge: "30+ Stores",
                  title: "Our Pasta Brand",
                  cta: "Explore Brand",
                },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group relative h-[260px] md:flex-1 overflow-hidden block focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600"
                  style={{ minHeight: "260px" }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-orange-300 text-[0.6rem] tracking-[0.25em] uppercase font-semibold mb-2 block">
                      {item.badge}
                    </span>
                    <h3
                      className="text-white text-2xl md:text-3xl font-light leading-tight mb-2"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h3>
                    <span className="text-orange-300 text-xs font-semibold mt-1 inline-flex items-center gap-1.5">
                      {item.cta}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1 duration-150" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Craft story: image | sage text split ── */}
      <section className="grid md:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden min-h-[360px] h-[70vw] md:h-auto">
          <img
            src="/cmpic1.webp"
            alt="Behind the scenes at Bon Appetit kitchen"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Sage text panel */}
        <div
          className="flex flex-col justify-center px-8 md:px-14 xl:px-20 py-16 md:py-24"
          style={{ background: "#7BA16D" }}
        >
          <span className="text-white/60 text-[0.63rem] tracking-[0.25em] uppercase mb-8">
            Our Story
          </span>
          <h2
            className="text-white text-[2rem] md:text-[2.8rem] xl:text-[3.4rem] font-light leading-[1.1] mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Traditional technique, zero shortcuts.
          </h2>
          <div className="w-10 h-px bg-white/30 mb-8" />
          <p className="text-white/80 text-base leading-relaxed mb-10 max-w-sm">
            Every strand of pasta at Bon Appetit is made by hand — semolina, '00' flour,
            and nothing else. Artisan craft, delivered India-wide.
          </p>
          <Link
            to="/about"
            className="text-white text-sm font-semibold inline-flex items-center gap-2 group w-fit hover:opacity-75 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
          >
            Our Story
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-150" />
          </Link>
        </div>
      </section>

      {/* ── Location ── */}
      <section className="py-14 px-6 md:px-14 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
            <div>
              <p className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-3">
                Find Us
              </p>
              <h2
                className="text-stone-900 text-2xl md:text-3xl font-light"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our Kitchen
              </h2>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed md:text-right">
              8-1-284/OU/461, OU Colony<br />
              Shaikpet, Hyderabad, Telangana 500008
            </p>
          </div>
          <div className="w-full h-80 overflow-hidden">
            <iframe
              title="Bon Appetit Location"
              src="https://www.google.com/maps?q=8-1-284/OU/461,OU+Colony,Shaikpet,Hyderabad,Telangana+500008&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
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
