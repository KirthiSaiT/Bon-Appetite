/* "Rate Us!" popup for a paid order: food, website and delivery stars plus a comment.
 * The face on each card changes with the stars picked. */
import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Key = "food" | "website" | "delivery";

const cards: { key: Key; question: string; hint: string }[] = [
  { key: "food", question: "How was the food?", hint: "Rate your order" },
  { key: "website", question: "How was your website experience?", hint: "Rate our platform" },
  { key: "delivery", question: "How was the delivery experience?", hint: "Rate our service" },
];

// index = stars picked (0 = nothing yet)
const faces = ["🙂", "😞", "😕", "😊", "😄", "🤩"];

const StarRow = ({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) => (
  <div role="radiogroup" aria-label={label} className="flex">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        role="radio"
        aria-checked={value === n}
        aria-label={`${n} star${n > 1 ? "s" : ""}`}
        onClick={() => onChange(n)}
        className="rounded-md p-0.5 transition-transform active:translate-y-px motion-safe:hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600"
      >
        <Star className={`h-7 w-7 ${n <= value ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`} />
      </button>
    ))}
  </div>
);

async function post(body: Record<string, unknown>) {
  const res = await fetch("/api/submit-rating", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ratings aren't available right now.");
  return data;
}

const emptyScores: Record<Key, number> = { food: 0, website: 0, delivery: 0 };

interface Props {
  open: boolean;
  onClose: () => void;
  reference: string;
  /** If we already know the order's phone number, we don't ask again. */
  phone?: string;
}

const RateUsModal = ({ open, onClose, reference, phone: knownPhone }: Props) => {
  const [phone, setPhone] = useState(knownPhone ?? "");
  const [order, setOrder] = useState<{ order_id: string; order_type: string } | null>(null);
  const [scores, setScores] = useState(emptyScores);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const lookup = async (number: string) => {
    setError("");
    setBusy(true);
    try {
      const data = await post({ reference, phone: number });
      if (data.rated) setDone("You've already rated this order. Thank you!");
      setOrder({ order_id: data.order_id, order_type: data.order_type });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setPhone(knownPhone ?? "");
    setOrder(null);
    setScores(emptyScores);
    setComment("");
    setError("");
    setDone("");
    if (knownPhone) lookup(knownPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reference, knownPhone]);

  const submit = async () => {
    setError("");
    if (!scores.food || !scores.website || !scores.delivery) return setError("Please give all three ratings.");
    setBusy(true);
    try {
      await post({ reference, phone, ...scores, comment: comment.trim() });
      setDone("Thank you for your feedback!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1rem)] max-w-3xl overflow-y-auto rounded-2xl bg-stone-100 p-0">
        <DialogHeader className="border-b border-stone-200 bg-white px-5 py-4 text-left">
          <DialogTitle className="text-xl font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
            Rate Us!
          </DialogTitle>
          <DialogDescription className="sr-only">Rate your food, our website and the delivery.</DialogDescription>
        </DialogHeader>

        <div className="px-5 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6 pt-1">
            <div className="min-w-0">
              <h3 className="text-2xl md:text-3xl font-semibold text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
                Thanks For Ordering!
              </h3>
              <p className="mt-1 text-stone-500">Tell us how it went.</p>
            </div>
            {order && (
              <dl className="flex divide-x divide-stone-200 rounded-xl bg-white py-3 shadow-sm">
                <div className="px-5">
                  <dt className="text-sm text-stone-500">Order ID</dt>
                  <dd className="text-lg font-semibold text-stone-900">#{order.order_id}</dd>
                </div>
                <div className="px-5">
                  <dt className="text-sm text-stone-500">Order Type</dt>
                  <dd className="text-lg font-semibold text-stone-900">{order.order_type}</dd>
                </div>
              </dl>
            )}
          </div>

          {done ? (
            <div className="py-10 text-center">
              <p className="text-5xl" aria-hidden="true">🤩</p>
              <p role="status" className="mt-4 text-lg font-semibold text-stone-900">{done}</p>
              <Button onClick={onClose} className="mt-6 bg-orange-600 hover:bg-orange-700 text-white">Close</Button>
            </div>
          ) : !order ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                lookup(phone);
              }}
              className="mx-auto max-w-sm space-y-3 py-8"
            >
              <Label htmlFor="rate-phone">Phone number used on the order *</Label>
              <Input id="rate-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="bg-white" />
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={busy} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Checking" /> : "Continue"}
              </Button>
            </form>
          ) : (
            <>
              <ul className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                {cards.map((c) => (
                  <li key={c.key} className="min-w-0 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug text-stone-900">{c.question}</p>
                        <p className="mt-1 text-sm text-stone-500">{c.hint}</p>
                      </div>
                      <span className="text-5xl leading-none" aria-hidden="true">{faces[scores[c.key]]}</span>
                    </div>
                    <div className="mt-4">
                      <StarRow label={c.question} value={scores[c.key]} onChange={(n) => setScores((s) => ({ ...s, [c.key]: n }))} />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Label htmlFor="rate-comment" className="text-base font-semibold text-stone-900">Leave a comment</Label>
                <Textarea
                  id="rate-comment"
                  rows={4}
                  maxLength={1000}
                  placeholder="Write any comments"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-2 bg-white"
                />
              </div>

              {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

              <Button onClick={submit} disabled={busy} className="mt-5 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-5">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Sending" /> : "Submit rating"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateUsModal;
