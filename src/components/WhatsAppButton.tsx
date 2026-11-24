/* Floating "Chat on WhatsApp" button on every page.
 * A plain wa.me link (no third-party plugin, nothing loads until it is tapped).
 * The pre-filled message depends on the page: workshops, ordering food, or a general question. */
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";

// Bon Appetit's number (the one shown in the footer and on the Contact page), in international format.
export const WHATSAPP_NUMBER = "919390105767";

const orderPages = [
  "/cafe", "/products", "/cooked-pasta", "/fresh-pasta", "/dry-pasta", "/our-pasta-brand",
  "/dessert-platters", "/gourmet-sandwiches", "/fresh-salad-bowls", "/hot-curry-meals", "/seasonal-sauces", "/checkout",
];

const messageFor = (path: string) => {
  if (path.startsWith("/pasta-workshops")) return "Hi Bon Appetit! I'd like to know about your pasta workshops.";
  if (orderPages.includes(path)) return "Hi Bon Appetit! I'd like to place an order.";
  return "Hi Bon Appetit! I have a question.";
};

const WhatsAppButton = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageFor(pathname))}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--whatsapp)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:brightness-95 active:translate-y-px motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--whatsapp)]"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
