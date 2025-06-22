import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import { CartProvider } from "./context/CartContext";

const Index = React.lazy(() => import("./pages/Index"));
const About = React.lazy(() => import("./pages/About"));
const Products = React.lazy(() => import("./pages/Products"));
const Gallery = React.lazy(() => import("./pages/Gallery"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Recipes = React.lazy(() => import("./pages/Recipes"));
const Contact = React.lazy(() => import("./pages/Contact"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const DryPasta = React.lazy(() => import("./pages/DryPasta"));
const FreshPasta = React.lazy(() => import("./pages/FreshPasta"));
const SeasonalSauces = React.lazy(() => import("./pages/SeasonalSauces"));
const GourmetSandwiches = React.lazy(() => import("./pages/GourmetSandwiches"));
const FreshSaladBowls = React.lazy(() => import("./pages/FreshSaladBowls"));
const HotCurryMeals = React.lazy(() => import("./pages/HotCurryMeals"));
const DessertPlatters = React.lazy(() => import("./pages/DessertPlatters"));
const CookedPasta = React.lazy(() => import("./pages/CookedPasta"));
const Checkout = React.lazy(() => import("./pages/Checkout"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/dry-pasta" element={<DryPasta />} />
              <Route path="/fresh-pasta" element={<FreshPasta />} />
              <Route path="/seasonal-sauces" element={<SeasonalSauces />} />
              <Route path="/gourmet-sandwiches" element={<GourmetSandwiches />} />
              <Route path="/fresh-salad-bowls" element={<FreshSaladBowls />} />
              <Route path="/hot-curry-meals" element={<HotCurryMeals />} />
              <Route path="/dessert-platters" element={<DessertPlatters />} />
              <Route path="/cooked-pasta" element={<CookedPasta />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
