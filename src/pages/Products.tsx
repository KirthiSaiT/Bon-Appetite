import Navigation from "@/components/Navigation";
import { ChevronDown, ChevronUp, X, ShoppingCart, User, Mail, Phone, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import emailjs from '@emailjs/browser';
import { SimpleFooter } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{category: string, item: string, description: string} | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    email: '',
    phone: '',
    name: '',
    specialInstructions: ''
  });
  const [cateringForm, setCateringForm] = useState({
    name: '',
    eventDate: '',
    eventTime: '',
    serviceType: 'Delivery',
    people: '',
    query: '',
    phone: ''
  });
  const [showCateringModal, setShowCateringModal] = useState(false);
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleOrderClick = (categoryTitle: string, subcategory: {name: string, description: string}) => {
    setSelectedItem({
      category: categoryTitle,
      item: subcategory.name,
      description: subcategory.description
    });
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
        You have a new order!
        Product: ${selectedItem?.category} - ${selectedItem?.item}
        Quantity: ${orderForm.quantity}
        Description: ${selectedItem?.description}
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
    setSelectedItem(null);
  };

  const handleCateringClick = () => {
    setShowCateringModal(true);
    setCateringForm({
      name: '',
      eventDate: '',
      eventTime: '',
      serviceType: 'Delivery',
      people: '',
      query: '',
      phone: ''
    });
  };

  const handleCateringFormChange = (field: string, value: string) => {
    setCateringForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitCatering = () => {
    if (!cateringForm.name || !cateringForm.eventDate || !cateringForm.eventTime || !cateringForm.serviceType || !cateringForm.people || !cateringForm.phone) {
      alert('Please fill in all required fields');
      return;
    }
    setShowCateringModal(false);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 4000);
  };

  const closeCateringModal = () => {
    setShowCateringModal(false);
  };

  const categories = [
    {
      id: "ready-to-cook",
      title: "Ready to Cook",
      subtitle: "Fresh ingredients, pre-prepared",
      image: "/lovable-uploads-optimized/BAC-Logo-E-Vertical (2).png",
      subcategories: [
        { name: "Dry Pasta", description: "No preservatives, 3 months shelf life", image: "/lovable-uploads-optimized/drypasta.jpg" },
        { name: "Fresh Pasta", description: "Pre-order 1-2 days, 2hrs shelf life", image: "/lovable-uploads-optimized/fresh pasta.jpg" },
        { name: "Seasonal Sauces", description: "Pre-order 1-2 days, 1 month shelf life", image: "/lovable-uploads-optimized/seasonal sauces.jpg" }
      ]
    },
    {
      id: "ready-to-eat",
      title: "Ready to Eat",
      subtitle: "Delicious meals, instantly served",
      image: "/lovable-uploads-optimized/BAC-Logo-E-Vertical (2).png",
      subcategories: [
        { name: "Gourmet Sandwiches", description: "Freshly made daily", image: "/lovable-uploads-optimized/gourmet sandwich.jpg" },
        { name: "Fresh Salad Bowls", description: "Crisp & healthy options", image: "/lovable-uploads-optimized/fresh salad.jpg" },
        { name: "Hot Curry Meals", description: "Authentic flavors", image: "/lovable-uploads-optimized/hot curry.jpg" },
        { name: "Dessert Platters", description: "Sweet treats", image: "/lovable-uploads-optimized/dessert platter.jpg" },
        { name: "Cooked Pasta", description: "Pre-order 1-2 days, 2hrs shelf life", image: "/lovable-uploads-optimized/cooked pasta.jpg" }
      ]
    },
    {
      id: "services",
      title: "Our Services",
      subtitle: "Professional catering & workshops",
      image: "/lovable-uploads-optimized/BAC-Logo-E-Vertical (2).png",
      subcategories: [
        { name: "Catering", description: "Continental food for parties & events up to 250 pax", image: "/lovable-uploads-optimized/catering (1).jpg" },
        { name: "Pasta Workshop", description: "Online & offline, weekend & custom slots", image: "/lovable-uploads-optimized/pasta workshop.jpg" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Our <span className="text-orange-600">Products</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover our complete range of culinary offerings, from ready-to-cook ingredients to delicious ready-to-eat meals.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">All Categories</h2>
          
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Category Header */}
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                      <p className="text-gray-600 text-sm">{category.subtitle}</p>
                    </div>
                  </div>
                  {expandedCategory === category.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Subcategories */}
                {expandedCategory === category.id && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-0 md:ml-20">
                      {category.subcategories.map((subcategory, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="text-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-orange-100 mx-auto mb-3 flex items-center justify-center">
                              <img 
                                src={subcategory.image || category.image} 
                                alt={subcategory.name}
                                className="w-12 h-12 object-cover rounded-full"
                              />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">{subcategory.name}</h4>
                            <p className="text-sm text-gray-600 mb-4">{subcategory.description}</p>
                          </div>
                          {category.title === 'Our Services' && subcategory.name === 'Pasta Workshop' ? (
                            <>
                              <button
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                                onClick={() => setShowWorkshopModal(true)}
                              >
                                Book
                              </button>
                            </>
                          ) : null}
                          {category.title === 'Our Services' && subcategory.name === 'Catering' ? (
                            <button
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                              onClick={handleCateringClick}
                            >
                              Book
                            </button>
                          ) : null}
                          {!(category.title === 'Our Services' && (subcategory.name === 'Pasta Workshop' || subcategory.name === 'Catering')) ? (
                            <button
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                              onClick={() => {
                                if (subcategory.name === "Dry Pasta") {
                                  navigate('/dry-pasta');
                                } else if (subcategory.name === "Fresh Pasta") {
                                  navigate('/fresh-pasta');
                                } else if (subcategory.name === "Seasonal Sauces") {
                                  navigate('/seasonal-sauces');
                                } else if (subcategory.name === "Gourmet Sandwiches") {
                                  navigate('/gourmet-sandwiches');
                                } else if (subcategory.name === "Fresh Salad Bowls") {
                                  navigate('/fresh-salad-bowls');
                                } else if (subcategory.name === "Hot Curry Meals") {
                                  navigate('/hot-curry-meals');
                                } else if (subcategory.name === "Dessert Platters") {
                                  navigate('/dessert-platters');
                                } else if (subcategory.name === "Cooked Pasta") {
                                  navigate('/cooked-pasta');
                                } else {
                                  handleOrderClick(category.title, subcategory);
                                }
                              }}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {subcategory.name === "Dry Pasta" || subcategory.name === "Fresh Pasta" || subcategory.name === "Seasonal Sauces" || subcategory.name === "Gourmet Sandwiches" || subcategory.name === "Fresh Salad Bowls" || subcategory.name === "Hot Curry Meals" || subcategory.name === "Dessert Platters" || subcategory.name === "Cooked Pasta" ? "View Products" : "Order Now"}
                            </button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Modal */}
      {showOrderModal && selectedItem && (
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
                <h4 className="font-semibold text-orange-800 mb-1">{selectedItem.item}</h4>
                <p className="text-sm text-orange-700">{selectedItem.category}</p>
                <p className="text-xs text-orange-600 mt-1">{selectedItem.description}</p>
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

      {/* Catering Modal */}
      {showCateringModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Catering Booking</h3>
                <button 
                  onClick={closeCateringModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close catering modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Enter your name"
                  title="Name"
                  value={cateringForm.name}
                  onChange={e => handleCateringFormChange('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Enter your phone number"
                  title="Phone Number"
                  value={cateringForm.phone}
                  onChange={e => handleCateringFormChange('phone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  title="Event Date"
                  value={cateringForm.eventDate}
                  onChange={e => handleCateringFormChange('eventDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time (IST) *</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  title="Event Time"
                  value={cateringForm.eventTime}
                  onChange={e => handleCateringFormChange('eventTime', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  value={cateringForm.serviceType}
                  onChange={e => handleCateringFormChange('serviceType', e.target.value)}
                  title="Service Type"
                  aria-label="Service Type"
                >
                  <option value="Delivery">Delivery</option>
                  <option value="Service(with waiters)">Service (with waiters)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No of People *</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Enter number of people"
                  value={cateringForm.people}
                  onChange={e => handleCateringFormChange('people', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Query - Please mention menu you're looking for.</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                  placeholder="Describe your menu or any special requests..."
                  value={cateringForm.query}
                  onChange={e => handleCateringFormChange('query', e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeCateringModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitCatering}
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pasta Workshop Modal */}
      {showWorkshopModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Pasta Workshop Details</h3>
                <button 
                  onClick={() => setShowWorkshopModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close workshop modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <ul className="text-left text-sm text-gray-700 mb-4 list-disc pl-5">
                <li>✅ Learn 2 Pastas from scratch - Fettucine & Farfalle serving for 4 people</li>
                <li>✅ No need of any fancy equipments</li>
                <li>✅ Additional Italian sauce making</li>
                <li>✅ Tricks to make your pasta silky smooth</li>
                <li>✅ Simple ingredients and kitchen equipment needed</li>
                <li>✅ Interactive Q & A</li>
                <li>📍 Attend from anywhere</li>
                <li><span className="font-bold text-orange-700">Early bird offer at only INR 599</span></li>
                <li><span className="font-bold text-red-600">Limited slots available. Every month 4th Saturday</span></li>
              </ul>
              <div className="mb-2 text-xs text-red-700 font-semibold text-center">Payment is non-refundable</div>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSe_JQSN3NhIvXnQsRILcw3SOUGzbheP7px0wDNPBt5gGQnyww/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
              >
                Continue Booking
              </a>
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
              Thank you for purchasing with Bon Appétit! We'll contact you soon with order confirmation.
            </p>
            <div className="text-sm text-gray-500">
              This message will close automatically...
            </div>
          </div>
        </div>
      )}

      {/* Order CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Order?</h2>
          <p className="text-gray-600 mb-8">
            Explore our categories and place your order for fresh, delicious meals delivered right to your doorstep.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
};

export default Products;