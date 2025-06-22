import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Mail, Phone, Home, CheckCircle, MessageSquare } from "lucide-react";
import emailjs from "@emailjs/browser";
import { Label } from "@/components/ui/label";

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '' });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceID = "service_0ngsn9l";
    const templateID = "template_rdzt2i6";
    const publicKey = "lBQ8UpD7SH9b45AVq";

    const cartDetails = cartItems.map(item => `${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join("\n");

    const templateParams = {
      from_name: formData.name,
      to_name: "Bon Appetit Admin",
      message: `New Order Details:
      
      Customer Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone}
      Address: ${formData.address}, ${formData.city}, ${formData.zip}
      
      Order Items:
      ${cartDetails}
      
      Total: ₹${total.toFixed(2)}`,
      reply_to: formData.email
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        setIsOrderPlaced(true);
        clearCart();
      }, (err) => {
        console.log('FAILED...', err);
        alert("Failed to place order. Please try again.");
      });
  };

  if (isOrderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
        <h1 className="text-3xl font-bold mt-4">Thank you for your order!</h1>
        <p className="text-lg mt-2">A confirmation email has been sent.</p>
        <Button onClick={() => navigate('/')} className="mt-6">Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Complete Your Order
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            You're just a few steps away from deliciousness.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping and Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact & Shipping</h2>
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
              <div className="relative">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" type="text" placeholder="Anytown" value={formData.city} onChange={handleChange} required className="pl-10 py-6" />
              </div>
              <div className="relative">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" name="zip" type="text" placeholder="12345" value={formData.zip} onChange={handleChange} required className="pl-10 py-6" />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-5 h-5 w-5 text-gray-400" />
                <Textarea id="query" name="query" placeholder="Any special instructions or queries?" rows={3} className="pl-10 pt-4" />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:opacity-50"
                disabled={cartItems.length === 0}
              >
                Place Order
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Order</h2>
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
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