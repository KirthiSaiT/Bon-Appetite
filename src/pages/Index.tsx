import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Utensils, Users, ArrowRight } from "lucide-react";
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

      {/* Core Sections — editorial image cards */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                to: "/products",
                image: "/readytoeat.webp",
                badge: "Order Online",
                title: "Food & Pre-orders",
                desc: "Fresh pasta, cooked meals, sauces & more — delivered to your door.",
                cta: "Order Now",
              },
              {
                to: "/pasta-workshops",
                image: "/pastaworkshop.webp",
                badge: "Every Month",
                title: "Pasta Workshops",
                desc: "Hands-on online & offline sessions for all skill levels.",
                cta: "Book a Slot",
              },
              {
                to: "/our-pasta-brand",
                image: "/drypasta.webp",
                badge: "30+ Stores",
                title: "Our Pasta Brand",
                desc: "Handmade dry pasta — 5 flavours, zero preservatives.",
                cta: "Explore Brand",
              },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="group block">
                <div className="relative h-[420px] overflow-hidden rounded-2xl shadow-lg">
                  {/* Food photo */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay — darker at bottom for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow">
                      {item.badge}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                      {item.title}
                    </h3>
                    {/* Description slides up on hover */}
                    <p className="text-white/80 text-sm mb-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 leading-relaxed">
                      {item.desc}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-300">
                      {item.cta}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
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
