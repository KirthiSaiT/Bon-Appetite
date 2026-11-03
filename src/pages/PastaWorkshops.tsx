import { useState } from "react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { CalendarDays, MapPin, Users, Clock, CheckCircle, Building2, Loader2 } from "lucide-react";
import WorkshopBookingModal from "@/components/WorkshopBookingModal";
import { useWorkshops, parseDay } from "@/hooks/use-menu-data";

const includes = [
  "Learn 2 pastas from scratch — Fettucine & Farfalle (serves 4)",
  "No fancy equipment needed — just your kitchen",
  "Additional Italian sauce making",
  "Tricks for silky-smooth pasta every time",
  "Simple ingredients & common kitchen tools",
  "Interactive Q & A session",
  "Attend from anywhere in the world",
];

const PastaWorkshops = () => {
  const { data: upcomingWorkshops = [], isLoading } = useWorkshops();
  const [booking, setBooking] = useState<{ open: boolean; id?: string }>({ open: false });
  const openBooking = (id?: string) => setBooking({ open: true, id });

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Hero ── */}
      <section className="px-8 md:px-14 xl:px-20 pt-16 pb-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold mb-6 block">
                Online & Offline · Every Month
              </span>
              <h1
                className="text-[2.8rem] md:text-[4rem] font-bold leading-[1.05] text-stone-900 mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Pasta <span className="text-orange-600">Workshops.</span>
              </h1>
              <div className="w-10 h-px bg-orange-600 mb-6" />
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                Discover the joy of making pasta entirely from scratch. Our workshops are designed
                for complete beginners — no culinary experience required. Just bring your curiosity
                and we'll handle the rest.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => openBooking()}
                >
                  Book a Workshop
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                  onClick={() => document.getElementById("corporate")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Corporate Enquiry
                </Button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/pastaworkshop.webp"
                alt="Pasta Workshop"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-14 px-8 md:px-14 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-stone-900 mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What's Included
          </h2>
          <p className="text-stone-600 mb-10">Everything you need for a great pasta-making session.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {includes.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center bg-red-50 rounded-xl p-4">
            <p className="text-red-600 font-semibold text-sm">
              Payment is non-refundable. Limited slots available every month.
            </p>
          </div>
        </div>
      </section>

      {/* Happening Now */}
      <section className="py-14 px-8 md:px-14 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-stone-900 mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Happening Now
          </h2>
          <p className="text-stone-600 mb-10">Upcoming workshops — grab your spot before they fill up.</p>
          {isLoading && (
            <p className="flex items-center gap-2 text-stone-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading workshops…</p>
          )}
          {!isLoading && upcomingWorkshops.length === 0 && (
            <p className="text-stone-600">No workshops are scheduled right now — new dates are announced every month.</p>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            {upcomingWorkshops.map((ws) => (
              <Card key={ws.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img src={ws.image} alt={ws.title} className="w-full h-full object-cover" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg text-gray-800">{ws.title}</CardTitle>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 whitespace-nowrap">
                      {ws.tag}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-orange-500" />
                      <span>{format(parseDay(ws.workshop_date), "EEEE, d MMMM yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{ws.time_label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{ws.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>{ws.seats ? `${ws.seats} seats` : "Limited slots"}</span>
                    </div>
                  </div>
                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">₹{ws.price}</span>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => openBooking(ws.id)}
                    >
                      Book Now
                    </Button>
                  </div>
                  <p className="text-xs text-orange-700 font-semibold mt-2 text-center">
                    Early bird offer — hurry!
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate section */}
      <section id="corporate" className="py-14 px-8 md:px-14 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-stone-200 p-10">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <Building2 className="w-16 h-16 text-orange-600 flex-shrink-0 mx-auto md:mx-0" />
              <div className="flex-1 text-center md:text-left">
                <h2
                  className="text-3xl font-bold text-stone-900 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >For Corporates</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Looking for a unique team-building experience? Our corporate pasta workshops are
                  a fun, hands-on way for your team to bond over food. We offer customised sessions
                  for groups of any size — online or at your office premises.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => openBooking()}
                  >
                    Book Now
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    <a href="/contact">Contact Us</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WorkshopBookingModal
        open={booking.open}
        workshopId={booking.id}
        onClose={() => setBooking({ open: false })}
      />

      <SimpleFooter />
    </div>
  );
};

export default PastaWorkshops;
