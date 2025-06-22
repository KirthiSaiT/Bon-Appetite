import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Mail, Phone, Home, CheckCircle, MessageSquare } from "lucide-react";

const Checkout = () => {
  const { cartItems, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const phone = form.elements.namedItem('phone') as HTMLInputElement;
    const address = form.elements.namedItem('address') as HTMLTextAreaElement;

    if (!name.value || !email.value || !phone.value || !address.value) {
      alert("Please fill out all required fields.");
      return;
    }
    
    setIsOrderPlaced(true);
    clearCart();
  };
  
  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>
          <p className="text-gray-600 text-lg mb-8">Your order has been placed successfully.</p>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Continue Shopping
          </Button>
        </div>
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
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="name" name="name" type="text" placeholder="Full Name" required className="pl-10 py-6" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="email" name="email" type="email" placeholder="Email Address" required className="pl-10 py-6" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="phone" name="phone" type="tel" placeholder="Phone Number" required className="pl-10 py-6" />
              </div>
              <div className="relative">
                 <Home className="absolute left-3 top-5 h-5 w-5 text-gray-400" />
                <Textarea id="address" name="address" placeholder="Full Shipping Address" required rows={3} className="pl-10 pt-4" />
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