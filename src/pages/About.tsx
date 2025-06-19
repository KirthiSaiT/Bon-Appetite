import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Heart, Truck } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Quality First",
      description: "We source only the finest ingredients and maintain the highest standards in food preparation."
    },
    {
      icon: Users,
      title: "Customer Focused",
      description: "Your satisfaction is our priority. We listen to feedback and continuously improve our service."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Our team of experienced chefs brings creativity and expertise to every dish we create."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "We ensure your meals reach you fresh and hot with our efficient delivery system."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">About Bon Appetit Cafe</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded with a passion for culinary excellence, we are your trusted cloud kitchen 
            delivering exceptional dining experiences right to your doorstep.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Bon Appetit Cafe was born from a simple idea: to bring restaurant-quality meals 
              to people's homes without compromising on taste, quality, or freshness. Our journey 
              began in 2020 when our founder, a passionate chef with over 15 years of experience, 
              decided to revolutionize the way people enjoy gourmet food.
            </p>
            <p className="text-gray-600 mb-4">
              What started as a small operation has grown into a trusted name in cloud kitchens, 
              serving thousands of satisfied customers across the city. We believe that great food 
              brings people together, and we're committed to making that happen, one meal at a time.
            </p>
            <p className="text-gray-600">
              Today, we continue to innovate and expand our menu, always keeping our customers' 
              preferences and dietary needs at the heart of everything we do.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop" 
              alt="Our kitchen"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <value.icon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              To make exceptional food accessible to everyone by combining traditional cooking 
              techniques with modern technology, ensuring every meal we deliver exceeds expectations 
              and creates memorable dining experiences in the comfort of your home.
            </p>
          </div>
        </div>
      </div>

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

export default About;
