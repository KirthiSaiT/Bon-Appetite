/* /rate?ref=pay_...  — the link to send a customer after their order is delivered. */
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import RateUsModal from "@/components/RateUsModal";

const RateOrder = () => {
  const [params] = useSearchParams();
  const reference = params.get("ref") ?? "";
  const [open, setOpen] = useState(Boolean(reference));
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <h1 className="text-[2.4rem] md:text-[3rem] font-semibold leading-[1.05] text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
          Rate your order.
        </h1>
        <p className="mt-3 text-stone-600">
          {reference ? "We'd love to hear how it went." : "Open the rating link we sent you, or find your order on the tracking page."}
        </p>
        <Button
          onClick={() => (reference ? setOpen(true) : navigate("/track-order"))}
          className="mt-8 bg-orange-600 hover:bg-orange-700 text-white"
        >
          {reference ? "Rate now" : "Track your order"}
        </Button>
      </main>
      <RateUsModal open={open} onClose={() => setOpen(false)} reference={reference} />
      <SimpleFooter />
    </div>
  );
};

export default RateOrder;
