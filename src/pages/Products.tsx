/* Hallmark · redesign · genre: editorial · macrostructure: Catalogue-index (circle-icon menu browser)
 * theme: brand system (cream paper · Cormorant Garamond + DM Sans · orange accent)
 * motion: circle-lift · image-zoom · cta-arrow-slide  ·  contrast: pass
 */
import Navigation from "@/components/Navigation";
import { X, ArrowRight } from "lucide-react";
import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { SimpleFooter } from "@/components/Footer";
import WorkshopBookingModal from "@/components/WorkshopBookingModal";

// Circle-icon menu — each tile is a real photo in a circle with a label beneath.
// `to` routes to a product page; `action` opens a service modal. Dry Pasta lives
// on the Pasta Brand page, so it is intentionally absent here.
type MenuItem = {
  group: string;
  name: string;
  note: string;
  image: string;
  to?: string;
  action?: "cater" | "workshop";
};

const menu: MenuItem[] = [
  { group: "Ready to Cook", name: "Fresh Pasta",     note: "Pre-order 1–2 days ahead",   image: "/freshpasta.webp",     to: "/fresh-pasta" },
  { group: "Ready to Cook", name: "Seasonal Sauces", note: "Small-batch · 1-month life", image: "/seaonal.webp",        to: "/seasonal-sauces" },
  { group: "Ready to Eat",  name: "Cooked Pasta",    note: "Hot & ready · pre-order",    image: "/cooked.webp",         to: "/cooked-pasta" },
  { group: "Ready to Eat",  name: "Dessert Platters",note: "Sweet finishes to share",    image: "/dessertplatter.webp", to: "/dessert-platters" },
  { group: "At Your Service", name: "Catering",      note: "Events up to 250 guests",    image: "/catering.webp",       action: "cater" },
  { group: "At Your Service", name: "Pasta Workshop",note: "Two pastas from scratch",    image: "/pastaworkshop.webp",  action: "workshop" },
];

const Products = () => {
  const navigate = useNavigate();
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

  const handleTileClick = useCallback((item: MenuItem) => {
    if (item.action === "cater") {
      setCateringForm({ name: '', eventDate: '', eventTime: '', serviceType: 'Delivery', people: '', query: '', phone: '' });
      setShowCateringModal(true);
    } else if (item.action === "workshop") {
      setShowWorkshopModal(true);
    } else if (item.to) {
      navigate(item.to);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      {/* ── Page hero ── */}
      <section className="px-8 md:px-14 xl:px-20 pt-16 pb-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <span className="text-orange-600 text-[0.63rem] tracking-[0.25em] uppercase font-semibold mb-6 block">
            Dine the Italian way
          </span>
          <h1
            className="text-[2.8rem] md:text-[4rem] xl:text-[5rem] font-bold leading-[1.05] text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The <span className="text-orange-600">Cafe.</span>
          </h1>
          <div className="w-10 h-px bg-orange-600 mb-6" />
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl">
            Ready-to-cook pasta kits, hot plates straight from our kitchen, catering and
            hands-on workshops. Tap any circle below to explore the menu and order.
          </p>
        </div>
      </section>

      <div className="h-px bg-stone-200" />

      {/* ── Circle-icon menu browser ── */}
      <section className="py-16 md:py-20 px-6 sm:px-8 md:px-14 xl:px-20 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <span className="text-[0.63rem] tracking-[0.25em] uppercase text-stone-400 mb-3 block">
              Browse the menu
            </span>
            <h2
              className="text-[2rem] md:text-[2.8rem] font-bold text-stone-900 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pick your plate.
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-12 sm:gap-x-10 lg:gap-x-14">
            {menu.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleTileClick(item)}
                className="group flex flex-col items-center text-center w-[9.5rem] sm:w-44 focus-visible:outline-none"
                aria-label={item.action ? `Open ${item.name}` : `View ${item.name}`}
              >
                {/* The circle */}
                <span
                  className="relative block w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-1 ring-stone-200 shadow-sm transition-transform duration-200 ease-out group-hover:-translate-y-1.5 group-hover:ring-2 group-hover:ring-orange-500 group-focus-visible:ring-2 group-focus-visible:ring-orange-600 motion-reduce:transition-none motion-reduce:transform-none"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none"
                  />
                </span>

                {/* Label block */}
                <span className="mt-5 text-[0.58rem] tracking-[0.2em] uppercase text-orange-600 font-semibold">
                  {item.group}
                </span>
                <span
                  className="mt-1.5 text-lg md:text-xl text-stone-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.name}
                </span>
                <span className="mt-1 text-xs text-stone-500 leading-snug">
                  {item.note}
                </span>
                <span className="mt-3 text-[0.72rem] font-semibold text-stone-700 inline-flex items-center gap-1 group-hover:text-orange-600 transition-colors">
                  {item.action ? "Enquire" : "Order"}
                  <ArrowRight className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dry pasta lives on the Pasta Brand page ── */}
      <section className="px-8 md:px-14 xl:px-20 py-14 bg-white">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/our-pasta-brand"
            className="group flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7 border border-stone-200 hover:border-orange-500 transition-colors p-5 sm:p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            <span className="relative block w-20 h-20 rounded-full overflow-hidden ring-1 ring-stone-200 flex-shrink-0">
              <img src="/drypasta.webp" alt="Handmade dry pasta" className="absolute inset-0 w-full h-full object-cover" />
            </span>
            <div className="flex-1">
              <span className="text-[0.58rem] tracking-[0.2em] uppercase text-orange-600 font-semibold">
                Looking for dry pasta?
              </span>
              <h3
                className="text-xl md:text-2xl font-bold text-stone-900 mt-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our handmade dry pasta lives on the Pasta Brand page.
              </h3>
              <p className="text-stone-600 text-sm mt-1.5 max-w-xl">
                Five shapes, five natural colours, three-month shelf life — shop the full
                range and find us in 30+ stores.
              </p>
            </div>
            <span className="text-stone-700 text-sm font-semibold inline-flex items-center gap-2 group-hover:text-orange-600 transition-colors whitespace-nowrap">
              Visit Pasta Brand
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" />
            </span>
          </Link>
        </div>
      </section>

      {/* ── Closing CTA band ── */}
      <section className="py-16 md:py-20 px-8 md:px-14 bg-orange-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Planning something bigger?
          </h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">
            From intimate dinners to events for 250, our kitchen caters it all. Tell us
            what you have in mind.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setCateringForm({ name: '', eventDate: '', eventTime: '', serviceType: 'Delivery', people: '', query: '', phone: '' });
                setShowCateringModal(true);
              }}
              className="bg-white text-orange-600 hover:bg-orange-50 px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Enquire about Catering
            </button>
            <Link
              to="/contact"
              className="border border-white text-white hover:bg-white/10 px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact Us
            </Link>
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

      <WorkshopBookingModal open={showWorkshopModal} onClose={() => setShowWorkshopModal(false)} />

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
