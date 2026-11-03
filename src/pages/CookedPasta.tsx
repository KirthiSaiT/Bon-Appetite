/* Hallmark · genre: editorial · macrostructure: Order Sheet (combo builder) · shared system (components/OrderSheet) */
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { OrderPage, Choice, AddButton, Thumb, flavourSwatch } from "@/components/OrderSheet";
import { usePrices } from "@/hooks/use-menu-data";

const pastaOptions = [
  { name: "Fettuccine", variants: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { name: "Farfalle", variants: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { name: "Spaghetti", variants: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
];
const ravioliOptions = [
  { name: "Ricotta Spinach", variants: ["Beetroot"] },
  { name: "Corn Cheese", variants: ["Wheat"] },
  { name: "Chicken Cheese", variants: [""] },
];
const sauceOptions = ["Tomato Basil Sauce", "Arrabbiata", "Pesto"];

type ComboType = "standard" | "ravioli";

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <section className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 md:gap-x-8 py-8 border-b border-stone-200">
    <span className="w-10 h-10 rounded-full border border-stone-900 flex items-center justify-center text-sm font-semibold text-stone-900">
      {n}
    </span>
    <div className="min-w-0">
      <h2
        className="text-2xl md:text-[1.75rem] font-bold leading-tight text-stone-900 mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  </section>
);

const CookedPasta = () => {
  const { addToCart } = useCart();

  const [comboType, setComboType] = useState<ComboType>("standard");
  const [selectedPasta, setSelectedPasta] = useState("Fettuccine");
  const [selectedRavioli, setSelectedRavioli] = useState("Ricotta Spinach");
  const [selectedVariant, setSelectedVariant] = useState("Plain");
  const [selectedSauce, setSelectedSauce] = useState("Tomato Basil Sauce");
  const [extraSauce, setExtraSauce] = useState(false);
  const [extraCheese, setExtraCheese] = useState(false);

  const isStandard = comboType === "standard";
  const main = isStandard ? selectedPasta : selectedRavioli;
  const variants = isStandard
    ? pastaOptions.find((p) => p.name === selectedPasta)?.variants ?? []
    : ravioliOptions.find((r) => r.name === selectedRavioli)?.variants ?? [""];

  const { price: dbPrice } = usePrices();
  const cost = {
    standard: dbPrice("combo.standard", 250),
    ravioli: dbPrice("combo.ravioli", 300),
    sauce: dbPrice("extra.sauce", 70),
    cheese: dbPrice("extra.cheese", 50),
  };
  const price = (isStandard ? cost.standard : cost.ravioli) + (extraSauce ? cost.sauce : 0) + (extraCheese ? cost.cheese : 0);
  const extras = [extraSauce ? "Extra Sauce" : null, extraCheese ? "Extra Cheese" : null].filter(Boolean).join(", ");

  const switchCombo = (type: ComboType) => {
    setComboType(type);
    if (type === "standard") {
      setSelectedPasta("Fettuccine");
      setSelectedVariant(pastaOptions[0].variants[0]);
    } else {
      setSelectedRavioli("Ricotta Spinach");
      setSelectedVariant(ravioliOptions[0].variants[0]);
    }
  };

  const handleAdd = () => {
    const name = isStandard
      ? `${selectedPasta} (${selectedVariant}) with ${selectedSauce} Sauce [Standard Combo]`
      : `Ravioli - ${selectedRavioli} (${selectedVariant}) with ${selectedSauce} Sauce [Ravioli Combo]`;
    addToCart({
      id: `combo-${comboType}-${main}-${selectedVariant}-${selectedSauce}-${extras || "none"}`,
      name: extras ? `${name} + ${extras}` : name,
      price,
      image: "/cooked.webp",
    });
  };

  const toggle = (on: boolean, set: (v: boolean) => void, label: string, cost: number) => (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => set(!on)}
      className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold whitespace-nowrap border rounded-full motion-safe:transition-colors active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 ${
        on ? "bg-stone-900 border-stone-900 text-white" : "bg-white border-stone-300 text-stone-700 hover:border-stone-900"
      }`}
    >
      {label}
      <span className={on ? "text-stone-300 font-normal" : "text-stone-400 font-normal"}>+₹{cost}</span>
    </button>
  );

  return (
    <OrderPage
      eyebrow="Ready to Eat"
      title="Our"
      accent="Cooked Pasta"
      intro="Delicious pasta dishes, cooked to perfection. Build your combo in four steps."
      leadTime="Pre-order 1–2 days ahead"
      shelfLife="2-hour shelf life"
      stamp="/cooked.webp"
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] gap-10 lg:gap-16 items-start">
        <div className="border-t-2 border-stone-900 min-w-0">
          <Step n={1} title="Pick a combo">
            <Choice
              label="Combo"
              value={comboType}
              onChange={switchCombo}
              options={[
                { value: "standard", label: "Standard", hint: `₹${cost.standard}` },
                { value: "ravioli", label: "Ravioli", hint: `₹${cost.ravioli}` },
              ]}
            />
          </Step>

          <Step n={2} title={isStandard ? "Choose your pasta" : "Choose your ravioli"}>
            {isStandard ? (
              <Choice
                label="Shape"
                value={selectedPasta}
                onChange={(v) => {
                  setSelectedPasta(v);
                  setSelectedVariant(pastaOptions.find((p) => p.name === v)?.variants[0] ?? "");
                }}
                options={pastaOptions.map((p) => ({ value: p.name, label: p.name }))}
              />
            ) : (
              <Choice
                label="Filling"
                value={selectedRavioli}
                onChange={(v) => {
                  setSelectedRavioli(v);
                  setSelectedVariant(ravioliOptions.find((r) => r.name === v)?.variants[0] ?? "");
                }}
                options={ravioliOptions.map((r) => ({ value: r.name, label: r.name, swatch: flavourSwatch[r.name] }))}
              />
            )}
            <Choice
              label="Variant"
              value={selectedVariant}
              onChange={setSelectedVariant}
              options={variants.map((v) => ({ value: v, label: v || "Original", swatch: flavourSwatch[v || "Plain"] }))}
            />
          </Step>

          <Step n={3} title="Choose a sauce">
            <Choice
              label="Sauce"
              value={selectedSauce}
              onChange={setSelectedSauce}
              options={sauceOptions.map((s) => ({ value: s, label: s }))}
            />
          </Step>

          <Step n={4} title="Add extras">
            <div className="flex flex-wrap gap-2">
              {toggle(extraSauce, setExtraSauce, "Extra Sauce", cost.sauce)}
              {toggle(extraCheese, setExtraCheese, "Extra Cheese", cost.cheese)}
            </div>
          </Step>
        </div>

        <aside className="lg:sticky lg:top-28 bg-stone-900 text-stone-100 p-7 md:p-8">
          <div className="flex items-center gap-4">
            <Thumb
              key={main}
              src={`/menu-photos/cooked-pasta/${main.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`}
              fallbackSrc="/cooked.webp"
              alt={main}
              tint={flavourSwatch[selectedVariant || "Plain"]}
              index={isStandard ? 1 : 2}
            />
            <span className="text-[0.63rem] tracking-[0.25em] uppercase font-semibold text-orange-500">Your combo</span>
          </div>
          <dl className="mt-6 divide-y divide-stone-700 text-sm">
            {[
              ["Combo", isStandard ? "Standard" : "Ravioli"],
              [isStandard ? "Pasta" : "Ravioli", `${main} · ${selectedVariant || "Original"}`],
              ["Sauce", selectedSauce],
              ["Extras", extras || "None"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="text-stone-400">{k}</dt>
                <dd className="text-right font-semibold min-w-0 [overflow-wrap:anywhere]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 pt-6 border-t border-stone-600 flex items-end justify-between gap-4">
            <span className="text-stone-400 text-sm">Total</span>
            <span
              className="text-4xl font-bold text-white tabular-nums"
              style={{ fontFamily: "var(--font-display)" }}
              aria-live="polite"
            >
              ₹{price}
            </span>
          </div>
          <div className="mt-6 [&>button]:w-full">
            <AddButton onAdd={handleAdd} label="Add combo to cart" />
          </div>
        </aside>
      </div>
    </OrderPage>
  );
};

export default CookedPasta;
