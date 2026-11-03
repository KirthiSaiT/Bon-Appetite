/* Hallmark · N9 edge-aligned minimal nav — lg breakpoint, compact labels */
import { Link, useLocation } from "react-router-dom";
import { Menu, ShieldCheck, LogIn } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useIsAdmin } from "@/hooks/use-admin";
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

// `label` is the compact desktop label; `full` is the mobile-sheet label.
const navItems = [
  { label: "Home", full: "Home", path: "/" },
  { label: "About", full: "About Us", path: "/about" },
  { label: "Pasta Brand", full: "Our Pasta Brand", path: "/our-pasta-brand" },
  { label: "Cafe", full: "The Cafe", path: "/products" },
  { label: "Workshops", full: "Pasta Workshops", path: "/pasta-workshops" },
  { label: "Gallery", full: "Community & Gallery", path: "/gallery" },
  { label: "Recipes", full: "Recipes", path: "/recipes" },
  { label: "Careers", full: "Careers", path: "/careers" },
  { label: "Contact", full: "Contact Us", path: "/contact" },
];

const Navigation = () => {
  const location = useLocation();
  const { isAdmin } = useIsAdmin();

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center h-16 gap-3">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/bonappetitlogo.jpeg"
              alt="Bon Appetit Logo"
              className="h-10 w-auto rounded-lg"
            />
          </Link>

          <div className="flex-1" />

          {/* Desktop links — visible from lg (1024px+) */}
          <div className="hidden lg:flex items-center gap-x-3 xl:gap-x-5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-[0.72rem] xl:text-[0.78rem] tracking-[0.04em] font-semibold uppercase transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600 rounded-sm",
                  location.pathname === item.path
                    ? "text-orange-600"
                    : "text-stone-500 hover:text-stone-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Account, cart + mobile hamburger (below lg only) */}
          <div className="flex items-center gap-1 ml-1">
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.72rem] font-semibold uppercase tracking-[0.04em] whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600",
                  location.pathname.startsWith("/admin")
                    ? "bg-orange-600 text-white"
                    : "bg-stone-900 text-white hover:bg-orange-600"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-stone-600 hover:text-orange-600 whitespace-nowrap transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign in</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <span className="px-1.5 flex items-center">
                <UserButton>
                  {isAdmin && (
                    <UserButton.MenuItems>
                      <UserButton.Link label="Admin panel" labelIcon={<ShieldCheck className="w-4 h-4" />} href="/admin" />
                    </UserButton.MenuItems>
                  )}
                </UserButton>
              </span>
            </SignedIn>
            <CartDrawer />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
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
                            ? "bg-orange-50 text-orange-600 font-semibold"
                            : "text-stone-600"
                        )}
                      >
                        {item.full}
                      </Link>
                    </SheetClose>
                  ))}
                  {isAdmin && (
                    <SheetClose asChild>
                      <Link
                        to="/admin"
                        className="mt-3 flex items-center gap-2 px-4 py-3 text-sm font-semibold bg-stone-900 text-white rounded-sm hover:bg-orange-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin panel
                      </Link>
                    </SheetClose>
                  )}
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
