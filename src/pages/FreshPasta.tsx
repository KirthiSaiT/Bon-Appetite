import React from "react";
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
      name: "Ravioli",
      description: "Stuffed pasta with gourmet fillings.",
      price: "₹250 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.webp",
      features: ["Ricotta Spinach", "Chicken Cheese"]
    },
    {
      id: "fp002",
      name: "Fettucine",
      description: "Flat, thick pasta ribbons ideal for creamy and hearty sauces.",
      price: "₹180 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot"]
    },
    {
      id: "fp003",
      name: "Farfalle",
      description: "Bow-tie shaped pasta, perfect for light sauces and elegant presentations.",
      price: "₹180 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot"]
    },
    {
      id: "fp004",
      name: "Spaghetti",
      description: "Long, thin cylindrical pasta, a staple for classic Italian dishes.",
      price: "₹180 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot"]
    },
    {
      id: "fp005",
      name: "Heart",
      description: "Fun heart-shaped pasta, perfect for special occasions and kids.",
      price: "₹180 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot"]
    },
    {
      id: "fp006",
      name: "Star",
      description: "Star-shaped pasta, great for soups and adding a playful touch to meals.",
      price: "₹180 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot"]
    },
    {
      id: "fp007",
      name: "Flower",
      description: "Flower-shaped pasta, brings a decorative and delightful look to your dishes.",
      price: "₹180 per 250g",
      image: "/lovable-uploads-optimized/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot"]
    }
  ];

  // Dropdown/modal state for type selection
  const [selectedPasta, setSelectedPasta] = React.useState<null | typeof freshPastaTypes[0]>(null);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleAddToCartClick = (pasta: typeof freshPastaTypes[0]) => {
    setSelectedPasta(pasta);
    setSelectedType("");
    setShowDropdown(true);
  };

  const handleTypeSelect = (type: string) => {
    if (selectedPasta) {
      addToCart({
        id: selectedPasta.id + "-" + type,
        name: `${selectedPasta.name} - ${type}`,
        price: parsePrice(selectedPasta.price),
        image: selectedPasta.image,
      });
    }
    setShowDropdown(false);
    setSelectedPasta(null);
    setSelectedType("");
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
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pasta.name}</h3>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {pasta.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{pasta.description}</p>
                  {/* Price removed from here */}
                  <button
                    onClick={() => handleAddToCartClick(pasta)}
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
        {/* Type Dropdown Modal */}
        {showDropdown && selectedPasta && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px]">
              <h3 className="text-lg font-bold mb-4">Select Type for {selectedPasta.name}</h3>
              <div className="flex flex-col gap-2 mb-4">
                {selectedPasta.features.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className="w-full bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDropdown(false)}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
      
      <SimpleFooter />
    </div>
  );
};

export default FreshPasta; 