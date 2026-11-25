/* Track an order: payment reference + phone number. */
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { whatsappUrl } from "@/lib/whatsapp";

interface Tracking {
  paid_at: string;
  amount: number;
  delivery: string;
  status?: string | null;
  courier?: string | null;
  awb?: string | null;
  url?: string | null;
}

const TrackOrder = () => {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Tracking | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reference.trim(), phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Tracking isn't available right now.");
      setResult(data as Tracking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tracking isn't available right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <Navigation />
      <main className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-[2.4rem] md:text-[3rem] font-semibold leading-[1.05] text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
          Track your order.
        </h1>
        <p className="mt-3 text-stone-600">Use the payment reference from your order confirmation.</p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="ref">Payment reference <span className="text-red-500" aria-hidden="true">*</span></Label>
            <Input id="ref" placeholder="pay_..." value={reference} onChange={(e) => setReference(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tphone">Phone number <span className="text-red-500" aria-hidden="true">*</span></Label>
            <Input id="tphone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Checking" /> : "Check status"}
          </Button>
        </form>

        {error && (
          <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {result && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 p-6">
            <p className="text-lg font-semibold text-stone-900">{result.status || "Order received and paid"}</p>
            <p className="mt-2 text-stone-600">
              ₹{result.amount} paid on {new Date(result.paid_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
            </p>
            {result.courier && <p className="mt-2 text-stone-600">Courier: {result.courier}</p>}
            {result.awb && <p className="text-stone-600">Tracking number: {result.awb}</p>}
            {result.url ? (
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-orange-700 underline">
                Open courier tracking
              </a>
            ) : (
              <a
                href={whatsappUrl(`Hi Bon Appetit! What's the status of my order ${reference.trim()}?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-semibold text-orange-700 underline"
              >
                Ask us on WhatsApp
              </a>
            )}
          </section>
        )}
      </main>
      <SimpleFooter />
    </div>
  );
};

export default TrackOrder;
