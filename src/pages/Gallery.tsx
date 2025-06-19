import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

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

export default Gallery; 