/* Hallmark · component: footer · genre: editorial · theme: custom (project tokens)
 * layout: marketplace band · wordmark + order card · three link columns · base bar
 * states: default · hover · focus · active
 * contrast: pass (stone-300 on stone-900, white on orange-600)
 */
import { Link } from "react-router-dom";
import { ArrowUpRight, Facebook, Instagram, MapPin, Phone, Youtube } from "lucide-react";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400";

const marketplaces = ["Amazon", "Flipkart", "Meesho", "BigBasket", "Zepto", "Swiggy Instamart", "Blinkit"];

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Fresh Pasta", to: "/fresh-pasta" },
      { label: "Dry Pasta", to: "/our-pasta-brand" },
      { label: "Seasonal Sauces", to: "/seasonal-sauces" },
      { label: "Cooked Pasta", to: "/cooked-pasta" },
      { label: "Dessert Platters", to: "/dessert-platters" },
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Pasta Workshops", to: "/pasta-workshops" },
      { label: "Cafe & Catering", to: "/products" },
      { label: "Recipes", to: "/recipes" },
      { label: "Gallery", to: "/gallery" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "FAQ", to: "/faq" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/bonappetitcafe_hyd", icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/bonappetitcafe", icon: Facebook },
  { name: "YouTube", href: "https://www.youtube.com/@bonappetitcafe", icon: Youtube },
];

const FooterBody = ({ showMarketplaces }: { showMarketplaces: boolean }) => (
  <footer className="mt-16 bg-stone-900 text-stone-300">
    {showMarketplaces && (
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 py-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400 whitespace-nowrap">Also available on</p>
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {marketplaces.map((m) => (
              <li
                key={m}
                className="text-xl md:text-2xl font-semibold text-white whitespace-nowrap"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}

    <div className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 pt-16 pb-12 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-14 lg:gap-20">
      {/* Brand + order card */}
      <div className="min-w-0">
        <Link
          to="/"
          className={`inline-flex items-center gap-4 ${focusRing}`}
        >
          <img src="/bonappetitlogo.jpeg" alt="" className="w-14 h-14 rounded-full object-cover bg-white" />
          <span
            className="text-[2.6rem] md:text-[3.2rem] font-light text-white leading-none whitespace-nowrap"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bon Appetit
          </span>
        </Link>
        <p className="mt-6 max-w-sm leading-relaxed">
          Authentic, handmade pasta from our Hyderabad kitchen — where every bite tells a story. Delivering India-wide.
        </p>

        <a
          href="tel:+919390105767"
          className={`group mt-8 flex items-center gap-4 max-w-sm rounded-2xl bg-orange-600 hover:bg-orange-700 active:translate-y-px px-5 py-4 text-white transition-colors ${focusRing}`}
        >
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/15 shrink-0">
            <Phone className="w-5 h-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs uppercase tracking-[0.18em] text-orange-100">Order on</span>
            <span className="block text-xl font-semibold whitespace-nowrap">93901 05767</span>
          </span>
          <ArrowUpRight className="w-5 h-5 shrink-0 motion-safe:transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <p className="mt-6 flex gap-2.5 text-sm leading-relaxed max-w-sm">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-orange-400" />
          <span>8-1-284/OU/461, OU Colony, Shaikpet, Hyderabad, Telangana 500008</span>
        </p>
      </div>

      {/* Link columns */}
      <div className="min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-10">
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="min-w-0">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className={`text-stone-200 hover:text-white whitespace-nowrap transition-colors ${focusRing} focus-visible:outline-offset-2`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </div>

    {/* Base bar */}
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 py-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-5">
        <p className="text-sm text-stone-400">© {new Date().getFullYear()} Bon Appetit · Made by hand in Hyderabad</p>
        <ul className="flex gap-3">
          {socials.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className={`flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-stone-200 hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-colors ${focusRing}`}
              >
                <s.icon className="w-[18px] h-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>
);

const Footer = () => <FooterBody showMarketplaces />;

// SimpleFooter: same footer without the marketplace band
const SimpleFooter = () => <FooterBody showMarketplaces={false} />;

export { Footer, SimpleFooter };
export default Footer;
