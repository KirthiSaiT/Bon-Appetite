import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Heart, Truck, Leaf, Star } from "lucide-react";
import { SimpleFooter } from "@/components/Footer";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "We honor traditional Italian techniques, ensuring every dish reflects genuine Italian heritage and craftsmanship."
    },
    {
      icon: Star,
      title: "Passion",
      description: "Our love for Italian cuisine drives us to perfect every recipe and create memorable dining experiences."
    },
    {
      icon: Users,
      title: "Community",
      description: "We bring people together through the universal language of exceptional food and warm hospitality."
    },
    {
      icon: Award,
      title: "Quality",
      description: "Only the finest semolina, farm-fresh eggs, and all-natural ingredients make it into our handcrafted pasta."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We're committed to eco-friendly practices and responsible sourcing for a better tomorrow."
    },
    {
      icon: Truck,
      title: "Exceptional Service",
      description: "From kitchen to your table, we ensure every step of your experience exceeds expectations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">BON APPETIT CAFE</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Experience the richness of handcrafted pasta made using traditional Italian techniques, 
            ensuring every bite is pure perfection. Where the rich flavors of Italy come to life.
          </p>
        </div>

        {/* About Us Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="bg-amber-100 rounded-lg p-2 inline-block mb-6">
              <h2 className="text-2xl font-bold text-amber-800 px-4 py-2">ABOUT US</h2>
            </div>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Our passion for authentic handmade pasta drives us to create a dining experience 
              that transports you straight to the heart of Italy. We use only the finest semolina, 
              farm-fresh eggs, and all-natural ingredients to craft pasta that is wholesome and flavorful.
            </p>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Founded with a commitment to culinary excellence, we are your trusted cloud kitchen 
              delivering exceptional Italian dining experiences right to your doorstep. What started 
              as a passion project has grown into a beloved destination for pasta lovers across the city.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Every dish we create honors traditional Italian techniques while embracing modern 
              convenience, ensuring that authentic Italian flavors are always within reach.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/lovable-uploads-optimized/2.png" 
              alt="About Us - Bon Appetit Cafe"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="bg-green-100 rounded-lg p-2 inline-block mb-4">
              <h2 className="text-2xl font-bold text-green-800 px-4 py-2">OUR VALUES</h2>
            </div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              We value authenticity, passion, community, quality, and sustainability, bringing you 
              genuine flavors with dedication, eco-friendly practices, and exceptional service.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <value.icon className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-gray-800">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              To make exceptional Italian cuisine accessible to everyone by combining traditional cooking 
              techniques with modern technology, ensuring every meal we deliver exceeds expectations 
              and creates memorable dining experiences in the comfort of your home.
            </p>
          </div>
        </div>

        {/* Bottom Image */}
        <div className="mb-16 rounded-lg overflow-hidden shadow-lg">
          <img 
            src="/lovable-uploads-optimized/5.png" 
            alt="Bon Appetit Cafe - Italian Pasta" 
            className="w-full h-[80vh] object-cover" 
          />
        </div>
      </div>

      <SimpleFooter />
    </div>
  );
};

export default About;