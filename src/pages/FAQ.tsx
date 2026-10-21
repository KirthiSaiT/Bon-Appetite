/* Hallmark · genre: editorial · shared design system */
import Navigation from "@/components/Navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SimpleFooter } from "@/components/Footer";
import { Link } from "react-router-dom";

const faqItems = [
  {
    question: "Do you offer gluten-free or vegan options?",
    answer: "Yes! We have a range of vegan pasta varieties in 4 flavors — Plain, Beetroot, Spinach, Paprika. We don't use Xanthum gum, so our pasta is not gluten-free.",
  },
  {
    question: "Is the pasta cooked?",
    answer: "All our pastas are uncooked. Boiled within 10 mins & ready to savour!",
  },
  {
    question: "How do I cook the pasta?",
    answer: "Fresh Pasta — boil in salted water for 5 minutes, then drain. Dry pasta — boil for 7–8 mins.",
  },
  {
    question: "Do I need to rinse the pasta before boiling?",
    answer: "Rinse in cold water for silky-smooth texture but don't let your pasta sit in it for more than 5 mins.",
  },
  {
    question: "What makes your pasta special?",
    answer: "Our pasta is handmade with fresh, high-quality ingredients. No preservatives — just authentic flavours.",
  },
  {
    question: "How do I store the pasta?",
    answer: "Fresh Pasta to be consumed within 48 hours; freeze it within 2 hours. Dry Pasta — use before the expiry date on the package.",
  },
  {
    question: "How can I place an order?",
    answer: "Store pickup is available in Hyderabad. For home delivery order via Amazon, Meesho & Flipkart. Delivery charges applicable.",
  },
  {
    question: "Do you provide sauces?",
    answer: "Yes, we offer fresh, in-house sauces for pre-order only.",
  },
  {
    question: "How do I prevent pasta from sticking together?",
    answer: "Stir the pasta well while boiling, drain it properly, and toss it with a little olive oil or sauce immediately after cooking.",
  },
  {
    question: "Can I customise my pasta order?",
    answer: "Yes, we offer customisation for flavours and shapes on all our pre-orders.",
  },
  {
    question: "Does Bon Appetit offer non-veg options?",
    answer: "Yes, our classic pasta is made with just semolina and water, while some specialty varieties include eggs & chicken.",
  },
  {
    question: "What sauces pair best with Bon Appetit pasta?",
    answer: "Light olive oil-based sauces work best for delicate shapes, while rich tomato or creamy sauces complement heartier ones.",
  },
];

const FAQ = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Page hero ── */}
      <section className="px-8 md:px-14 xl:px-20 pt-16 pb-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold mb-6 block">
            Help & Info
          </span>
          <h1
            className="text-[2.8rem] md:text-[4rem] xl:text-[5rem] font-bold leading-[1.05] text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently Asked <span className="text-orange-600">Questions.</span>
          </h1>
          <div className="w-10 h-px bg-orange-600 mb-6" />
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl">
            Find answers to the most common questions about our pasta, orders, and delivery.
          </p>
        </div>
      </section>

      <div className="h-px bg-stone-200" />

      {/* ── FAQ List ── */}
      <section className="py-14 px-8 md:px-14 xl:px-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="divide-y divide-stone-200">
            {faqItems.map((item, index) => (
              <div key={index}>
                <button
                  className="w-full text-left py-6 flex items-start justify-between gap-6 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600 rounded-sm"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <span
                    className="text-stone-900 font-bold text-base group-hover:text-orange-600 transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.question}
                  </span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5 group-hover:text-orange-600 transition-colors" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="pb-6 -mt-2">
                    <p className="text-stone-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Still have questions CTA ── */}
      <section className="py-16 px-8 md:px-14 bg-stone-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-stone-900 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Still have questions?
            </h2>
            <p className="text-stone-600 text-sm">
              Reach out directly — we usually respond within a few hours.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
};

export default FAQ;
