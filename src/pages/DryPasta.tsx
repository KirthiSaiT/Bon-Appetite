import Navigation from "@/components/Navigation";
import { ChevronLeft, ShoppingCart, X, User, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { SimpleFooter } from "@/components/Footer";

const DryPasta = () => {
  const navigate = useNavigate();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPasta, setSelectedPasta] = useState<{name: string, description: string, price: string, image: string} | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    email: '',
    phone: '',
    name: '',
    specialInstructions: ''
  });

  const handleOrderClick = (pasta: {name: string, description: string, price: string, image: string}) => {
    setSelectedPasta(pasta);
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
        You have a new dry pasta order!
        Product: ${selectedPasta?.name}
        Price: ${selectedPasta?.price}
        Quantity: ${orderForm.quantity}
        Description: ${selectedPasta?.description}
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
    setSelectedPasta(null);
  };

  const dryPastaTypes = [
    {
      name: "Spaghetti",
      description: "Long, thin cylindrical pasta. Perfect for classic Italian dishes like Carbonara, Marinara, and Aglio e Olio.",
      price: "₹120 per 500g",
      image: "/lovable-uploads/drypasta.jpg",
      features: ["Traditional Italian", "Versatile", "Quick cooking"]
    },
    {
      name: "Penne",
      description: "Cylindrical pasta with angled ends. Great for chunky sauces and baked pasta dishes.",
      price: "₹130 per 500g",
      image: "/lovable-uploads/drypasta.jpg",
      features: ["Ridged surface", "Sauce-friendly", "Baking perfect"]
    },
    {
      name: "Fusilli",
      description: "Corkscrew-shaped pasta that holds sauces beautifully. Ideal for creamy sauces and pasta salads.",
      price: "₹140 per 500g",
      image: "/lovable-uploads/drypasta.jpg",
      features: ["Spiral shape", "Sauce-trapping", "Salad-friendly"]
    },
    {
      name: "Farfalle",
      description: "Bow-tie shaped pasta. Elegant presentation and perfect for light sauces and cream-based dishes.",
      price: "₹150 per 500g",
      image: "/lovable-uploads/drypasta.jpg",
      features: ["Bow-tie shape", "Elegant", "Light sauces"]
    },
    {
      name: "Rigatoni",
      description: "Large tubular pasta with ridges. Excellent for hearty meat sauces and baked dishes.",
      price: "₹160 per 500g",
      image: "/lovable-uploads/drypasta.jpg",
      features: ["Large tubes", "Hearty sauces", "Baking ideal"]
    },
    {
      name: "Linguine",
      description: "Flat, ribbon-like pasta. Perfect for seafood dishes and light oil-based sauces.",
      price: "₹145 per 500g",
      image: "/lovable-uploads/drypasta.jpg",
      features: ["Flat ribbons", "Seafood pairing", "Light sauces"]
    },
    {
      name: "Orecchiette",
      description: "Small ear-shaped pasta. Traditional from Puglia, great with vegetable sauces and pesto.",
      price: "₹170 per 500g",
      image: "/lovable-uploads/drypasta.jpg",
      features: ["Ear-shaped", "Puglia tradition", "Vegetable-friendly"]
    },
    {
      name: "Conchiglie",
      description: "Shell-shaped pasta. Perfect for capturing chunky sauces and cheese-based dishes.",
      price: "₹155 per 500g",
      image: "/lovable-uploads/drypasta.jpg",
      features: ["Shell shape", "Sauce-capturing", "Cheese-friendly"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      {/* Hero Section */}
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
              Our <span className="text-orange-600">Dry Pasta</span> Collection
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Premium quality dry pasta made with traditional Italian methods. No preservatives, 3 months shelf life.
            </p>
            <div className="bg-orange-100 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-orange-800 font-semibold">
                🍝 All our dry pasta is made fresh in-house using traditional Italian recipes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pasta Products Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {dryPastaTypes.map((pasta, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={pasta.image} 
                    alt={pasta.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pasta.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{pasta.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pasta.features.map((feature, idx) => (
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
                    <span className="text-lg font-bold text-orange-600">{pasta.price}</span>
                  </div>
                  
                  <button
                    onClick={() => handleOrderClick(pasta)}
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

      {/* Order Modal */}
      {showOrderModal && selectedPasta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close order modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-orange-800 mb-1">{selectedPasta.name}</h4>
                <p className="text-sm text-orange-700">{selectedPasta.price}</p>
                <p className="text-xs text-orange-600 mt-1">{selectedPasta.description}</p>
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
                    placeholder="Enter your full name"
                    value={orderForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
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
                    placeholder="Enter your email"
                    value={orderForm.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
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
                    placeholder="Enter your phone number"
                    value={orderForm.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
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
                    placeholder="Enter quantity"
                    value={orderForm.quantity}
                    onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 1)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                    placeholder="Any special requests or dietary requirements..."
                    value={orderForm.specialInstructions}
                    onChange={(e) => handleFormChange('specialInstructions', e.target.value)}
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

      {/* Thank You Message */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for ordering our dry pasta! We'll contact you soon with order confirmation.
            </p>
            <div className="text-sm text-gray-500">
              This message will close automatically...
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose Our Dry Pasta?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Traditional Recipe</h3>
              <p className="text-gray-600">Made using authentic Italian methods passed down through generations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Ingredients</h3>
              <p className="text-gray-600">Only the finest durum wheat semolina and pure water used</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Preservatives</h3>
              <p className="text-gray-600">100% natural with no artificial additives or preservatives</p>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
};

export default DryPasta; 