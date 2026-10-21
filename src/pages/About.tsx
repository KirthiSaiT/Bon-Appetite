/* Hallmark · genre: editorial · shared design system */
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const values = [
  {
    title: "Authenticity",
    description: "We honor traditional Italian techniques, ensuring every dish reflects genuine Italian heritage and craftsmanship.",
  },
  {
    title: "Passion",
    description: "Our love for Italian cuisine drives us to perfect every recipe and create memorable dining experiences.",
  },
  {
    title: "Community",
    description: "We bring people together through the universal language of exceptional food and warm hospitality.",
  },
  {
    title: "Quality",
    description: "Only the finest semolina, farm-fresh eggs, and all-natural ingredients make it into our handcrafted pasta.",
  },
  {
    title: "Sustainability",
    description: "We're committed to eco-friendly practices and responsible sourcing for a better tomorrow.",
  },
  {
    title: "Exceptional Service",
    description: "From kitchen to your table, we ensure every step of your experience exceeds expectations.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Page hero ── */}
      <section className="px-8 md:px-14 xl:px-20 pt-16 pb-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold mb-6 block">
            Our Story
          </span>
          <h1
            className="text-[2.8rem] md:text-[4rem] xl:text-[5rem] font-bold leading-[1.05] text-stone-900 mb-6 max-w-3xl overflow-wrap-anywhere"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bon Appetit <span className="text-orange-600">Cafe.</span>
          </h1>
          <div className="w-10 h-px bg-orange-600 mb-6" />
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl">
            Experience the richness of handcrafted pasta made using traditional Italian techniques,
            where the rich flavours of Italy come to life.
          </p>
        </div>
      </section>

      <div className="h-px bg-stone-200" />

      {/* ── About Us split ── */}
      <section className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-8 md:px-14 xl:px-20 py-16 md:py-24 bg-white">
          <span className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-6">About Us</span>
          <h2
            className="text-[2rem] md:text-[2.8rem] font-bold leading-tight text-stone-900 mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Authentic handmade pasta, crafted daily.
          </h2>
          <div className="w-8 h-px bg-orange-600 mb-8" />
          <p className="text-stone-600 text-base leading-relaxed mb-5">
            Our passion for authentic handmade pasta drives us to create a dining experience
            that transports you straight to the heart of Italy. We use only the finest semolina,
            farm-fresh eggs, and all-natural ingredients to craft pasta that is wholesome and flavorful.
          </p>
          <p className="text-stone-600 text-base leading-relaxed mb-5">
            Founded with a commitment to culinary excellence, we are your trusted cloud kitchen
            delivering exceptional Italian dining experiences right to your doorstep.
          </p>
          <p className="text-stone-600 text-base leading-relaxed">
            Every dish we create honours traditional Italian techniques while embracing modern
            convenience, ensuring authentic Italian flavours are always within reach.
          </p>
        </div>
        <div className="relative overflow-hidden min-h-[400px] h-[70vw] md:h-auto">
          <img
            src="/aboutus.webp"
            alt="About Us — Bon Appetit Cafe"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="py-16 md:py-24 px-8 md:px-14 xl:px-20 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-4 block">Our Values</span>
            <h2
              className="text-[2rem] md:text-[2.8rem] font-bold leading-tight text-stone-900 max-w-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What we believe in.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="border-t border-stone-200 pt-6">
                <h3
                  className="text-xl font-bold text-stone-900 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {value.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission split ── */}
      <section className="grid md:grid-cols-2">
        <div className="relative overflow-hidden min-h-[400px] h-[70vw] md:h-auto order-2 md:order-1">
          <img
            src="/aboutus2.webp"
            alt="Our Mission — Bon Appetit Cafe"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-8 md:px-14 xl:px-20 py-16 md:py-24 bg-white order-1 md:order-2">
          <span className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-6">Our Mission</span>
          <h2
            className="text-[2rem] md:text-[2.8rem] font-bold leading-tight text-stone-900 mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Making great Italian food accessible to everyone.
          </h2>
          <div className="w-8 h-px bg-orange-600 mb-8" />
          <p className="text-stone-600 text-base leading-relaxed mb-5">
            To make exceptional Italian cuisine accessible to everyone by combining traditional cooking
            techniques with modern technology, ensuring every meal we deliver exceeds expectations.
          </p>
          <p className="text-stone-600 text-base leading-relaxed mb-5">
            We believe that great food has the power to bring people together, create lasting memories,
            and transform ordinary moments into extraordinary experiences.
          </p>
          <Link
            to="/products"
            className="text-orange-600 text-sm font-semibold inline-flex items-center gap-2 group w-fit hover:opacity-75 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600 rounded-sm mt-2"
          >
            Explore Our Products
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-150" />
          </Link>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
};

export default About;
