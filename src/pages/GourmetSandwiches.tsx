import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const GourmetSandwiches = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const parsePrice = (priceString: string) => {
    const numericPart = priceString.match(/[\d.]+/);
    return numericPart ? parseFloat(numericPart[0]) : 0;
  };

  const gourmetSandwiches = [
    { id: "gs001", name: "Mustard Egg", description: "Egg sandwich with a tangy mustard twist.", price: "₹120", image: "/assets/gourmet sandwich.webp", features: ["Egg", "Tangy", "Protein-rich"] },
    { id: "gs002", name: "Veg", description: "Classic vegetarian sandwich with fresh veggies.", price: "₹100", image: "/assets/gourmet sandwich.webp", features: ["Vegetarian", "Fresh", "Healthy"] },
    { id: "gs003", name: "Club", description: "Triple-layered club sandwich with assorted fillings.", price: "₹150", image: "/assets/gourmet sandwich.webp", features: ["Hearty", "Layered", "Classic"] },
    { id: "gs004", name: "Coleslaw", description: "Creamy coleslaw sandwich, perfect for a light bite.", price: "₹110", image: "/assets/gourmet sandwich.webp", features: ["Creamy", "Vegetarian", "Light"] },
    { id: "gs005", name: "Chicken Tikka", description: "Spicy chicken tikka in a soft sandwich.", price: "₹140", image: "/assets/gourmet sandwich.webp", features: ["Spicy", "Chicken", "Indian"] },
    { id: "gs006", name: "Paneer Tikka", description: "Paneer tikka sandwich with Indian spices.", price: "₹130", image: "/assets/gourmet sandwich.webp", features: ["Paneer", "Spicy", "Vegetarian"] },
    { id: "gs007", name: "Chicken Coleslaw", description: "Chicken and creamy coleslaw in every bite.", price: "₹135", image: "/assets/gourmet sandwich.webp", features: ["Chicken", "Creamy", "Fusion"] },
    { id: "gs008", name: "Mustard honey chicken", description: "Chicken sandwich with mustard and honey glaze.", price: "₹145", image: "/assets/gourmet sandwich.webp", features: ["Chicken", "Sweet & Tangy", "Signature"] },
    { id: "gs009", name: "Nutella sandwich", description: "Sweet sandwich with rich Nutella spread.", price: "₹90", image: "/assets/gourmet sandwich.webp", features: ["Sweet", "Nutella", "Kids' favorite"] },
    { id: "gs010", name: "MMM Sandwich", description: "Our special MMM sandwich - a must try!", price: "₹160", image: "/assets/gourmet sandwich.webp", features: ["Special", "Chef's Choice", "Unique"] },
  ];

  // Quantity options for sandwiches
  const quantityOptions = [
    { value: 1, label: "1 sandwich" },
    { value: 2, label: "2 sandwiches" },
    { value: 3, label: "3 sandwiches" },
    { value: 4, label: "4 sandwiches" },
    { value: 5, label: "5 sandwiches" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Products
          </button>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Our <span className="text-orange-600">Gourmet Sandwiches</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Freshly made daily with premium ingredients. Find your favorite from our delicious sandwich menu!
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gourmetSandwiches.map((sandwich) => {
              const [selectedQuantity, setSelectedQuantity] = useState(1);
              const currentPrice = (parsePrice(sandwich.price) * selectedQuantity).toFixed(2);
              
              return (
                <div key={sandwich.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                  <div className="h-48 bg-orange-100 flex items-center justify-center">
                    <img 
                      src={sandwich.image} 
                      alt={sandwich.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{sandwich.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{sandwich.description}</p>
                    
                    {/* Quantity Selector */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Quantity</label>
                      <select 
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {quantityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label} - ₹{(parsePrice(sandwich.price) * option.value).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <span className="text-lg font-bold text-orange-600">₹{currentPrice}</span>
                    </div>
                    <button
                      onClick={() => addToCart({
                        id: `${sandwich.id}-${selectedQuantity}`,
                        name: `${sandwich.name} (${selectedQuantity} sandwich${selectedQuantity > 1 ? 'es' : ''})`,
                        price: parseFloat(currentPrice),
                        image: sandwich.image,
                      })}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <SimpleFooter />
    </div>
  );
};

export default GourmetSandwiches;