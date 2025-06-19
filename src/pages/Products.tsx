import Navigation from "@/components/Navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const Products = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const categories = [
    {
      id: "ready-to-cook",
      title: "Ready to Cook",
      subtitle: "Fresh ingredients, pre-prepared",
      image: "/lovable-uploads/bonapp.png",
      subcategories: [
        { name: "Dry Pasta", description: "No preservatives, 3 months shelf life" },
        { name: "Fresh Pasta", description: "Pre-order 1-2 days, 2hrs shelf life" },
        { name: "Seasonal Sauces", description: "Pre-order 1-2 days, 1 month shelf life" }
      ]
    },
    {
      id: "ready-to-eat",
      title: "Ready to Eat",
      subtitle: "Delicious meals, instantly served",
      image: "/lovable-uploads/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      subcategories: [
        { name: "Gourmet Sandwiches", description: "Freshly made daily" },
        { name: "Fresh Salad Bowls", description: "Crisp & healthy options" },
        { name: "Hot Curry Meals", description: "Authentic flavors" },
        { name: "Dessert Platters", description: "Sweet treats" },
        { name: "Cooked Pasta", description: "Pre-order 1-2 days, 2hrs shelf life" }
      ]
    },
    {
      id: "services",
      title: "Our Services",
      subtitle: "Professional catering & workshops",
      image: "/lovable-uploads/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      subcategories: [
        { name: "Catering", description: "Continental food for parties & events up to 250 pax" },
        { name: "Pasta Workshop", description: "Online & offline, weekend & custom slots" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Our <span className="text-orange-600">Products</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover our complete range of culinary offerings, from ready-to-cook ingredients to delicious ready-to-eat meals.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">All Categories</h2>
          
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Category Header */}
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                      <p className="text-gray-600 text-sm">{category.subtitle}</p>
                    </div>
                  </div>
                  {expandedCategory === category.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Subcategories */}
                {expandedCategory === category.id && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-20">
                      {category.subcategories.map((subcategory, index) => (
                        <div key={index} className="text-center">
                          <div className="w-16 h-16 rounded-full bg-orange-100 mx-auto mb-2 flex items-center justify-center">
                            <img 
                              src={category.image} 
                              alt={subcategory.name}
                              className="w-12 h-12 object-cover rounded-full"
                            />
                          </div>
                          <h4 className="text-sm font-medium text-gray-800 mb-1">{subcategory.name}</h4>
                          <p className="text-xs text-gray-500">{subcategory.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Order?</h2>
          <p className="text-gray-600 mb-8">
            Explore our categories and place your order for fresh, delicious meals delivered right to your doorstep.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Order Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Bon Appetit</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Visitors will want to know who is on the other side of the page. Use this space to write about your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">Open Hours</h3>
              <p className="text-gray-300">Fully Online</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <p className="text-gray-300">
                8-1-284/OU/461, OU Colony,<br />
                Shaikpet, Hyderabad,<br />
                Telangana 500008
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Reservation</h3>
              <p className="text-gray-300">Not applicable</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Products; 