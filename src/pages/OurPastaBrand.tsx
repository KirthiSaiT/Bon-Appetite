import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ShoppingBag, Store, Award, Leaf } from "lucide-react";

const products = [
  {
    name: "Fettucine",
    description: "Flat, wide ribbons — perfect with creamy Alfredo or rich Bolognese.",
    flavours: ["Plain", "Spinach", "Paprika", "Beetroot", "Wheat"],
    icon: "🍝",
  },
  {
    name: "Farfalle",
    description: "Bow-tie beauties that hold chunky sauces and look stunning on the plate.",
    flavours: ["Plain", "Spinach", "Paprika", "Beetroot", "Wheat"],
    icon: "🦋",
  },
  {
    name: "Spaghetti",
    description: "The Italian classic — thin, long strands that pair with anything.",
    flavours: ["Plain", "Spinach", "Paprika", "Beetroot", "Wheat"],
    icon: "🍜",
  },
  {
    name: "Heart & Star Shapes",
    description: "Playful shapes for special moments, kids' meals and gifting.",
    flavours: ["Plain", "Spinach", "Paprika", "Beetroot", "Wheat"],
    icon: "⭐",
  },
];

const stores = [
  "Nature's Basket", "Eataly", "Gourmet Garden", "Fresh Mart",
  "Italian Corner", "Pasta Republic", "Food Hall", "Organic World",
];

const highlights = [
  { icon: Award, label: "No Preservatives", desc: "100% clean label — no additives, ever." },
  { icon: Leaf, label: "Natural Colours", desc: "Spinach, beetroot & paprika for vibrant hues." },
  { icon: Store, label: "30+ Retail Stores", desc: "Find us across Hyderabad's premium grocery stores." },
  { icon: ShoppingBag, label: "Online Delivery", desc: "Order on Amazon & Meesho, pan-India shipping." },
];

const OurPastaBrand = () => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
    <Navigation />

    {/* Hero */}
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Our <span className="text-orange-600">Pasta Brand</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Handcrafted in small batches using traditional Italian methods, our dry pasta is made from
          premium durum wheat semolina — zero preservatives, 3-month shelf life.
          Available in five natural colour variants, ready to cook in minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Link to="/dry-pasta">Shop Dry Pasta</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
            <Link to="/products">All Products</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Brand highlights */}
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex flex-col items-center text-center p-6 rounded-xl bg-orange-50">
            <Icon className="w-10 h-10 text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-1">{label}</h3>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Product range */}
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Our Range</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Every shape is available in five flavour variants — pick your favourite or try them all.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Card key={p.name} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <span className="text-5xl mb-4">{p.icon}</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{p.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{p.description}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {p.flavours.map((f) => (
                    <Badge key={f} variant="secondary" className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-100">
                      {f}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white px-8">
            <Link to="/dry-pasta">Browse Full Collection →</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Retail presence */}
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Present in <span className="text-orange-600">30+ Retail Stores</span> across Hyderabad
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Find our pasta at premium grocery stores, gourmet food halls and specialty outlets near you.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {stores.map((s) => (
            <div key={s} className="px-5 py-2 rounded-full border border-orange-200 text-gray-700 text-sm font-medium bg-orange-50">
              {s}
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">Also available online</h3>
        <p className="text-gray-600 mb-6">Order from the comfort of your home, pan-India delivery.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.amazon.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#FF9900] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop on Amazon
          </a>
          <a
            href="https://www.meesho.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#FF3399] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop on Meesho
          </a>
        </div>
      </div>
    </section>

    {/* For stores CTA */}
    <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-500">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Are you a retailer or distributor?</h2>
        <p className="text-orange-100 mb-8 max-w-xl mx-auto">
          We're actively expanding our retail network. Download our catalogue or get in touch with our
          sales team to stock Bon Appetit pasta in your store.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold">
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link to="/products">View Catalogue</Link>
          </Button>
        </div>
      </div>
    </section>

    <SimpleFooter />
  </div>
);

export default OurPastaBrand;
