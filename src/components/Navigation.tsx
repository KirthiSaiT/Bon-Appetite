import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo — normal-flow, vertically centred */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="/bonappetitlogo.jpeg"
                alt="Bon Appetit Logo"
                className="h-14 w-auto rounded-xl shadow-md"
              />
            </Link>
          </div>

          {/* Desktop Navigation — shadcn NavigationMenu */}
          <div className="hidden 2xl:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-0 flex-wrap justify-center">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "inline-flex h-9 items-center justify-center rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 focus:outline-none whitespace-nowrap",
                          location.pathname === item.path
                            ? "text-orange-600 font-semibold"
                            : "text-gray-600"
                        )}
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Cart + Mobile trigger */}
          <div className="flex items-center gap-2">
            <CartDrawer />

            {/* Mobile Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="2xl:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-orange-600 text-lg font-bold">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600",
                          location.pathname === item.path
                            ? "bg-orange-50 text-orange-600 font-semibold"
                            : "text-gray-600"
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
