/* Hallmark · redesign · macrostructure: Logo Index (three big logos jump to open chapters, all on one scroll)
 * theme: custom (project tokens · Cormorant Garamond + DM Sans · orange accent) · enrichment: supplied logo artwork, shown whole
 * audience: Hyderabad food lovers · use: order fresh pasta, order hot food, or book a service · tone: warm editorial
 * pre-emit critique: P4 H5 E4 S5 R4 V5
 * Content (pasta items, prices, recipes, photos, ordering text, delivery links) is edited in Admin → Cafe.
 */
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { ArrowDown, ArrowRight, ArrowUpRight, Loader2, Phone, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { OrderList, OrderRow, cafeMenus, focusRing } from "@/components/OrderSheet";
import { CafePasta, DELIVERY_APPS, lines, useCafePastas, useSiteSettings } from "@/hooks/use-cafe-data";

type ChapterId = "pasta" | "order" | "services";

const chapters: { id: ChapterId; label: string; logo: string; alt: string }[] = [
  { id: "pasta", label: "Fresh Pasta", logo: "/freshpasta.webp", alt: "Fresh Pasta" },
  { id: "order", label: "Order from the Cafe", logo: "/readytoeat.webp", alt: "Ready to eat" },
  { id: "services", label: "Services", logo: "/services.webp", alt: "Services" },
];

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const jumpTo = (id: ChapterId) =>
  document.getElementById(`cafe-${id}`)?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });

/* Chapter head: the chapter's logo sits beside its heading */
const ChapterHead = ({ logo, title, children }: { logo: string; title: string; children?: React.ReactNode }) => (
  <div className="mb-8 md:mb-12 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 md:gap-8">
    <span className="block w-20 h-20 md:w-28 md:h-28 overflow-hidden rounded-full bg-white ring-1 ring-stone-200">
      <img src={logo} alt="" className="w-full h-full object-contain scale-[1.45]" />
    </span>
    <div className="min-w-0">
      <h2
        className="text-[2rem] md:text-[3rem] font-semibold leading-[1.05] text-stone-900 [overflow-wrap:anywhere]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {children && <p className="mt-2 max-w-2xl text-stone-600 leading-relaxed">{children}</p>}
    </div>
  </div>
);

/* ── Fresh pasta: price, Order, Recipe dropdown on every card ── */

const CafePastaCard = ({ pasta, index }: { pasta: CafePasta; index: number }) => {
  const { addToCart } = useCart();
  const ingredients = lines(pasta.recipe_ingredients);
  const steps = lines(pasta.recipe_steps);
  const hasRecipe = ingredients.length > 0 || steps.length > 0;

  return (
    <OrderRow
      index={index}
      image={pasta.image === "/freshpasta.webp" ? undefined : pasta.image}
      fallbackImage="/freshpasta.webp"
      name={pasta.name}
      description={pasta.description ?? ""}
      tint=""
      price={pasta.price}
      priceNote={pasta.price_note ?? ""}
      recipe={hasRecipe ? { title: pasta.recipe_title || `How to cook ${pasta.name}`, ingredients, steps } : null}
      onAdd={() => {
        addToCart({
          id: `cafe-${pasta.id}`,
          name: `${pasta.name}${pasta.price_note ? ` (${pasta.price_note})` : ""}`,
          price: pasta.price,
          image: pasta.image,
        });
        toast.success(`${pasta.name} added to your cart`);
      }}
    />
  );
};

const PastaChapter = () => {
  const { data: pastas = [], isLoading } = useCafePastas();
  return (
    <section id="cafe-pasta" aria-labelledby="cafe-pasta-title" className="scroll-mt-24 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 py-14 md:py-20">
        <div id="cafe-pasta-title">
          <ChapterHead logo="/freshpasta.webp" title="Fresh pasta, with a recipe for each.">
            Rolled by hand when you order. See the price, open the recipe, and order in one tap.
          </ChapterHead>
        </div>

        {isLoading ? (
          <p className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading the menu…</p>
        ) : pastas.length === 0 ? (
          <p className="text-stone-600 bg-stone-50 rounded-2xl p-6">Our fresh pasta menu is being updated. Check back soon.</p>
        ) : (
          <OrderList>
            {pastas.map((p, i) => <CafePastaCard key={p.id} pasta={p} index={i + 1} />)}
          </OrderList>
        )}

        {/* The full cafe menu, each section shown by its own logo */}
        <h3 className="mt-16 md:mt-20 text-2xl md:text-[2rem] font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
          The full menu
        </h3>
        <p className="mt-1 text-stone-600">Every shape, flavour and weight, plus sauces, combos and desserts.</p>
        <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {cafeMenus.map((m) => (
            <li key={m.path} className="min-w-0">
              <Link
                to={m.path}
                className={`group flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-3 md:p-4 transition-colors hover:border-orange-600 active:translate-y-px ${focusRing}`}
              >
                <span className="block aspect-square w-full overflow-hidden rounded-2xl">
                  <img
                    src={m.logo}
                    alt={m.name}
                    loading="lazy"
                    className="w-full h-full object-contain scale-[1.25] motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.32]"
                  />
                </span>
                <span className="mt-2 flex items-center justify-between gap-2 px-1 text-sm font-semibold text-stone-800 group-hover:text-orange-700">
                  <span className="min-w-0 truncate">{m.name}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 motion-safe:transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* ── Order from the cafe: delivery apps ── */

const OrderChapter = () => {
  const { get } = useSiteSettings();
  return (
    <section id="cafe-order" aria-labelledby="cafe-order-title" className="scroll-mt-24 bg-stone-50 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 py-14 md:py-20">
        <div id="cafe-order-title">
          <ChapterHead logo="/readytoeat.webp" title="Order from the Cafe.">{get("cafe.order_intro")}</ChapterHead>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {DELIVERY_APPS.map((app) => {
            const url = get(`cafe.${app.id}_url`);
            const logo = get(`cafe.${app.id}_logo`);
            const face = (
              <>
                <span className="flex h-20 md:h-28 items-center justify-center">
                  {logo ? (
                    <img src={logo} alt={app.name} className="max-h-full max-w-[80%] object-contain" />
                  ) : (
                    <span className="text-[2.4rem] md:text-[3rem] font-semibold leading-none text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
                      {app.name}
                    </span>
                  )}
                </span>
                <span className={`mt-5 flex items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap ${url ? "text-orange-700" : "text-stone-400"}`}>
                  {url ? <>Order on {app.name} <ArrowUpRight className="w-4 h-4" /></> : "Link coming soon"}
                </span>
              </>
            );
            return (
              <li key={app.id}>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block h-full rounded-3xl border border-stone-200 bg-white px-6 py-8 md:py-10 transition-colors hover:border-orange-600 active:translate-y-px ${focusRing}`}
                  >
                    {face}
                  </a>
                ) : (
                  <div aria-disabled="true" className="h-full rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-8 md:py-10">
                    {face}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-stone-600">
          Prefer to call?
          <a href="tel:+919390105767" className={`inline-flex items-center gap-2 font-semibold text-stone-900 hover:text-orange-700 whitespace-nowrap ${focusRing}`}>
            <Phone className="w-4 h-4 text-orange-600" /> 93901 05767
          </a>
        </p>
      </div>
    </section>
  );
};

/* ── Services: catering + corporate workshops ── */

const ServicesChapter = ({ onCatering }: { onCatering: () => void }) => {
  const cardCls = `group text-left h-full grid grid-cols-1 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] items-center gap-3 sm:gap-5 [&>span:first-child]:max-w-[8rem] sm:[&>span:first-child]:max-w-none rounded-3xl border border-stone-200 bg-white p-4 md:p-6 transition-colors hover:border-orange-600 active:translate-y-px ${focusRing}`;
  const body = (title: string, text: string, cta: string) => (
    <span className="min-w-0">
      <span className="block text-[1.7rem] md:text-[2rem] font-semibold leading-tight text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </span>
      <span className="mt-1.5 block text-sm md:text-base text-stone-600 leading-relaxed">{text}</span>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 whitespace-nowrap">
        {cta} <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
      </span>
    </span>
  );
  const logo = (src: string) => (
    <span className="block w-full aspect-square overflow-hidden rounded-2xl">
      <img src={src} alt="" loading="lazy" className="w-full h-full object-contain scale-[1.3]" />
    </span>
  );

  return (
    <section id="cafe-services" aria-labelledby="cafe-services-title" className="scroll-mt-24 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 py-14 md:py-20">
        <div id="cafe-services-title">
          <ChapterHead logo="/services.webp" title="For your event or your team.">
            Bring our kitchen to your celebration, or bring your team into the kitchen.
          </ChapterHead>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 md:gap-6">
          <button type="button" onClick={onCatering} className={cardCls}>
            {logo("/catering.webp")}
            {body("Catering", "Delivered trays or full service with waiters, for events up to 250 guests.", "Enquire about catering")}
          </button>
          <Link to="/pasta-workshops" className={cardCls}>
            {logo("/pastaworkshop.webp")}
            {body("Corporate workshops", "Hands-on pasta making for your team. See upcoming dates and book a session.", "See workshops")}
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ── Catering enquiry ── */

const emptyCatering = { name: "", phone: "", eventDate: "", eventTime: "", serviceType: "Delivery", people: "", query: "" };
const inputCls =
  "w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none";

const CateringModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState(emptyCatering);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof emptyCatering, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.eventDate || !form.eventTime || !form.people) {
      return setError("Please fill in all the required fields.");
    }
    setSending(true);
    try {
      await emailjs.send(
        "service_0ngsn9l",
        "template_rdzt2i6",
        {
          from_name: form.name.trim(),
          to_name: "Bon Appetit",
          subject: `Catering enquiry · ${form.eventDate}`,
          message:
            `New catering enquiry\n\nName: ${form.name}\nPhone: ${form.phone}\nDate: ${form.eventDate}\nTime: ${form.eventTime}\n` +
            `Service: ${form.serviceType}\nGuests: ${form.people}\n\n${form.query || "(no menu notes)"}`,
        },
        "lBQ8UpD7SH9b45AVq",
      );
      toast.success("Thanks! We'll call you about your event.");
      onClose();
    } catch {
      setError("We couldn't send your enquiry. Please call us on 93901 05767.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="catering-title" className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-5 flex items-center justify-between">
          <h3 id="catering-title" className="text-xl font-bold text-stone-900">Catering enquiry</h3>
          <button type="button" onClick={onClose} aria-label="Close catering enquiry" className={`p-2 rounded-full hover:bg-stone-100 ${focusRing}`}>
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {([
            ["name", "Name *", "text"],
            ["phone", "Phone number *", "tel"],
            ["eventDate", "Event date *", "date"],
            ["eventTime", "Time (IST) *", "time"],
            ["people", "Number of guests *", "number"],
          ] as const).map(([k, label, type]) => (
            <div key={k}>
              <label htmlFor={`cat-${k}`} className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
              <input id={`cat-${k}`} type={type} min={type === "number" ? 1 : undefined} className={inputCls} value={form[k]} onChange={(e) => set(k, e.target.value)} />
            </div>
          ))}
          <div>
            <label htmlFor="cat-service" className="block text-sm font-medium text-stone-700 mb-1.5">Service type *</label>
            <select id="cat-service" className={inputCls} value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)}>
              <option value="Delivery">Delivery</option>
              <option value="Service (with waiters)">Service (with waiters)</option>
            </select>
          </div>
          <div>
            <label htmlFor="cat-query" className="block text-sm font-medium text-stone-700 mb-1.5">What menu are you looking for?</label>
            <textarea id="cat-query" rows={3} className={`${inputCls} resize-none`} value={form.query} onChange={(e) => set("query", e.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className={`flex-1 px-4 py-2.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 ${focusRing}`}>
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={sending}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white rounded-lg font-semibold whitespace-nowrap ${focusRing}`}
            >
              {sending && <Loader2 className="w-4 h-4 animate-spin" />}
              {sending ? "Sending…" : "Send enquiry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Page ── */

const Products = () => {
  const [params] = useSearchParams();
  const [catering, setCatering] = useState(false);

  // Old links like /products?tab=order still land on the right chapter
  useEffect(() => {
    const tab = params.get("tab");
    if (tab && chapters.some((c) => c.id === tab)) window.setTimeout(() => jumpTo(tab as ChapterId), 50);
  }, [params]);

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      <header className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 pt-12 md:pt-16 pb-12 md:pb-16">
        <h1
          className="text-[3rem] sm:text-[4rem] xl:text-[5rem] font-semibold leading-[1.02] text-stone-900 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The <span className="text-orange-600">Cafe.</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-center text-lg leading-relaxed text-stone-600">
          Take home fresh pasta, order a hot plate, or book us for your event.
        </p>

        {/* Logo index: the three logos, big, each jumps to its chapter */}
        <nav aria-label="Cafe sections" className="mt-10 md:mt-14">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {chapters.map((c) => (
              <li key={c.id} className="min-w-0">
                <a
                  href={`#cafe-${c.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    jumpTo(c.id);
                  }}
                  className={`group grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] sm:grid-cols-1 items-center h-full rounded-[2rem] border-2 border-stone-200 bg-white p-3 sm:p-5 transition-colors hover:border-orange-600 active:translate-y-px ${focusRing}`}
                >
                  {/* The artwork files carry wide white margins; crop them so the logo itself reads big */}
                  <span className="block w-full aspect-square overflow-hidden rounded-3xl">
                    <img
                      src={c.logo}
                      alt={c.alt}
                      className="w-full h-full object-contain scale-[1.5] motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.58]"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-3 px-3 sm:px-1 sm:pt-2">
                    <span
                      className="min-w-0 text-[1.4rem] sm:text-[1.2rem] md:text-[1.4rem] lg:text-[1.75rem] font-semibold leading-tight text-stone-900 group-hover:text-orange-700 sm:whitespace-nowrap"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {c.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden lg:flex items-center justify-center w-10 h-10 shrink-0 rounded-full border border-stone-300 text-stone-600 transition-colors group-hover:border-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <PastaChapter />
        <OrderChapter />
        <ServicesChapter onCatering={() => setCatering(true)} />
      </main>

      {/* Dry pasta pointer */}
      <section className="border-t border-stone-200">
        <Link
          to="/our-pasta-brand"
          className={`group max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 py-10 flex flex-wrap items-center justify-between gap-4 ${focusRing}`}
        >
          <span className="flex items-center gap-5 min-w-0">
            <img src="/drypasta.webp" alt="" className="w-14 h-14 rounded-full object-cover ring-1 ring-stone-200" />
            <span className="min-w-0">
              <span className="block text-xl md:text-2xl font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
                Looking for dry pasta?
              </span>
              <span className="block text-sm text-stone-600">Five shapes, five natural colours, on the Pasta Brand page.</span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-stone-800 whitespace-nowrap group-hover:text-orange-700">
            Visit Pasta Brand <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      {catering && <CateringModal onClose={() => setCatering(false)} />}
      <SimpleFooter />
    </div>
  );
};

export default Products;
