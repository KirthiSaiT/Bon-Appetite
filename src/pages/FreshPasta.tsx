/* Hallmark · genre: editorial · macrostructure: Order Sheet · shared system (components/OrderSheet) */
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { OrderPage, OrderList, OrderRow, Choice, flavourSwatch } from "@/components/OrderSheet";
import { usePrices } from "@/hooks/use-menu-data";

const freshPastaTypes = [
  { id: "fp001", name: "Ravioli", description: "Stuffed pasta with gourmet fillings.", features: ["Ricotta Spinach", "Chicken Cheese"] },
  { id: "fp002", name: "Fettucine", description: "Flat, thick pasta ribbons ideal for creamy and hearty sauces.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp003", name: "Farfalle", description: "Bow-tie shaped pasta, perfect for light sauces and elegant presentations.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp004", name: "Spaghetti", description: "Long, thin cylindrical pasta, a staple for classic Italian dishes.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp005", name: "Heart", description: "Fun heart-shaped pasta, perfect for special occasions and kids.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp006", name: "Star", description: "Star-shaped pasta, great for soups and adding a playful touch to meals.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp007", name: "Flower", description: "Flower-shaped pasta, brings a decorative and delightful look to your dishes.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
];

// Defaults until the admin's prices load: 25g ₹30, 50g ₹60, 100g ₹100, 250g ₹250
const defaultByWeight: Record<number, number> = { 25: 30, 50: 60, 100: 100, 250: 250 };
const weights = [25, 50, 100, 250];

const PastaRow = ({ pasta, index }: { pasta: (typeof freshPastaTypes)[number]; index: number }) => {
  const { addToCart } = useCart();
  const { price: dbPrice } = usePrices();
  const priceByWeight = (w: number) => dbPrice(`fresh.${w}`, defaultByWeight[w]);
  const [flavour, setFlavour] = useState(pasta.features[0]);
  const [weight, setWeight] = useState(250);
  const price = priceByWeight(weight);

  return (
    <OrderRow
      index={index}
      image={`/menu-photos/fresh-pasta/${pasta.name.toLowerCase()}.webp`}
      fallbackImage="/freshpasta.webp"
      name={pasta.name}
      description={pasta.description}
      tint={flavourSwatch[flavour]}
      price={price}
      priceNote={`${weight}g · ${flavour}`}
      onAdd={() =>
        addToCart({
          id: `${pasta.id}-${flavour}-${weight}`,
          name: `${pasta.name} ${flavour} (${weight}g)`,
          price,
          image: "/freshpasta.webp",
        })
      }
    >
      <Choice
        label={pasta.id === "fp001" ? "Filling" : "Flavour"}
        value={flavour}
        onChange={setFlavour}
        options={pasta.features.map((f) => ({ value: f, label: f, swatch: flavourSwatch[f] }))}
      />
      <Choice
        label="Weight"
        value={weight}
        onChange={setWeight}
        options={weights.map((w) => ({ value: w, label: `${w}g`, hint: `₹${priceByWeight(w)}` }))}
      />
    </OrderRow>
  );
};

const FreshPasta = () => (
  <OrderPage
    eyebrow="Ready to Cook"
    title="Our"
    accent="Fresh Pasta"
    intro="Handmade fresh pasta, crafted daily. Pick a shape, a flavour and a weight."
    leadTime="Pre-order 1–2 days ahead"
    shelfLife="2-hour shelf life"
    stamp="/freshpasta.webp"
  >
    <OrderList>
      {freshPastaTypes.map((p, i) => (
        <PastaRow key={p.id} pasta={p} index={i + 1} />
      ))}
    </OrderList>
  </OrderPage>
);

export default FreshPasta;
