// WhatsApp helpers: plain wa.me links, no third-party script.
import type { CartItem } from "@/context/CartContext";

// Bon Appetit's WhatsApp number (confirmed), in international format.
export const WHATSAPP_NUMBER = "919390105767";

export const whatsappUrl = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/** The cart as a ready-to-send WhatsApp order message. */
export const orderMessage = (items: CartItem[]) => {
  const lines = items.map((i, n) => `${n + 1}. ${i.name} x ${i.quantity} = ₹${(i.price * i.quantity).toFixed(2)}`);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return `Hi Bon Appetit! I'd like to place an order:\n\n${lines.join("\n")}\n\nTotal: ₹${total.toFixed(2)}\n\nPlease confirm my order and delivery details.`;
};
