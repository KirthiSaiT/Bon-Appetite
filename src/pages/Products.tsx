import Navigation from "@/components/Navigation";
import { ChevronDown, ChevronUp, X, ShoppingCart, User, Mail, Phone, Calendar, Clock } from "lucide-react";
import { useState, useCallback } from "react";
import emailjs from '@emailjs/browser';
import { SimpleFooter } from "@/components/Footer";
import CategoryItem from "@/components/CategoryItem";

const categories = [
  {
    id: "ready-to-cook",
    title: "Ready to Cook",
    subtitle: "Fresh ingredients, pre-prepared",
    image: "/lovable-uploads-optimized/BAC-Logo-E-Vertical (2).webp",
    subcategories: [
      { name: "Dry Pasta", description: "No preservatives, 3 months shelf life", image: "/lovable-uploads-optimized/drypasta.webp" },
      { name: "Fresh Pasta", description: "Pre-order 1-2 days, 2hrs shelf life", image: "/lovable-uploads-optimized/fresh pasta.webp" },
      { name: "Seasonal Sauces", description: "Pre-order 1-2 days, 1 month shelf life", image: "/lovable-uploads-optimized/seasonal sauces.webp" }
    ]
  },
  {
    id: "ready-to-eat",
    title: "Ready to Eat",
    subtitle: "Delicious meals, instantly served",
    image: "/lovable-uploads-optimized/BAC-Logo-E-Vertical (2).webp",
    subcategories: [
      { name: "Gourmet Sandwiches", description: "Freshly made daily", image: "/lovable-uploads-optimized/gourmet sandwich.webp" },
      { name: "Fresh Salad Bowls", description: "Crisp & healthy options", image: "/lovable-uploads-optimized/fresh salad.webp" },
      { name: "Hot Curry Meals", description: "Authentic flavors", image: "/lovable-uploads-optimized/hot curry.webp" },
      { name: "Dessert Platters", description: "Sweet treats", image: "/lovable-uploads-optimized/dessert platter.webp" },
      { name: "Cooked Pasta", description: "Pre-order 1-2 days, 2hrs shelf life", image: "/lovable-uploads-optimized/cooked pasta.webp" }
    ]
  },
  {
    id: "services",
    title: "Our Services",
    subtitle: "Professional catering & workshops",
    image: "/lovable-uploads-optimized/BAC-Logo-E-Vertical (2).webp",
    subcategories: [
      { name: "Catering", description: "Continental food for parties & events up to 250 pax", image: "/lovable-uploads-optimized/catering (1).webp" },
      { name: "Pasta Workshop", description: "Online & offline, weekend & custom slots", image: "/lovable-uploads-optimized/pasta workshop.webp" }
    ]
  }
];

type Subcategory = {
  name: string;
  description: string;
  image: string;
};

const Products = () => {
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

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategory(prev => (prev === category ? null : category));
  }, []);

  const handleOrderClick = useCallback((categoryTitle: string, subcategory: Subcategory) => {
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
  }, []);

  const handleFormChange = useCallback((field: string, value: string | number) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmitOrder = useCallback(() => {
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
  }, [orderForm, selectedItem]);

  const closeModal = useCallback(() => {
    setShowOrderModal(false);
    setSelectedItem(null);
  }, []);

  const handleCateringClick = useCallback(() => {
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
  }, []);

  const handleCateringFormChange = useCallback((field: string, value: string) => {
    setCateringForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmitCatering = useCallback(() => {
    if (!cateringForm.name || !cateringForm.eventDate || !cateringForm.eventTime || !cateringForm.serviceType || !cateringForm.people || !cateringForm.phone) {
      alert('Please fill in all required fields');
      return;
    }
    setShowCateringModal(false);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 4000);
  }, [cateringForm]);

  const closeCateringModal = useCallback(() => {
    setShowCateringModal(false);
  }, []);

  const handleBookWorkshop = useCallback(() => setShowWorkshopModal(true), []);

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
              <CategoryItem
                key={category.id}
                category={category}
                isExpanded={expandedCategory === category.id}
                onToggle={toggleCategory}
                onOrderClick={handleOrderClick}
                onBookWorkshop={handleBookWorkshop}
                onCater={handleCateringClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Order Modal */}
      {showOrderModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Place Order</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600" aria-label="Close order modal">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">For {selectedItem.item} in {selectedItem.category}</p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    value={orderForm.quantity}
                    onChange={(e) => handleFormChange('quantity', parseInt(e.target.value, 10))}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={orderForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={orderForm.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={orderForm.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="specialInstructions" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                    <span className="text-gray-500 text-sm ml-2">(optional)</span>
                  </label>
                  <textarea
                    id="specialInstructions"
                    value={orderForm.specialInstructions}
                    onChange={(e) => handleFormChange('specialInstructions', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                    rows={3}
                    placeholder="e.g., allergies, delivery notes"
                  ></textarea>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  Submit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catering Modal */}
      {showCateringModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
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

      {/* Thank You Toast */}
      {showThankYou && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all">
          Thank you! Your request has been received.
        </div>
      )}

      <SimpleFooter />
    </div>
  );
};

export default Products;