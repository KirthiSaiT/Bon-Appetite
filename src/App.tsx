import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import Recipes from "./pages/Recipes";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DryPasta from "./pages/DryPasta";
import FreshPasta from "./pages/FreshPasta";
import SeasonalSauces from "./pages/SeasonalSauces";
import GourmetSandwiches from "./pages/GourmetSandwiches";
import FreshSaladBowls from "./pages/FreshSaladBowls";
import HotCurryMeals from "./pages/HotCurryMeals";
import DessertPlatters from "./pages/DessertPlatters";
import CookedPasta from "./pages/CookedPasta";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
