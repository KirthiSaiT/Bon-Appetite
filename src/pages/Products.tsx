/* Hallmark · redesign · macrostructure: Three Doors (big door tiles switch one panel below)
 * theme: custom (project tokens · Cormorant Garamond + DM Sans · orange accent) · enrichment: photographic
 * audience: Hyderabad food lovers · use: pick fresh pasta, order cooked food, or book a service · tone: warm editorial
 * pre-emit critique: P4 H5 E4 S5 R4 V5
 * Content (pasta items, prices, recipes, photos, ordering text, delivery links) is edited in Admin → Cafe.
 */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Loader2, Phone, ShoppingBag, UtensilsCrossed, Users, X,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { CafePasta, DELIVERY_APPS, lines, useCafePastas, useSiteSettings } from "@/hooks/use-cafe-data";

type DoorId = "pasta" | "order" | "services";

const doors: { id: DoorId; title: string; line: string; image: string }[] = [
  { id: "pasta", title: "Fresh Pasta", line: "Handmade packs, each with a recipe", image: "/freshpasta.webp" },
  { id: "order", title: "Order from the Cafe", line: "Hot plates on Zomato & Swiggy", image: "/cooked.webp" },
  { id: "services", title: "Services", line: "Catering & corporate workshops", image: "/catering.webp" },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";

const PanelHead = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="mb-8 md:mb-10 max-w-2xl">
    <h2
      className="text-[2rem] md:text-[2.8rem] font-semibold leading-[1.08] text-stone-900 [overflow-wrap:anywhere]"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {title}
    </h2>
    {children && <p className="mt-3 text-stone-600 leading-relaxed">{children}</p>}
  </div>
);

/* ── Fresh pasta: sleek dropdown rows that open into a recipe ── */

const PastaRow = ({ pasta }: { pasta: CafePasta }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const ingredients = lines(pasta.recipe_ingredients);
  const steps = lines(pasta.recipe_steps);
  const hasRecipe = ingredients.length > 0 || steps.length > 0;

  const add = () => {
    addToCart({
      id: `cafe-${pasta.id}`,
      name: `${pasta.name}${pasta.price_note ? ` (${pasta.price_note})` : ""}`,
      price: pasta.price,
      image: pasta.image,
    });
    setAdded(true);
    toast.success(`${pasta.name} added to your cart`);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <AccordionPrimitive.Item value={pasta.id} className="border-b border-stone-200 group/item">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={`w-full text-left grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 sm:gap-6 py-5 ${focusRing}`}
        >
          <img
            src={pasta.image}
            alt=""
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-1 ring-stone-200 bg-white ${
              pasta.image === "/freshpasta.webp" ? "object-contain p-2" : "object-cover"
            }`}
          />
          <span className="min-w-0">
            <span
              className="block text-2xl sm:text-[1.75rem] font-semibold leading-tight text-stone-900 [overflow-wrap:anywhere]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {pasta.name}
            </span>
            {pasta.description && <span className="mt-0.5 block text-sm text-stone-600">{pasta.description}</span>}
            <span className="mt-1.5 block text-sm sm:hidden font-semibold text-orange-700">
              ₹{pasta.price}
              {pasta.price_note && <span className="font-normal text-stone-500"> · {pasta.price_note}</span>}
            </span>
          </span>
          <span className="flex items-center gap-4 sm:gap-6">
            <span className="hidden sm:block text-right">
              <span className="block text-xl font-semibold text-stone-900 tabular-nums">₹{pasta.price}</span>
              {pasta.price_note && <span className="block text-xs text-stone-500 whitespace-nowrap">{pasta.price_note}</span>}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 whitespace-nowrap transition-colors group-hover/item:border-stone-500 group-data-[state=open]/item:border-orange-600 group-data-[state=open]/item:bg-orange-600 group-data-[state=open]/item:text-white">
              <span className="hidden sm:inline">Recipe</span>
              <ChevronDown className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-200 group-data-[state=open]/item:rotate-180" />
            </span>
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
        <div className="pb-8 sm:pl-[6.5rem]">
          <div className="rounded-3xl bg-stone-50 p-5 sm:p-7">
            {hasRecipe ? (
              <>
                {pasta.recipe_title && (
                  <h3 className="text-2xl font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
                    {pasta.recipe_title}
                  </h3>
                )}
                <div className="mt-5 grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8">
                  {ingredients.length > 0 && (
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">You'll need</p>
                      <ul className="mt-3 space-y-2 text-sm text-stone-700">
                        {ingredients.map((i) => (
                          <li key={i} className="flex gap-2.5">
                            <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            {i}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {steps.length > 0 && (
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Method</p>
                      <ol className="mt-3 space-y-3 text-sm text-stone-700">
                        {steps.map((s, n) => (
                          <li key={s} className="flex gap-3">
                            <span className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-white ring-1 ring-stone-300 text-xs font-semibold text-stone-700">
                              {n + 1}
                            </span>
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-stone-600">Recipe coming soon.</p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={add}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white whitespace-nowrap transition-colors active:translate-y-px ${
                  added ? "bg-green-700" : "bg-orange-600 hover:bg-orange-700"
                } ${focusRing}`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                {added ? "Added" : `Add to cart · ₹${pasta.price}`}
              </button>
              <Link
                to="/fresh-pasta"
                className={`inline-flex items-center gap-2 rounded-full border border-stone-300 hover:border-stone-900 px-5 py-3 text-sm font-semibold text-stone-700 whitespace-nowrap transition-colors ${focusRing}`}
              >
                All flavours & weights <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
};

const PastaPanel = () => {
  const { data: pastas = [], isLoading } = useCafePastas();
  return (
    <>
      <PanelHead title="Fresh pasta, with a recipe for each.">
        Rolled by hand when you order. Open any pasta to see how we'd cook it tonight.
      </PanelHead>
      {isLoading ? (
        <p className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading the menu…</p>
      ) : pastas.length === 0 ? (
        <p className="text-stone-600 bg-stone-50 rounded-2xl p-6">Our fresh pasta menu is being updated. Check back soon.</p>
      ) : (
        <AccordionPrimitive.Root type="single" collapsible className="border-t border-stone-200">
          {pastas.map((p) => <PastaRow key={p.id} pasta={p} />)}
        </AccordionPrimitive.Root>
      )}
    </>
  );
};

/* ── Order from the cafe: three big delivery-app tiles ── */

const OrderPanel = () => {
  const { get } = useSiteSettings();
  return (
    <>
      <PanelHead title="Order from the Cafe.">{get("cafe.order_intro")}</PanelHead>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {DELIVERY_APPS.map((app) => {
          const url = get(`cafe.${app.id}_url`);
          const logo = get(`cafe.${app.id}_logo`);
          const face = (
            <>
              <span className="flex h-24 md:h-32 items-center justify-center">
                {logo ? (
                  <img src={logo} alt={app.name} className="max-h-full max-w-[80%] object-contain" />
                ) : (
                  <span
                    className="text-[2.6rem] md:text-[3.2rem] font-semibold leading-none text-stone-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {app.name}
                  </span>
                )}
              </span>
              <span
                className={`mt-6 flex items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap ${
                  url ? "text-orange-700" : "text-stone-400"
                }`}
              >
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
                  className={`block h-full rounded-3xl border border-stone-200 bg-white px-6 py-9 md:py-12 transition-colors hover:border-orange-600 hover:bg-orange-50/40 active:translate-y-px ${focusRing}`}
                >
                  {face}
                </a>
              ) : (
                <div aria-disabled="true" className="h-full rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-9 md:py-12 opacity-80">
                  {face}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-stone-600">
        Prefer to call?
        <a
          href="tel:+919390105767"
          className={`inline-flex items-center gap-2 font-semibold text-stone-900 hover:text-orange-700 whitespace-nowrap ${focusRing}`}
        >
          <Phone className="w-4 h-4 text-orange-600" /> 93901 05767
        </a>
      </p>
    </>
  );
};

/* ── Services: catering + corporate workshops ── */

const ServicesPanel = ({ onCatering }: { onCatering: () => void }) => {
  const cardCls = `group text-left h-full flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white transition-colors hover:border-orange-600 ${focusRing}`;
  const body = (title: string, text: string, cta: string, icon: React.ReactNode) => (
    <span className="flex flex-1 flex-col p-6 md:p-8">
      <span className="flex items-center gap-3 text-orange-600">{icon}</span>
      <span
        className="mt-3 text-[1.9rem] md:text-[2.2rem] font-semibold leading-tight text-stone-900"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </span>
      <span className="mt-2 text-stone-600 leading-relaxed">{text}</span>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-900 whitespace-nowrap group-hover:text-orange-700">
        {cta}
        <ArrowRight className="w-4 h-4 motion-safe:transition-transform group-hover:translate-x-1" />
      </span>
    </span>
  );
  const photo = (src: string, alt: string) => (
    <span className="block aspect-[16/9] overflow-hidden bg-white p-6 border-b border-stone-100">
      <img src={src} alt={alt} loading="lazy" className="w-full h-full object-contain motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.03]" />
    </span>
  );

  return (
    <>
      <PanelHead title="For your event or your team.">
        Bring our kitchen to your celebration, or bring your team into the kitchen.
      </PanelHead>
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
        <button type="button" onClick={onCatering} className={cardCls}>
          {photo("/catering.webp", "")}
          {body("Catering", "Delivered trays or full service with waiters, for events up to 250 guests.", "Enquire about catering", <UtensilsCrossed className="w-6 h-6" />)}
        </button>
        <Link to="/pasta-workshops" className={cardCls}>
          {photo("/pastaworkshop.webp", "")}
          {body("Corporate workshops", "Hands-on pasta making for your team. See upcoming dates and book a session.", "See workshops", <Users className="w-6 h-6" />)}
        </Link>
      </div>
    </>
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
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab");
  const active: DoorId = doors.some((d) => d.id === requested) ? (requested as DoorId) : "pasta";
  const [catering, setCatering] = useState(false);

  const open = (id: DoorId) => {
    setParams(id === "pasta" ? {} : { tab: id }, { replace: true });
    document.getElementById("cafe-panel")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      <header className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 pt-14 md:pt-20 pb-10">
        <h1
          className="text-[3rem] sm:text-[4rem] xl:text-[5rem] font-semibold leading-[1.02] text-stone-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The <span className="text-orange-600">Cafe.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
          Take home fresh pasta, order a hot plate, or book us for your event. Pick a door.
        </p>
      </header>

      {/* Three doors */}
      <nav aria-label="Cafe sections" className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20">
        <div role="tablist" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          {doors.map((d) => {
            const selected = active === d.id;
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                id={`door-${d.id}`}
                aria-selected={selected}
                aria-controls="cafe-panel"
                onClick={() => open(d.id)}
                className={`group relative text-left overflow-hidden rounded-3xl border-2 transition-colors grid grid-cols-[6rem_minmax(0,1fr)] sm:grid-cols-1 ${focusRing} ${
                  selected ? "border-orange-600 bg-orange-50" : "border-stone-200 bg-white hover:border-stone-400"
                }`}
              >
                {/* Category images are logo artwork, so show them whole on white */}
                <span className="block h-full sm:h-auto sm:aspect-[4/3] overflow-hidden bg-white p-3 sm:p-8">
                  <img
                    src={d.image}
                    alt=""
                    className="w-full h-full object-contain motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="flex items-center justify-between gap-3 p-4 sm:p-6">
                  <span className="min-w-0">
                    <span
                      className={`block text-[1.6rem] md:text-[2rem] font-semibold leading-tight [overflow-wrap:anywhere] ${
                        selected ? "text-orange-700" : "text-stone-900"
                      }`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {d.title}
                    </span>
                    <span className="mt-1 block text-sm text-stone-600">{d.line}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-full transition-colors ${
                      selected ? "bg-orange-600 text-white" : "border border-stone-300 text-stone-600 group-hover:border-stone-900"
                    }`}
                  >
                    {selected ? <ChevronDown className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* The open door */}
      <main
        id="cafe-panel"
        role="tabpanel"
        aria-labelledby={`door-${active}`}
        className="max-w-7xl mx-auto px-6 md:px-14 xl:px-20 pt-14 md:pt-20 pb-20 scroll-mt-20"
      >
        {active === "pasta" && <PastaPanel />}
        {active === "order" && <OrderPanel />}
        {active === "services" && <ServicesPanel onCatering={() => setCatering(true)} />}
      </main>

      {/* Dry pasta pointer */}
      <section className="border-t border-stone-200">
        <Link
          to="/our-pasta-brand"
          className={`group max-w-7xl mx-auto px-6 md:px-14 xl:px-20 py-10 flex flex-wrap items-center justify-between gap-4 ${focusRing}`}
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
