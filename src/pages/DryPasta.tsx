import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const DryPasta = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Helper function to parse price string and return a number
  const parsePrice = (priceString: string) => {
    const numericPart = priceString.match(/[\d.]+/);
    return numericPart ? parseFloat(numericPart[0]) : 0;
  };

  const dryPastaVarieties = [
    {
      id: "dp001",
      name: "Spaghetti",
      description: "Long, thin cylindrical pasta. Perfect for classic Italian dishes like Carbonara, Marinara, and Aglio e Olio.",
      price: "₹120 per 500g",
      image: "/lovable-uploads-optimized/drypasta.webp",
      features: ["Traditional Italian", "Versatile", "Quick cooking"]
    },
    {
      id: "dp002",
      name: "Penne",
      description: "Cylindrical pasta with angled ends. Great for chunky sauces and baked pasta dishes.",
      price: "₹130 per 500g",
      image: "/lovable-uploads-optimized/drypasta.webp",
      features: ["Ridged surface", "Sauce-friendly", "Baking perfect"]
    },
    {
      id: "dp003",
      name: "Fusilli",
      description: "Corkscrew-shaped pasta that holds sauces beautifully. Ideal for creamy sauces and pasta salads.",
      price: "₹140 per 500g",
      image: "/lovable-uploads-optimized/drypasta.webp",
      features: ["Spiral shape", "Sauce-trapping", "Salad-friendly"]
    },
    {
      id: "dp004",
      name: "Farfalle",
      description: "Bow-tie shaped pasta. Elegant presentation and perfect for light sauces and cream-based dishes.",
      price: "₹150 per 500g",
      image: "/lovable-uploads-optimized/drypasta.webp",
      features: ["Bow-tie shape", "Elegant", "Light sauces"]
    },
    {
      id: "dp005",
      name: "Rigatoni",
      description: "Large tubular pasta with ridges. Excellent for hearty meat sauces and baked dishes.",
      price: "₹160 per 500g",
      image: "/lovable-uploads-optimized/drypasta.webp",
      features: ["Large tubes", "Hearty sauces", "Baking ideal"]
    },
    {
      id: "dp006",
      name: "Linguine",
      description: "Flat, ribbon-like pasta. Perfect for seafood dishes and light oil-based sauces.",
      price: "₹145 per 500g",
      image: "/lovable-uploads-optimized/drypasta.webp",
      features: ["Flat ribbons", "Seafood pairing", "Light sauces"]
    },
    {
      id: "dp007",
      name: "Orecchiette",
      description: "Small ear-shaped pasta. Traditional from Puglia, great with vegetable sauces and pesto.",
      price: "₹170 per 500g",
      image: "/lovable-uploads-optimized/drypasta.webp",
      features: ["Ear-shaped", "Puglia tradition", "Vegetable-friendly"]
    },
    {
      id: "dp008",
      name: "Conchiglie",
      description: "Shell-shaped pasta. Perfect for capturing chunky sauces and cheese-based dishes.",
      price: "₹155 per 500g",
      image: "/lovable-uploads-optimized/drypasta.webp",
      features: ["Shell shape", "Sauce-capturing", "Cheese-friendly"]
    }
  ];

  const handleAddToCart = (pasta: typeof dryPastaVarieties[0]) => {
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
      
      {/* Hero Section */}
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
              Our <span className="text-orange-600">Dry Pasta</span> Collection
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Premium quality dry pasta made with traditional Italian methods. No preservatives, 3 months shelf life.
            </p>
            <div className="bg-orange-100 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-orange-800 font-semibold">
                🍝 All our dry pasta is made fresh in-house using traditional Italian recipes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pasta Products Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {dryPastaVarieties.map((pasta) => (
              <div key={pasta.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={pasta.image} 
                    alt={pasta.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
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

      {/* Info Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose Our Dry Pasta?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Traditional Recipe</h3>
              <p className="text-gray-600">Made using authentic Italian methods passed down through generations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Ingredients</h3>
              <p className="text-gray-600">Only the finest durum wheat semolina and pure water used</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Preservatives</h3>
              <p className="text-gray-600">100% natural with no artificial additives or preservatives</p>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
};

export default DryPasta; 