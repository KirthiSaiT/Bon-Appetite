import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const SeasonalSauces = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const parsePrice = (priceString: string) => {
    const numericPart = priceString.match(/[\d.]+/);
    return numericPart ? parseFloat(numericPart[0]) : 0;
  };

  const seasonalSauces = [
    { id: "s009", name: "Tomato Basil Sauce", description: "Classic Italian sauce made with ripe tomatoes and fresh basil.", price: "--", image: "/lovable-uploads-optimized/seasonal sauces.jpg", features: ["Tomato", "Basil", "Classic"] },
    { id: "s010", name: "Arrabbita", description: "Spicy tomato sauce with garlic and chili, a bold Italian favorite.", price: "--", image: "/lovable-uploads-optimized/seasonal sauces.jpg", features: ["Spicy", "Tomato", "Chili"] },
    { id: "s011", name: "Pesto", description: "Fresh basil pesto with pine nuts, garlic, and parmesan.", price: "--", image: "/lovable-uploads-optimized/seasonal sauces.jpg", features: ["Basil", "Pine nuts", "Parmesan"] },
  ];

  const handleAddToCart = (sauce: typeof seasonalSauces[0]) => {
    addToCart({
      id: sauce.id,
      name: sauce.name,
      price: parsePrice(sauce.price),
      image: sauce.image,
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
              Our <span className="text-orange-600">Seasonal Sauces</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Freshly made sauces to complement your pasta. Pre-order 1-2 days in advance. 1-month shelf life.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seasonalSauces.map((sauce) => (
              <div key={sauce.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={sauce.image} 
                    alt={sauce.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{sauce.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{sauce.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {sauce.features.map((feature, idx) => (
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
                    <span className="text-lg font-bold text-orange-600">{`₹${parsePrice(sauce.price)}`}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(sauce)}
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

export default SeasonalSauces; 