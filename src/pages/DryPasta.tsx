import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import React from "react";

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
      id: "dp002",
      name: "Fettucine",
      description: "Flat, thick pasta ribbons ideal for creamy and hearty sauces.",
      price: "₹130 per 500g",
      image: "/assets/drypasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "dp003",
      name: "Farfalle",
      description: "Bow-tie shaped pasta, perfect for light sauces and elegant presentations.",
      price: "₹140 per 500g",
      image: "/assets/drypasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "dp004",
      name: "Spaghetti",
      description: "Long, thin cylindrical pasta, a staple for classic Italian dishes.",
      price: "₹120 per 500g",
      image: "/assets/drypasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "dp005",
      name: "Heart",
      description: "Fun heart-shaped pasta, perfect for special occasions and kids.",
      price: "₹150 per 500g",
      image: "/assets/drypasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "dp006",
      name: "Star",
      description: "Star-shaped pasta, great for soups and adding a playful touch to meals.",
      price: "₹145 per 500g",
      image: "/assets/drypasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "dp007",
      name: "Flower",
      description: "Flower-shaped pasta, brings a decorative and delightful look to your dishes.",
      price: "₹155 per 500g",
      image: "/assets/drypasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    }
  ];

  // Flattened array: each flavor is a separate item
  const dryPastaFlavours = dryPastaVarieties.flatMap((pasta) =>
    pasta.features.map((flavour) => ({
      id: pasta.id + '-' + flavour,
      name: `${pasta.name} ${flavour}`,
      description: pasta.description,
      price: pasta.price,
      image: pasta.image,
      baseId: pasta.id,
      baseName: pasta.name,
      flavour,
    }))
  );

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
            {dryPastaFlavours.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{item.description}</p>
                  <span className="text-lg font-bold text-orange-600 mb-2">{item.price}</span>
                  <button
                    onClick={() => addToCart({
                      id: item.id,
                      name: item.name,
                      price: parsePrice(item.price),
                      image: item.image,
                    })}
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