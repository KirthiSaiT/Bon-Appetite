/* Hallmark · redesign · macrostructure: Logo Spotlight (free-standing logos, open one in colour, others greyed → one section at a time → paged fresh pasta list)
 * theme: custom (project tokens · Cormorant Garamond + DM Sans · orange accent · --menu-* cream/olive/rust from the printed menu card)
 * enrichment: supplied logo artwork + kitchen photos + supplied "Making of our pasta" / "Goodness without guilt" panels
 * order chapter: pasta photos · Order from us (build a plate / call) · menu-card window · delivery apps · pure-pulp band
 * audience: Hyderabad food lovers · use: order fresh pasta, order hot food, or book a service · tone: warm editorial
 * pre-emit critique: P4 H5 E4 S5 R4 V5
 * Content (pasta items, prices, recipes, photos, ordering text, delivery links) is edited in Admin → Cafe.
 */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { ArrowRight, ArrowUpRight, Loader2, Phone, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { OrderList, OrderRow, cafeMenus, focusRing } from "@/components/OrderSheet";
import { MenuCardButton } from "@/components/CafeMenu";
import { CafePasta, DELIVERY_APPS, lines, useCafePastas, useSiteSettings } from "@/hooks/use-cafe-data";

type ChapterId = "pasta" | "order" | "services";

const chapters: { id: ChapterId; label: string; line: string; logo: string; alt: string }[] = [
  { id: "pasta", label: "Fresh Pasta", line: "Handmade packs, each with its price and a recipe", logo: "/freshpasta.webp", alt: "Fresh Pasta" },
  { id: "order", label: "Order from the Cafe", line: "Hot plates on Zomato and Swiggy", logo: "/readytoeat.webp", alt: "Ready to eat" },
  { id: "services", label: "Services", line: "Catering and corporate workshops", logo: "/services.webp", alt: "Services" },
];

const flavourDots = [
  { name: "Plain", swatch: "var(--flavour-plain)" },
  { name: "Spinach", swatch: "var(--flavour-spinach)" },
  { name: "Paprika", swatch: "var(--flavour-paprika)" },
  { name: "Beetroot", swatch: "var(--flavour-beetroot)" },
  { name: "Wheat", swatch: "var(--flavour-wheat)" },
];

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Chapter head: the chapter's logo sits beside its heading */
const ChapterHead = ({ logo, title, children }: { logo: string; title: string; children?: React.ReactNode }) => (
  <div className="mb-10 md:mb-14 grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center gap-4 sm:gap-6 md:gap-10">
    <span className="block w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 overflow-hidden rounded-full bg-white ring-1 ring-stone-200">
      <img src={logo} alt="" className="w-full h-full object-contain scale-[1.45]" />
    </span>
    <div className="min-w-0">
      <h2
        className="text-[2.4rem] md:text-[3.8rem] font-bold leading-[1.0] text-stone-900 [overflow-wrap:anywhere]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {children && <p className="mt-3 max-w-2xl text-lg md:text-xl text-stone-600 leading-relaxed">{children}</p>}
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
          // Paged 4 at a time; the pager stays visible so it's ready as more pastas are added in Admin → Cafe
          <OrderList noun="pastas">
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
    <section id="cafe-order" aria-labelledby="cafe-order-title" className="scroll-mt-24 bg-[var(--menu-cream)] border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-14 xl:px-6 py-14 md:py-20">
        <div id="cafe-order-title">
          <ChapterHead logo="/readytoeat.webp" title="5 flavours. Zero guilt.">{get("cafe.order_intro")}</ChapterHead>
        </div>

        {/* Pictures of our pasta · order straight from us · a small window onto the menu card */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          {/* phones: two photos side by side, the order card full width under them; sm+: tall photo left, packs + card stacked right */}
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] sm:grid-rows-[minmax(0,1fr)_auto] gap-4 md:gap-6">
            <figure className="sm:row-span-2 aspect-square sm:aspect-auto overflow-hidden rounded-3xl bg-stone-200">
              <img src="/spinachpasta (1).webp" alt="Spinach pasta with the ingredients that go into it" loading="lazy" className="w-full h-full sm:min-h-[16rem] object-cover" />
            </figure>
            <figure className="aspect-square sm:aspect-auto min-w-0 overflow-hidden rounded-3xl bg-stone-200">
              <img src="/aboutus.webp" alt="Paprika, spinach and beetroot pasta packs" loading="lazy" className="w-full h-full object-cover" />
            </figure>
            <div className="col-span-2 sm:col-span-1 min-w-0">
              <div className="rounded-3xl bg-orange-700 p-5 md:p-7 text-white">
                <h3 className="text-[1.7rem] md:text-[2.1rem] font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>
                  Order from us
                </h3>
                <p className="mt-2 text-sm md:text-base text-orange-50 leading-relaxed">Build your plate online, or call the kitchen.</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <Link
                    to="/cooked-pasta"
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-white text-stone-900 hover:bg-orange-50 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors active:translate-y-px ${focusRing}`}
                  >
                    Build your plate <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="tel:+919390105767"
                    className={`inline-flex items-center justify-center gap-2 rounded-full border border-orange-300 hover:bg-orange-800 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors active:translate-y-px ${focusRing}`}
                  >
                    <Phone className="w-4 h-4" /> 93901 05767
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[22rem] w-full justify-self-center lg:max-w-none">
            <MenuCardButton />
          </div>
        </div>

        <h3 className="mt-14 md:mt-20 mb-5 md:mb-6 text-2xl md:text-[2.2rem] font-bold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
          Or order on your delivery app
        </h3>
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
        {/* What colours the dough */}
        <div className="mt-14 md:mt-20 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center rounded-3xl md:rounded-[2.5rem] px-6 py-8 md:px-12 md:py-12 text-white" style={{ background: "var(--menu-olive)" }}>
          <div className="min-w-0">
            <p className="text-[2rem] md:text-[3rem] font-bold leading-[1.02] [overflow-wrap:anywhere]" style={{ fontFamily: "var(--font-display)" }}>
              Pure vegetable pulp.
            </p>
            <p className="mt-2 text-base md:text-lg text-stone-100 leading-relaxed">No added colours. No preservatives. Just what grows.</p>
          </div>
          <ul className="flex items-center" aria-label="Our five flavours">
            {flavourDots.map((f) => (
              <li key={f.name} className="-ml-2 first:ml-0">
                <span
                  role="img"
                  aria-label={f.name}
                  title={f.name}
                  className="block w-12 h-12 md:w-16 md:h-16 rounded-full ring-4"
                  style={{ background: f.swatch, ["--tw-ring-color" as string]: "var(--menu-olive)" }}
                />
              </li>
            ))}
          </ul>
        </div>
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
        "service_z4w0fmg",
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
  const [catering, setCatering] = useState(false);
  const requested = params.get("tab");
  const activeIndex = Math.max(0, chapters.findIndex((c) => c.id === requested));
  const active = chapters[activeIndex];

  // Switch section; ?tab= keeps old links (/products?tab=order) working
  const show = (i: number, scroll = false) => {
    const c = chapters[(i + chapters.length) % chapters.length];
    setParams(c.id === "pasta" ? {} : { tab: c.id }, { replace: true });
    if (scroll) document.getElementById("cafe-picker")?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  };

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

        {/* Spotlight picker: the logos stand free on the page (no boxes, no rings).
            The open section's logo is full colour and full size; the other two step back
            in grey until hovered. A hairline track underneath marks the open one in orange. */}
        <nav id="cafe-picker" aria-label="Cafe sections" className="mt-8 md:mt-12 scroll-mt-20">
          <div role="tablist" className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-stone-200">
            {chapters.map((c, i) => {
              const selected = i === activeIndex;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls="cafe-panel"
                  aria-label={c.label}
                  onClick={() => show(i)}
                  className={`group relative block min-w-0 -mb-px pb-3 md:pb-5 rounded-t-2xl ${focusRing}`}
                >
                  {/* The artwork carries wide white margins; the crop is invisible on the white page */}
                  <span className="mx-auto block aspect-square w-full max-w-[17rem] overflow-hidden">
                    <img
                      src={c.logo}
                      alt=""
                      className={`w-full h-full object-contain mix-blend-multiply motion-safe:transition-[transform,filter,opacity] motion-safe:duration-300 ${
                        selected
                          ? "scale-[1.6] opacity-100 brightness-[1.04]"
                          : "scale-[1.3] opacity-50 grayscale brightness-[1.04] group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-[1.38]"
                      }`}
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-[18%] bottom-0 h-[3px] rounded-full motion-safe:transition-colors motion-safe:duration-200 ${
                      selected ? "bg-orange-600" : "bg-transparent group-hover:bg-stone-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main id="cafe-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`}>
        {active.id === "pasta" && <PastaChapter />}
        {active.id === "order" && <OrderChapter />}
        {active.id === "services" && <ServicesChapter onCatering={() => setCatering(true)} />}
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
