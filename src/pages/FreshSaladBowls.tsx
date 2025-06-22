import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const FreshSaladBowls = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const parsePrice = (priceString: string) => {
    const numericPart = priceString.match(/[\d.]+/);
    return numericPart ? parseFloat(numericPart[0]) : 0;
  };

  const freshSaladBowls = [
    {
      id: "fsb001",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce, Parmesan cheese, croutons, and Caesar dressing.",
      price: "₹280",
      image: "/lovable-uploads-optimized/fresh salad.jpg",
      features: ["Classic", "Vegetarian", "Creamy dressing"]
    },
    {
      id: "fsb002",
      name: "Greek Salad",
      description: "A mix of cucumbers, tomatoes, olives, onions, and feta cheese with a lemon-herb vinaigrette.",
      price: "₹320",
      image: "/lovable-uploads-optimized/fresh salad.jpg",
      features: ["Refreshing", "Healthy", "Tangy"]
    },
    {
      id: "fsb003",
      name: "Quinoa Salad",
      description: "A nutritious salad with quinoa, mixed greens, chickpeas, and a lemon-tahini dressing.",
      price: "₹350",
      image: "/lovable-uploads-optimized/fresh salad.jpg",
      features: ["Nutrient-rich", "Vegan", "Hearty"]
    },
  ];

  const handleAddToCart = (salad: typeof freshSaladBowls[0]) => {
    addToCart({
      id: salad.id,
      name: salad.name,
      price: parsePrice(salad.price),
      image: salad.image,
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
              Our <span className="text-orange-600">Fresh Salad Bowls</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Crisp and healthy options, made fresh daily.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freshSaladBowls.map((salad) => (
              <div key={salad.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={salad.image} 
                    alt={salad.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{salad.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{salad.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {salad.features.map((feature, idx) => (
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
                    <span className="text-lg font-bold text-orange-600">{`₹${parsePrice(salad.price)}`}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(salad)}
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

export default FreshSaladBowls; 