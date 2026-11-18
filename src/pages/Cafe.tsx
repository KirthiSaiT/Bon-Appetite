/* Cafe landing: one section, two doors.
 * Cooked Pasta -> the cooked pasta menu with prices and ordering.
 * Cafe         -> the rest of the cafe: fresh pasta, hot food on Zomato and Swiggy, catering and workshops.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600";

const options = [
  {
    title: "Cooked Pasta",
    line: "Build your plate, see the prices and order.",
    to: "/cooked-pasta",
    image: "/cooked.webp",
    alt: "Cooked Pasta",
    action: "See the menu",
  },
  {
    title: "Cafe",
    line: "Fresh pasta, hot food on Zomato and Swiggy, catering and workshops.",
    to: "/products",
    image: "/readytoeat.webp",
    alt: "Ready to eat",
    action: "Visit the cafe",
  },
];

const Cafe = () => (
  <div className="min-h-screen bg-white overflow-x-clip">
    <Navigation />

    <main className="px-6 md:px-14 xl:px-20 pt-14 md:pt-20 pb-8">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-[2.6rem] md:text-[4rem] font-semibold leading-[1.02] text-stone-900 [overflow-wrap:break-word] min-w-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The <span className="text-orange-600">Cafe.</span>
        </h1>
        <p className="mt-4 text-lg text-stone-600 max-w-xl">Pick where you would like to start.</p>

        <ul className="mt-10 grid sm:grid-cols-2 gap-5 md:gap-8">
          {options.map((o) => (
            <li key={o.title} className="min-w-0">
              <Link
                to={o.to}
                className={`group flex h-full flex-col rounded-[2rem] border border-stone-200 bg-white p-4 md:p-5 transition-colors hover:border-orange-600 active:translate-y-px ${focusRing}`}
              >
                <span className="block aspect-square w-full overflow-hidden rounded-3xl bg-white">
                  <img
                    src={o.image}
                    alt={o.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain scale-[1.15] motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.22]"
                  />
                </span>
                <span
                  className="mt-5 px-1 text-[1.9rem] md:text-[2.2rem] font-semibold leading-tight text-stone-900 group-hover:text-orange-700"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {o.title}
                </span>
                <span className="mt-1 px-1 text-stone-600">{o.line}</span>
                <span className="mt-5 px-1 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
                  {o.action}
                  <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>

    <SimpleFooter />
  </div>
);

export default Cafe;
