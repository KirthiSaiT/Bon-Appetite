import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const DessertPlatters = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const parsePrice = (priceString: string) => {
    const numericPart = priceString.match(/[\d.]+/);
    return numericPart ? parseFloat(numericPart[0]) : 0;
  };

  const dessertPlatters = [
    { id: "d001", name: "Brownie", description: "Classic chocolate brownie, rich and fudgy.", price: "100", image: "/lovable-uploads-optimized/dessert platter.jpg", features: ["Chocolate", "Classic", "Fudgy"] },
    { id: "d002", name: "Walnut Brownie", description: "Brownie with crunchy walnuts for extra texture.", price: "120", image: "/lovable-uploads-optimized/dessert platter.jpg", features: ["Chocolate", "Walnut", "Crunchy"] },
    { id: "d003", name: "Chocolave cake", description: "Molten chocolate lava cake, gooey center.", price: "90", image: "/lovable-uploads-optimized/dessert platter.jpg", features: ["Molten", "Chocolate", "Warm"] },
    { id: "d004", name: "Ice cream - Vanilla", description: "Classic vanilla ice cream scoop.", price: "40", image: "/lovable-uploads-optimized/dessert platter.jpg", features: ["Ice Cream", "Vanilla", "Chilled"] },
    { id: "d005", name: "Ice cream - Chocolate", description: "Rich chocolate ice cream scoop.", price: "50", image: "/lovable-uploads-optimized/dessert platter.jpg", features: ["Ice Cream", "Chocolate", "Chilled"] },
  ];

  const handleAddToCart = (dessert: typeof dessertPlatters[0]) => {
    addToCart({
      id: dessert.id,
      name: dessert.name,
      price: parsePrice(dessert.price),
      image: dessert.image,
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
              Our <span className="text-orange-600">Dessert Platters</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sweet treats to end your meal on a high note.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dessertPlatters.map((dessert) => (
              <div key={dessert.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={dessert.image} 
                    alt={dessert.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{dessert.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{dessert.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {dessert.features.map((feature, idx) => (
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
                    <span className="text-lg font-bold text-orange-600">{`₹${parsePrice(dessert.price)}`}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(dessert)}
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

export default DessertPlatters; 