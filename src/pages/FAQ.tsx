import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqItems = [
    {
      question: "DO YOU OFFER GLUTEN-FREE OR VEGAN OPTIONS?",
      answer: "Yes! We have a range of vegan pasta varieties in 4 flavors - PLAIN, BEETROOT, SPINACH, PAPRIKA. We don't use Xanthum gum, so our pasta is not gluten-free."
    },
    {
      question: "IS THE PASTA COOKED?",
      answer: "All our pastas are UNCOOKED. Boiled within 10 mins & ready to savour!"
    },
    {
      question: "HOW DO I COOK THE PASTA?",
      answer: "Fresh Pasta - Boil in salted water for 5 minutes, then drain. Dry pasta - Boil for 7-8 mins."
    },
    {
      question: "DO I NEED TO RINSE THE PASTA BEFORE BOILING?",
      answer: "Rinse in cold water for silky-smooth texture but don't let your pasta sit in it for more than 5 mins."
    },
    {
      question: "WHAT MAKES YOUR PASTA SPECIAL?",
      answer: "Our pasta is HANDMADE with fresh, high-quality ingredients. NO preservatives, just authentic flavors."
    },
    {
      question: "HOW DO I STORE THE PASTA?",
      answer: "Fresh Pasta to be consumed within 48 hours, freeze it in 2 hours. Dry Pasta - use it before the expiry date mentioned on the package."
    },
    {
      question: "HOW CAN I PLACE AN ORDER?",
      answer: "Store pickup is available in Hyderabad. For home delivery order via Amazon, Meesho & Flipkart. Delivery charges applicable."
    },
    {
      question: "DO YOU PROVIDE SAUCES?",
      answer: "Yes, we offer fresh, inhouse sauces for PRE-order only."
    },
    {
      question: "HOW DO I PREVENT PASTA FROM STICKING TOGETHER?",
      answer: "Stir the pasta well while boiling, drain it properly, and toss it with a little olive oil or sauce immediately after cooking."
    },
    {
      question: "CAN I CUSTOMIZE MY PASTA ORDER?",
      answer: "Yes, we offer customization for flavors and shapes on all our pre-orders."
    },
    {
      question: "DOES BAC PASTA OFFER NON VEG OPTIONS?",
      answer: "Yes, our classic pasta is made with just semolina and water, while some specialty varieties include eggs & chicken."
    },
    {
      question: "WHAT SAUCES PAIR BEST WITH BAC PASTA?",
      answer: "Light olive oil-based sauces work best for delicate shapes, while rich tomato or creamy sauces complement heartier ones!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Frequently Asked <span className="text-orange-600">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find answers to the most common questions about our services, delivery, and products.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-800">{item.question}</CardTitle>
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                {expandedFAQ === index && (
                  <CardContent className="pt-0">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-8">
            If you couldn't find the answer you're looking for, feel free to reach out to us directly.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Us
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

export default FAQ; 