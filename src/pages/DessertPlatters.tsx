import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart, X, User, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { SimpleFooter } from "@/components/Footer";

const DessertPlatters = () => {
  const navigate = useNavigate();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedDessert, setSelectedDessert] = useState<{name: string, description: string, price: string, image: string} | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    email: '',
    phone: '',
    name: '',
    specialInstructions: ''
  });

  const handleOrderClick = (dessert: {name: string, description: string, price: string, image: string}) => {
    setSelectedDessert(dessert);
    setShowOrderModal(true);
    setOrderForm({
      quantity: 1,
      email: '',
      phone: '',
      name: '',
      specialInstructions: ''
    });
  };

  const handleFormChange = (field: string, value: string | number) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitOrder = () => {
    if (!orderForm.name || !orderForm.email || !orderForm.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    const templateParams = {
      from_name: orderForm.name,
      to_name: "Bon Appetite",
      message: `
        You have a new dessert platter order!
        Product: ${selectedDessert?.name}
        Price: ${selectedDessert?.price}
        Quantity: ${orderForm.quantity}
        Description: ${selectedDessert?.description}
        Special Instructions: ${orderForm.specialInstructions}
        ---
        Contact Details:
        Name: ${orderForm.name}
        Email: ${orderForm.email}
        Phone: ${orderForm.phone}
      `,
      user_email: orderForm.email
    };

    emailjs.send('service_0ngsn9l', 'template_rdzt2i6', templateParams, 'lBQ8UpD7SH9b45AVq')
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
         setShowOrderModal(false);
         setShowThankYou(true);
         setTimeout(() => setShowThankYou(false), 4000);
      }, (err) => {
         console.log('FAILED...', err);
         alert('Failed to send order. Please try again.');
      });
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedDessert(null);
  };

  const dessertPlatters = [
    {
      name: "Chocolate Lava Cake",
      description: "A rich chocolate cake with a molten chocolate center, served with vanilla ice cream.",
      price: "₹250",
      image: "/lovable-uploads/dessert platter.jpg",
      features: ["Decadent", "Warm", "Indulgent"]
    },
    {
      name: "Tiramisu",
      description: "A classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cheese.",
      price: "₹300",
      image: "/lovable-uploads/dessert platter.jpg",
      features: ["Classic Italian", "Creamy", "Coffee-infused"]
    },
    {
      name: "Cheesecake",
      description: "A creamy New York-style cheesecake with a graham cracker crust and a berry compote.",
      price: "₹280",
      image: "/lovable-uploads/dessert platter.jpg",
      features: ["Creamy", "Rich", "Tangy"]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Products
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Our <span className="text-orange-600">Dessert Platters</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sweet treats to end your meal on a high note.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dessertPlatters.map((dessert, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={dessert.image} 
                    alt={dessert.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{dessert.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{dessert.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {dessert.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-orange-600">{dessert.price}</span>
                  </div>
                  
                  <button
                    onClick={() => handleOrderClick(dessert)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showOrderModal && selectedDessert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Order a Dessert</h3>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-orange-800 mb-1">{selectedDessert.name}</h4>
                <p className="text-sm text-orange-700">{selectedDessert.price}</p>
                <p className="text-xs text-orange-600 mt-1">{selectedDessert.description}</p>
              </div>

              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    value={orderForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    value={orderForm.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    value={orderForm.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    value={orderForm.quantity}
                    onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 1)}
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your dessert order! We'll contact you soon.
            </p>
          </div>
        </div>
      )}

      <SimpleFooter />
    </div>
  );
};

export default DessertPlatters; 