/* Floating WhatsApp button, bottom-right on every page.
 * With items in the cart it becomes "Order on WhatsApp" and sends the whole order;
 * otherwise it opens a chat with a page-aware message (workshops, ordering, a question).
 * A plain wa.me link: no third-party plugin, nothing loads until it is tapped. */
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { orderMessage, whatsappUrl } from "@/lib/whatsapp";

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
  const { cartItems, cartCount } = useCart();
  if (pathname.startsWith("/admin")) return null;

  const hasOrder = cartItems.length > 0;
  const href = whatsappUrl(hasOrder ? orderMessage(cartItems) : messageFor(pathname));
  const label = hasOrder ? "Order on WhatsApp" : "Chat on WhatsApp";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={hasOrder ? `Order ${cartCount} item${cartCount === 1 ? "" : "s"} on WhatsApp` : "Chat with us on WhatsApp"}
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--whatsapp)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:brightness-95 active:translate-y-px motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--whatsapp)]"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className={hasOrder ? "" : "hidden sm:inline"}>{label}</span>
    </a>
  );
};

export default WhatsAppButton;
