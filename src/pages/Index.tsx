import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Utensils, Users, ShoppingBag, ChefHat, Package } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-orange-600">Bon Appetit Cafe</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your premier cloud kitchen for artisanal, uncooked pasta.
            Experience culinary excellence with every bite you create.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
              Order Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Access Tiles — prominent links to the 3 core sections */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Food & Pre-orders */}
            <Link to="/products" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-8 text-white text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <ShoppingBag className="w-14 h-14 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Food & Pre-orders</h3>
                <p className="text-orange-100 text-sm mb-5">
                  Fresh pasta, cooked meals, sauces & more — order online for delivery.
                </p>
                <span className="inline-block bg-white text-orange-600 font-semibold px-5 py-2 rounded-full text-sm group-hover:bg-orange-50 transition-colors">
                  Order Now →
                </span>
              </div>
            </Link>

            {/* Pasta Workshops */}
            <Link to="/pasta-workshops" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <ChefHat className="w-14 h-14 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Pasta Workshops</h3>
                <p className="text-orange-100 text-sm mb-5">
                  Hands-on online & offline workshops every month. Beginners welcome!
                </p>
                <span className="inline-block bg-white text-orange-600 font-semibold px-5 py-2 rounded-full text-sm group-hover:bg-orange-50 transition-colors">
                  Book a Slot →
                </span>
              </div>
            </Link>

            {/* Our Pasta Brand */}
            <Link to="/our-pasta-brand" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 p-8 text-white text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <Package className="w-14 h-14 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Our Pasta Brand</h3>
                <p className="text-orange-100 text-sm mb-5">
                  Handmade dry pasta — 30+ retail stores across Hyderabad & online.
                </p>
                <span className="inline-block bg-white text-red-600 font-semibold px-5 py-2 rounded-full text-sm group-hover:bg-red-50 transition-colors">
                  Explore Brand →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Utensils className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Artisanal Pasta</h3>
              <p className="text-gray-600">Handcrafted daily with traditional Italian techniques</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Ingredients</h3>
              <p className="text-gray-600">Made with the finest semolina and '00' flour for perfect texture</p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Cook</h3>
              <p className="text-gray-600">Gourmet pasta meals at home, ready in minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pasta Feature Section */}
      <section className="py-12 flex justify-center items-center">
        <img
          src="/home.jpeg"
          alt="Bon Appetit Pasta Feature"
          className="rounded-3xl shadow-2xl w-full max-w-3xl h-auto object-contain"
        />
      </section>

      {/* Products Preview Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Explore Our Products</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From ready-to-cook ingredients to delicious ready-to-eat meals, discover our complete range of culinary offerings.
          </p>
          <Link
            to="/products"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Location</h2>
          <p className="text-gray-600 mb-6">
            8-1-284/OU/461, OU Colony,<br />
            Shaikpet, Hyderabad,<br />
            Telangana 500008
          </p>
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Bon Appetit Location"
              src="https://www.google.com/maps?q=8-1-284/OU/461,OU+Colony,Shaikpet,Hyderabad,Telangana+500008&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
