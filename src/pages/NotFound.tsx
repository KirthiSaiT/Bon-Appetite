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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      <div className="flex items-center justify-center flex-1 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
          <a 
            href="/" 
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Bon Appetit</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Visitors will want to know who is on the other side of the page. Use this space to write about your business.
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
