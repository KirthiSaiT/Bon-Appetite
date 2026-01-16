import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { fileToDataUrl } from "@/lib/imageUtils";

const DessertPlatters = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const parsePrice = (priceString: string) => {
    const numericPart = priceString.match(/[\d.]+/);
    return numericPart ? parseFloat(numericPart[0]) : 0;
  };

  const [dessertPlatters, setDessertPlatters] = useState([
    { id: "d001", name: "Brownie", description: "Classic chocolate brownie, rich and fudgy.", price: "100", image: "/dessertplatter.webp", features: ["Chocolate", "Classic", "Fudgy"] },
    { id: "d002", name: "Walnut Brownie", description: "Brownie with crunchy walnuts for extra texture.", price: "120", image: "/dessertplatter.webp", features: ["Chocolate", "Walnut", "Crunchy"] },
    { id: "d003", name: "Chocolave cake", description: "Molten chocolate lava cake, gooey center.", price: "90", image: "/dessertplatter.webp", features: ["Molten", "Chocolate", "Warm"] },
    { id: "d004", name: "Ice cream - Vanilla", description: "Classic vanilla ice cream scoop.", price: "40", image: "/dessertplatter.webp", features: ["Ice Cream", "Vanilla", "Chilled"] },
    { id: "d005", name: "Ice cream - Chocolate", description: "Rich chocolate ice cream scoop.", price: "50", image: "/dessertplatter.webp", features: ["Ice Cream", "Chocolate", "Chilled"] },
  ]);

  // Handle image upload for a specific product
  const handleImageUpload = async (productId: string, file: File) => {
    try {
      const imageDataUrl = await fileToDataUrl(file);
      
      // Update the product with the new image
      setDessertPlatters(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, image: imageDataUrl } 
            : product
        )
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Quantity options for desserts (pieces/units)
  const quantityOptions = [
    { value: 1, label: "1 piece" },
    { value: 2, label: "2 pieces" },
    { value: 3, label: "3 pieces" },
    { value: 4, label: "4 pieces" },
    { value: 5, label: "5 pieces" }
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
            {dessertPlatters.map((dessert) => {
              const [selectedQuantity, setSelectedQuantity] = useState(1);
              const currentPrice = (parsePrice(dessert.price) * selectedQuantity).toFixed(2);
              
              return (
                <div key={dessert.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                  <ImageUpload
                    imageUrl={dessert.image}
                    onImageUpload={(file) => handleImageUpload(dessert.id, file)}
                  />
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{dessert.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{dessert.description}</p>
                    
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
                            {option.label} - ₹{(parsePrice(dessert.price) * option.value).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <span className="text-lg font-bold text-orange-600">₹{currentPrice}</span>
                    </div>
                    
                    <button
                      onClick={() => addToCart({
                        id: `${dessert.id}-${selectedQuantity}`,
                        name: `${dessert.name} (${selectedQuantity} piece${selectedQuantity > 1 ? 's' : ''})`,
                        price: parseFloat(currentPrice),
                        image: dessert.image,
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

export default DessertPlatters;