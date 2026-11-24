/* Checkout: pay for the whole cart with Razorpay.
 * The server prices the cart itself (api/create-cart-order) and verifies the payment (api/verify-cart-payment);
 * the browser never decides the amount. "Order on WhatsApp" stays available as the other way to order. */
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Mail, Phone, Home, CheckCircle, MessageSquare, Loader2, MessageCircle } from "lucide-react";
import {
  PaymentCancelled,
  createCartOrder,
  loadRazorpayScript,
  openCheckout,
  razorpayConfigured,
  verifyCartPayment,
  type CartCustomer,
} from "@/lib/razorpay";
import { orderMessage, whatsappUrl } from "@/lib/whatsapp";

type Paid = { paymentId: string; amount?: number; saved: boolean };

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", city: "", zip: "", query: "" });
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState<Paid | null>(null);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (cartItems.length === 0) {
      setError("Your cart is empty. Add something from Our Products first.");
      return;
    }
    if (!razorpayConfigured) {
      setError("Online payment isn't available right now. Please order on WhatsApp instead.");
      return;
    }

    const customer: CartCustomer = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      zip: formData.zip.trim(),
      notes: formData.query.trim(),
    };
    const lines = cartItems.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }));

    setPaying(true);
    try {
      await loadRazorpayScript();
      const order = await createCartOrder(customer, lines); // the server decides the amount
      const success = await openCheckout({
        order,
        name: "Bon Appetit",
        description: `Order (${cartItems.length} item${cartItems.length === 1 ? "" : "s"})`,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      });
      const result = await verifyCartPayment(success, customer, lines);
      setPaid({ paymentId: success.razorpay_payment_id, amount: result.amount, saved: result.saved });
      if (result.saved) clearCart();
    } catch (err) {
      if (err instanceof PaymentCancelled) setError("Payment was cancelled. You have not been charged.");
      else setError(err instanceof Error ? err.message : "Something went wrong. You have not been charged.");
    } finally {
      setPaying(false);
    }
  };

  if (paid) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center max-w-xl">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          <h1 className="text-3xl font-bold mt-4 font-display">
            {paid.saved ? "Thank you for your order!" : "Payment received"}
          </h1>
          {paid.saved ? (
            <p className="text-lg mt-3 text-stone-700">
              {paid.amount ? `We received ₹${paid.amount.toFixed(2)}. ` : ""}We'll call or message you on {formData.phone} to confirm delivery.
            </p>
          ) : (
            <p className="text-lg mt-3 text-stone-700">
              Your payment went through, but we couldn't record the order automatically. Please message us on WhatsApp with
              the reference below and we'll sort it out right away.
            </p>
          )}
          <p className="mt-4 text-sm text-stone-500">
            Payment reference: <span className="font-mono">{paid.paymentId}</span>
          </p>
          <Button onClick={() => navigate("/")} className="mt-8 bg-orange-600 hover:bg-orange-700 text-white">
            Continue shopping
          </Button>
        </div>
        <SimpleFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-8 md:px-14 py-16">
        <div className="mb-12">
          <h1 className="text-[2.8rem] md:text-[4rem] font-bold text-stone-900 leading-[1.05] font-display">
            Complete Your <span className="text-orange-600">Order.</span>
          </h1>
          <p className="mt-4 text-lg text-stone-600">You're just a few steps away from deliciousness.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping and Contact Form */}
          <div className="bg-white p-8 border border-stone-200">
            <h2 className="text-2xl font-bold text-stone-900 mb-6 font-display">Contact & Shipping</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="name" name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="pl-10 py-6" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="email" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="pl-10 py-6" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="phone" name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="pl-10 py-6" />
              </div>
              <div className="relative">
                <Home className="absolute left-3 top-5 h-5 w-5 text-gray-400" />
                <Textarea id="address" name="address" placeholder="Full Shipping Address" value={formData.address} onChange={handleChange} required rows={3} className="pl-10 pt-4" />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" type="text" placeholder="Hyderabad" value={formData.city} onChange={handleChange} required className="py-6" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">PIN Code</Label>
                  <Input id="zip" name="zip" type="text" inputMode="numeric" placeholder="500008" value={formData.zip} onChange={handleChange} required className="py-6" />
                </div>
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-5 h-5 w-5 text-gray-400" />
                <Textarea id="query" name="query" placeholder="Any special instructions or queries? (optional)" value={formData.query} onChange={handleChange} rows={3} className="pl-10 pt-4" />
              </div>

              {error && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg text-lg disabled:opacity-50"
                disabled={cartItems.length === 0 || paying}
              >
                {paying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Starting payment…
                  </>
                ) : (
                  `Pay ₹${total.toFixed(2)}`
                )}
              </Button>

              {cartItems.length > 0 && (
                <Button asChild variant="outline" className="w-full py-6 text-base">
                  <a href={whatsappUrl(orderMessage(cartItems))} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                    Or order on WhatsApp
                  </a>
                </Button>
              )}
              <p className="text-xs text-stone-500 text-center">Secure payment by Razorpay (UPI, cards, netbanking).</p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 border border-stone-200">
            <h2 className="text-2xl font-bold text-stone-900 mb-6 font-display">Your Order</h2>
            {cartItems.length === 0 ? (
              <p className="text-stone-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 border-t border-gray-200 pt-4 mt-4">
                <p>Total</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default Checkout;
