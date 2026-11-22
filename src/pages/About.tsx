/* About: simplified. A photo collage, one short story, and our journey.
 * The old values and mission sections were removed to cut the extra information. */
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { PhotoCollage } from "@/components/HomeSections";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600";

const About = () => (
  <div className="min-h-screen bg-white overflow-x-clip">
    <Navigation />

    <main>
      {/* ── Story: heading, one short paragraph, the collage ── */}
      <section className="px-6 md:px-14 xl:px-20 pt-14 md:pt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 md:gap-16 items-center">
          <div className="min-w-0">
            <h1
              className="text-[2.6rem] md:text-[4rem] font-semibold leading-[1.02] text-stone-900 [overflow-wrap:break-word] min-w-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our <span className="text-orange-600">story.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-lg">
              Bon Appetit Cafe makes authentic handmade pasta every day, using semolina and all-natural ingredients, and
              brings it from our Hyderabad kitchen to your door.
            </p>
          </div>
          <PhotoCollage />
        </div>
      </section>

      {/* ── Journey ── */}
      <section aria-labelledby="journey-title" className="px-6 md:px-14 xl:px-20 py-24 md:py-28">
        <div className="max-w-3xl mx-auto">
          <h2
            id="journey-title"
            className="text-[2.2rem] md:text-[3rem] font-semibold leading-[1.02] text-stone-900 [overflow-wrap:break-word] min-w-0"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Our journey.
          </h2>
          <p className="mt-5 text-lg text-stone-600 leading-relaxed">
            We started from scratch in 2020. Today Bon Appetit makes fresh and dry pasta by hand, runs pasta workshops and
            delivers across India.
          </p>
          <Link
            to="/cafe"
            className={`group mt-8 inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 active:translate-y-px text-white px-8 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${focusRing}`}
          >
            Visit the cafe
            <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>

    <SimpleFooter />
  </div>
);

export default About;
