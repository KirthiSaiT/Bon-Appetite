/* Hallmark · macrostructure: Logo Menu · shared system (components/OrderSheet)
 * Each pasta card: price, Order button and a Recipe dropdown. A recipe saved in Admin → Cafe for a pasta
 * with the same name replaces the built-in one below.
 */
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { OrderPage, OrderList, OrderRow, Choice, Recipe, flavourSwatch } from "@/components/OrderSheet";
import { usePrices } from "@/hooks/use-menu-data";
import { lines, useCafePastas } from "@/hooks/use-cafe-data";

const freshPastaTypes = [
  { id: "fp001", name: "Ravioli", description: "Stuffed pasta with gourmet fillings.", features: ["Ricotta Spinach", "Chicken Cheese"] },
  { id: "fp002", name: "Fettucine", description: "Flat, thick ribbons for creamy and hearty sauces.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp003", name: "Farfalle", description: "Bow-ties for light sauces and pretty plates.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp004", name: "Spaghetti", description: "Long, thin strands for the classic Italian dishes.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp005", name: "Heart", description: "Heart-shaped pasta for special occasions and kids.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp006", name: "Star", description: "Little stars for soups and a playful plate.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
  { id: "fp007", name: "Flower", description: "Flower shapes that make any dish look special.", features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"] },
];

const builtInRecipes: Record<string, Recipe> = {
  ravioli: {
    title: "Brown butter & walnuts",
    ingredients: ["250g fresh ravioli", "3 tbsp butter", "30g walnuts, chopped", "1 lemon, zest and juice", "Salt, to taste"],
    steps: [
      "Toast the walnuts in a dry pan for 2 minutes and set aside.",
      "Melt the butter until it foams and smells nutty.",
      "Cook the ravioli in salted water for 5 minutes and drain gently.",
      "Toss in the butter and finish with lemon and walnuts.",
    ],
  },
  fettucine: {
    title: "Tomato & basil pomodoro",
    ingredients: ["250g fresh fettucine", "500g ripe tomatoes, chopped", "3 tbsp olive oil", "1 small onion, finely chopped", "3 garlic cloves, crushed", "10 basil leaves", "Salt, to taste"],
    steps: [
      "Soften the onion in the oil for 5 minutes.",
      "Add the garlic, then the tomatoes and a pinch of salt. Simmer for 15 minutes.",
      "Cook the pasta in salted water for 5 minutes. Drain.",
      "Tear in the basil, toss the pasta through the sauce and serve.",
    ],
  },
  farfalle: {
    title: "Creamy mushroom & peas",
    ingredients: ["250g fresh farfalle", "200g mushrooms, sliced", "1 cup green peas", "150ml cream", "2 garlic cloves, crushed", "1 tbsp butter", "Salt and pepper"],
    steps: [
      "Fry the mushrooms in the butter until golden, then add the garlic.",
      "Add the peas and cream and simmer for 3 minutes.",
      "Cook the pasta in salted water for 4–5 minutes. Drain.",
      "Toss through the sauce, season and serve.",
    ],
  },
  spaghetti: {
    title: "Aglio e olio",
    ingredients: ["250g fresh spaghetti", "4 tbsp olive oil", "5 garlic cloves, thinly sliced", "1 tsp chilli flakes", "2 tbsp parsley or coriander", "Salt, to taste"],
    steps: [
      "Warm the oil and garlic together on low heat until pale gold.",
      "Cook the pasta in salted water for 5 minutes. Save a cup of pasta water.",
      "Add the chilli, pasta and a splash of pasta water to the pan. Toss for a minute.",
      "Scatter over the herbs and serve.",
    ],
  },
  heart: {
    title: "Pink sauce hearts",
    ingredients: ["250g fresh heart pasta", "1 cup tomato puree", "100ml cream", "2 garlic cloves, crushed", "1 tbsp olive oil", "Grated cheese, to serve"],
    steps: [
      "Warm the oil and garlic, then add the tomato puree. Simmer for 8 minutes.",
      "Stir in the cream to turn the sauce pink.",
      "Cook the pasta in salted water for 4 minutes. Drain.",
      "Toss through the sauce and top with cheese.",
    ],
  },
  star: {
    title: "Vegetable star soup",
    ingredients: ["150g fresh star pasta", "1 litre vegetable stock", "1 carrot, diced", "1 small onion, diced", "1 tomato, chopped", "1 tbsp olive oil", "Salt and pepper"],
    steps: [
      "Soften the onion and carrot in the oil for 5 minutes.",
      "Add the tomato and stock and simmer for 10 minutes.",
      "Drop in the stars and cook for 3–4 minutes.",
      "Season and serve hot.",
    ],
  },
  flower: {
    title: "Pesto flowers",
    ingredients: ["250g fresh flower pasta", "4 tbsp basil pesto", "10 cherry tomatoes, halved", "Grated cheese, to serve"],
    steps: [
      "Cook the pasta in salted water for 4–5 minutes. Save a little pasta water.",
      "Loosen the pesto with 2 tbsp pasta water.",
      "Toss the pasta with the pesto and cherry tomatoes.",
      "Finish with grated cheese.",
    ],
  },
};

// "Fettuccine" and "Fettucine" are the same pasta
const key = (name: string) => name.toLowerCase().replace(/[^a-z]/g, "").replace("cc", "c");

// Defaults until the admin's prices load: 25g ₹30, 50g ₹60, 100g ₹100, 250g ₹250
const defaultByWeight: Record<number, number> = { 25: 30, 50: 60, 100: 100, 250: 250 };
const weights = [25, 50, 100, 250];

const PastaRow = ({ pasta, index, recipe }: { pasta: (typeof freshPastaTypes)[number]; index: number; recipe: Recipe | null }) => {
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
      recipe={recipe}
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

const FreshPasta = () => {
  const { data: cafePastas = [] } = useCafePastas();

  const recipeFor = (name: string): Recipe | null => {
    const fromAdmin = cafePastas.find((p) => key(p.name) === key(name));
    if (fromAdmin && (fromAdmin.recipe_ingredients || fromAdmin.recipe_steps)) {
      return {
        title: fromAdmin.recipe_title || `How to cook ${name}`,
        ingredients: lines(fromAdmin.recipe_ingredients),
        steps: lines(fromAdmin.recipe_steps),
      };
    }
    return builtInRecipes[key(name)] ?? null;
  };

  return (
    <OrderPage
      title="Our"
      accent="Fresh Pasta"
      intro="Handmade fresh pasta, rolled daily. Pick a shape, a flavour and a weight, and open the recipe to see how to cook it."
      leadTime="Pre-order 1–2 days ahead"
      shelfLife="2-hour shelf life"
      stamp="/freshpasta.webp"
    >
      <OrderList>
        {freshPastaTypes.map((p, i) => (
          <PastaRow key={p.id} pasta={p} index={i + 1} recipe={recipeFor(p.name)} />
        ))}
      </OrderList>
    </OrderPage>
  );
};

export default FreshPasta;
