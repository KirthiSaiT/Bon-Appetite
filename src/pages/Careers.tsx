import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Users, Coffee, MapPin, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const perks = [
  { icon: Heart, title: "Passionate Team", desc: "Work alongside people who genuinely love food and Italian culture." },
  { icon: Sparkles, title: "Creative Freedom", desc: "We encourage new ideas — menu experiments, workshop formats, marketing angles." },
  { icon: Users, title: "Small & Tight-knit", desc: "No bureaucracy. Your contribution directly shapes the brand." },
  { icon: Coffee, title: "Always Fed", desc: "Working at a pasta kitchen has one obvious perk." },
];

const openings = [
  // Keep empty or add real roles — leaving blank shows a friendly message instead
];

const Careers = () => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
    <Navigation />

    {/* Hero */}
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Briefcase className="w-14 h-14 text-orange-600 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Join the <span className="text-orange-600">Bon Appetit</span> Family
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We're a growing artisanal pasta brand based in Hyderabad. If you're passionate about food,
          community, and craftsmanship — we'd love to hear from you.
        </p>
      </div>
    </section>

    {/* Why us */}
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Why Work With Us</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Icon className="w-10 h-10 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Open roles */}
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">Open Positions</h2>
        <p className="text-gray-600 text-center mb-10">Hyderabad, Telangana</p>

        {openings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <span className="text-5xl mb-4 block">🍝</span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No open roles right now</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              We're not hiring at this moment, but we're always happy to hear from passionate people.
              Send us your details and we'll reach out when something opens up.
            </p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
              <Link to="/contact">Send a Speculative Application</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {openings.map((role: { title: string; type: string; location: string; desc: string }) => (
              <Card key={role.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{role.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{role.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        {role.type}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {role.location}
                      </Badge>
                    </div>
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white whitespace-nowrap">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>

    {/* Contact CTA */}
    <section className="py-16 px-4 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Have questions?</h2>
        <p className="text-gray-600 mb-6">
          Reach out via our Contact page and mention "Careers" in your message.
        </p>
        <Button asChild size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>
    </section>

    <SimpleFooter />
  </div>
);

export default Careers;
