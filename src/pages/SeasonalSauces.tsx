/* Hallmark · genre: editorial · macrostructure: Logo Menu · shared system (components/OrderSheet) */
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { OrderPage, OrderList, OrderRow, Choice, formatRupees } from "@/components/OrderSheet";
import { usePrices } from "@/hooks/use-menu-data";

const sauces = [
  { id: "s009", name: "Tomato Basil Sauce", description: "Classic Italian sauce made with ripe tomatoes and fresh basil.", pricePer200ml: 150, tint: "var(--flavour-paprika)" },
  { id: "s010", name: "Arrabbiata", description: "Spicy tomato sauce with garlic and chili, a bold Italian favorite.", pricePer200ml: 150, tint: "var(--flavour-beetroot)" },
  { id: "s011", name: "Pesto", description: "Fresh basil pesto with pine nuts, garlic, and parmesan.", pricePer200ml: 180, tint: "var(--flavour-spinach)" },
];

const volumes = [100, 200, 300, 500];
const priceFor = (per200: number, ml: number) => parseFloat((per200 * ml / 200).toFixed(2));

const SauceRow = ({ sauce, index }: { sauce: (typeof sauces)[number]; index: number }) => {
  const { addToCart } = useCart();
  const { price: dbPrice } = usePrices();
  const per200 = dbPrice(`sauce.${sauce.id}`, sauce.pricePer200ml);
  const [ml, setMl] = useState(200);
  const price = priceFor(per200, ml);

  return (
    <OrderRow
      index={index}
      image={`/menu-photos/sauces/${sauce.name.toLowerCase().replace(/\s+/g, "-")}.webp`}
      fallbackImage="/seaonal.webp"
      name={sauce.name}
      description={sauce.description}
      tint={sauce.tint}
      price={price}
      priceNote={`${ml}ml jar`}
      onAdd={() =>
        addToCart({
          id: `${sauce.id}-${ml}`,
          name: `${sauce.name} (${ml}ml)`,
          price,
          image: "/seaonal.webp",
        })
      }
    >
      <Choice
        label="Size"
        value={ml}
        onChange={setMl}
        options={volumes.map((v) => ({ value: v, label: `${v}ml`, hint: formatRupees(priceFor(per200, v)) }))}
      />
    </OrderRow>
  );
};

const SeasonalSauces = () => (
  <OrderPage
    eyebrow="Ready to Cook"
    title="Our"
    accent="Seasonal Sauces"
    intro="Freshly made sauces to complement your pasta."
    leadTime="Pre-order 1–2 days ahead"
    shelfLife="1-month shelf life"
    stamp="/seaonal.webp"
  >
    <OrderList>
      {sauces.map((s, i) => (
        <SauceRow key={s.id} sauce={s} index={i + 1} />
      ))}
    </OrderList>
  </OrderPage>
);

export default SeasonalSauces;
