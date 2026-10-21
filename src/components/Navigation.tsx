/* Hallmark · N9 edge-aligned minimal nav */
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Pasta Brand", path: "/our-pasta-brand" },
  { name: "Food & Pre-orders", path: "/products" },
  { name: "Pasta Workshops", path: "/pasta-workshops" },
  { name: "Community & Gallery", path: "/gallery" },
  { name: "Recipes", path: "/recipes" },
  { name: "Careers", path: "/careers" },
  { name: "Contact Us", path: "/contact" },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/bonappetitlogo.jpeg"
              alt="Bon Appetit Logo"
              className="h-10 w-auto rounded-lg"
            />
          </Link>

          <div className="flex-1" />

          {/* Desktop links — edge-aligned right */}
          <div className="hidden 2xl:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-[0.68rem] tracking-[0.1em] font-medium uppercase transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600 rounded-sm",
                  location.pathname === item.path
                    ? "text-orange-600"
                    : "text-stone-500 hover:text-stone-900"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Cart + mobile hamburger */}
          <div className="flex items-center gap-1 ml-2">
            <CartDrawer />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="2xl:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <SheetHeader className="mb-6">
                  <SheetTitle
                    className="text-orange-600 text-2xl font-light"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Bon Appetit
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-0.5">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600 rounded-sm",
                          location.pathname === item.path
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-stone-600"
                        )}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;
