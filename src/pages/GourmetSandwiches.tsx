import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const GourmetSandwiches = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const parsePrice = (priceString: string) => {
    const numericPart = priceString.match(/[\d.]+/);
    return numericPart ? parseFloat(numericPart[0]) : 0;
  };

  const gourmetSandwiches = [
    {
      id: "gs001",
      name: "Classic Club",
      description: "A delicious sandwich with layers of turkey, bacon, lettuce, tomato, and mayonnaise.",
      price: "₹350",
      image: "/lovable-uploads-optimized/gourmet sandwich.jpg",
      features: ["Hearty", "Classic", "Triple-decker"]
    },
    {
      id: "gs002",
      name: "Caprese",
      description: "A simple yet elegant sandwich with fresh mozzarella, tomatoes, basil, and a balsamic glaze.",
      price: "₹300",
      image: "/lovable-uploads-optimized/gourmet sandwich.jpg",
      features: ["Vegetarian", "Fresh", "Italian"]
    },
    {
      id: "gs003",
      name: "Spicy Chicken",
      description: "A fiery sandwich with spicy grilled chicken, jalapeños, and a cooling yogurt sauce.",
      price: "₹380",
      image: "/lovable-uploads-optimized/gourmet sandwich.jpg",
      features: ["Spicy", "Grilled", "Flavorful"]
    },
  ];

  const handleAddToCart = (sandwich: typeof gourmetSandwiches[0]) => {
    addToCart({
      id: sandwich.id,
      name: sandwich.name,
      price: parsePrice(sandwich.price),
      image: sandwich.image,
    });
  };

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
              Freshly made daily with premium ingredients.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gourmetSandwiches.map((sandwich) => (
              <div key={sandwich.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={sandwich.image} 
                    alt={sandwich.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{sandwich.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{sandwich.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {sandwich.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <span className="text-lg font-bold text-orange-600">{`₹${parsePrice(sandwich.price)}`}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(sandwich)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
};

export default GourmetSandwiches; 