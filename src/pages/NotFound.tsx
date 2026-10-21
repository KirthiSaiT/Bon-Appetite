import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />

      <div className="flex items-center justify-center flex-1 py-32 px-8">
        <div className="text-center">
          <h1 className="text-[6rem] md:text-[9rem] font-bold text-stone-900 mb-2 leading-none font-display">404</h1>
          <p className="text-lg text-stone-500 mb-8">That page has gone off the menu.</p>
          <a
            href="/"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Return Home
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 font-display">Bon Appetit</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Artisan handmade pasta from our Hyderabad cloud kitchen — delivered across India.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">Open Hours</h3>
              <p className="text-gray-300">Fully Online</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <p className="text-gray-300">
                8-1-284/OU/461, OU Colony,<br />
                Shaikpet, Hyderabad,<br />
                Telangana 500008
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Reservation</h3>
              <p className="text-gray-300">Not applicable</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
