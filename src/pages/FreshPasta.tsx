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
      image: "/assets/fresh pasta.webp",
      features: ["Ricotta Spinach", "Chicken Cheese"]
    },
    {
      id: "fp002",
      name: "Fettucine",
      description: "Flat, thick pasta ribbons ideal for creamy and hearty sauces.",
      price: "₹180 per 250g",
      image: "/assets/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "fp003",
      name: "Farfalle",
      description: "Bow-tie shaped pasta, perfect for light sauces and elegant presentations.",
      price: "₹180 per 250g",
      image: "/assets/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "fp004",
      name: "Spaghetti",
      description: "Long, thin cylindrical pasta, a staple for classic Italian dishes.",
      price: "₹180 per 250g",
      image: "/assets/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "fp005",
      name: "Heart",
      description: "Fun heart-shaped pasta, perfect for special occasions and kids.",
      price: "₹180 per 250g",
      image: "/assets/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "fp006",
      name: "Star",
      description: "Star-shaped pasta, great for soups and adding a playful touch to meals.",
      price: "₹180 per 250g",
      image: "/assets/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    },
    {
      id: "fp007",
      name: "Flower",
      description: "Flower-shaped pasta, brings a decorative and delightful look to your dishes.",
      price: "₹180 per 250g",
      image: "/assets/fresh pasta.webp",
      features: ["Plain", "Paprika", "Spinach", "Beetroot", "Wheat"]
    }
  ];

  // Flattened array: each flavor is a separate item
  const freshPastaFlavours = freshPastaTypes.flatMap((pasta) =>
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
            {freshPastaFlavours.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
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
      
      <SimpleFooter />
    </div>
  );
};

export default FreshPasta; 