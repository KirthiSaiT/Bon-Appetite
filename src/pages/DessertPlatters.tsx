/* Hallmark · genre: editorial · macrostructure: Logo Menu · shared system (components/OrderSheet)
 * Quantity is a − / + stepper (type any number up to 99), not fixed 1–5 chips.
 */
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { OrderPage, OrderList, OrderRow, QtyStepper, AddButton } from "@/components/OrderSheet";
import { usePrices } from "@/hooks/use-menu-data";

const desserts = [
  { id: "d001", name: "Brownie", description: "Classic chocolate brownie, rich and fudgy.", price: 100, tint: "var(--flavour-wheat)" },
  { id: "d002", name: "Walnut Brownie", description: "Brownie with crunchy walnuts for extra texture.", price: 120, tint: "var(--flavour-wheat)" },
  { id: "d003", name: "Chocolate Lava Cake", description: "Molten chocolate lava cake, gooey center.", price: 90, tint: "var(--flavour-beetroot)" },
  { id: "d004", name: "Ice cream - Vanilla", description: "Classic vanilla ice cream scoop.", price: 40, tint: "var(--flavour-plain)" },
  { id: "d005", name: "Ice cream - Chocolate", description: "Rich chocolate ice cream scoop.", price: 50, tint: "var(--flavour-wheat)" },
];

const DessertRow = ({ dessert, index }: { dessert: (typeof desserts)[number]; index: number }) => {
  const { addToCart } = useCart();
  const { price: dbPrice } = usePrices();
  const each = dbPrice(`dessert.${dessert.id}`, dessert.price);
  const [qty, setQty] = useState(1);
  const price = each * qty;

  const add = () =>
    addToCart({
      id: `${dessert.id}-${qty}`,
      name: `${dessert.name} (${qty} piece${qty > 1 ? "s" : ""})`,
      price,
      image: "/dessertplatter.webp",
    });

  return (
    <OrderRow
      index={index}
      image={`/menu-photos/desserts/${dessert.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`}
      fallbackImage="/dessertplatter.webp"
      name={dessert.name}
      description={dessert.description}
      tint={dessert.tint}
      price={price}
      priceNote={qty > 1 ? `${qty} × ₹${each}` : `₹${each} each`}
      onAdd={add}
      action={
        <span className="flex items-center gap-2.5">
          <QtyStepper value={qty} onChange={setQty} label={`How many ${dessert.name}`} />
          <AddButton onAdd={add} label="Order" />
        </span>
      }
    />
  );
};

const DessertPlatters = () => (
  <OrderPage
    title="Our"
    accent="Dessert Platters"
    intro="Sweet treats to end your meal on a high note. Pick as many as you like with − and +, or type a number. Planning a party platter? Call us on 93901 05767."
    stamp="/dessertplatter.webp"
  >
    <OrderList>
      {desserts.map((d, i) => (
        <DessertRow key={d.id} dessert={d} index={i + 1} />
      ))}
    </OrderList>
  </OrderPage>
);

export default DessertPlatters;
