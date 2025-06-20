import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { SimpleFooter } from "@/components/Footer";

const Gallery = () => {
  const galleryItems = [
    {
      id: 1,
      title: "Fresh Pasta",
      image: "/lovable-uploads/bonapp.png",
      category: "Ready to Cook"
    },
    {
      id: 2,
      title: "Gourmet Sandwiches",
      image: "/lovable-uploads/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      category: "Ready to Eat"
    },
    {
      id: 3,
      title: "Fresh Salad Bowls",
      image: "/lovable-uploads/bonapp.png",
      category: "Ready to Eat"
    },
    {
      id: 4,
      title: "Hot Curry Meals",
      image: "/lovable-uploads/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      category: "Ready to Eat"
    },
    {
      id: 5,
      title: "Dessert Platters",
      image: "/lovable-uploads/bonapp.png",
      category: "Ready to Eat"
    },
    {
      id: 6,
      title: "Seasonal Sauces",
      image: "/lovable-uploads/b2b50198-3ee8-4357-b982-4b2765b951c7.png",
      category: "Ready to Cook"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Our <span className="text-orange-600">Gallery</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore our culinary creations and discover the artistry behind every dish we prepare.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-orange-600 font-medium">{item.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <SimpleFooter />
    </div>
  );
};

export default Gallery; 