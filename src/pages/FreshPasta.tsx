import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const FreshPasta = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const parsePrice = (priceString: string) => {
    const numericPart = priceString.match(/[\d.]+/);
    return numericPart ? parseFloat(numericPart[0]) : 0;
  };

  const freshPastaTypes = [
    {
      id: "fp001",
      name: "Tagliatelle",
      description: "Long, flat ribbons of pasta, perfect with rich meat sauces.",
      price: "₹180 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.jpg",
      features: ["Hand-cut", "Rich sauces", "Quick to cook"]
    },
    {
      id: "fp002",
      name: "Ravioli",
      description: "Stuffed pasta with various fillings like spinach and ricotta.",
      price: "₹250 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.jpg",
      features: ["Filled pasta", "Versatile fillings", "Gourmet choice"]
    },
    {
      id: "fp003",
      name: "Gnocchi",
      description: "Soft dough dumplings, typically made from potato.",
      price: "₹220 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.jpg",
      features: ["Pillowy texture", "Hearty", "Butter & sage sauce"]
    },
  ];

  const handleAddToCart = (pasta: typeof freshPastaTypes[0]) => {
    addToCart({
      id: pasta.id,
      name: pasta.name,
      price: parsePrice(pasta.price),
      image: pasta.image,
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
              Our <span className="text-orange-600">Fresh Pasta</span> Selection
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Handmade fresh pasta, crafted daily. Pre-order 1-2 days in advance. 2-hour shelf life.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freshPastaTypes.map((pasta) => (
              <div key={pasta.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={pasta.image} 
                    alt={pasta.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pasta.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{pasta.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pasta.features.map((feature, idx) => (
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
                    <span className="text-lg font-bold text-orange-600">{`₹${parsePrice(pasta.price)}`}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(pasta)}
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

export default FreshPasta; 