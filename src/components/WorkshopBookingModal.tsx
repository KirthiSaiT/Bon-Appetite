/* Workshop booking box — same shell as the Catering Booking modal on the Cafe page,
 * with a calendar that only enables days that have an active workshop. */
import { useEffect, useMemo, useState } from "react";
import { X, CalendarDays, Clock, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase";
import { useWorkshops, parseDay, toDay, Workshop, workshopTotals, inr, GST_RATE } from "@/hooks/use-menu-data";
import {
  razorpayConfigured,
  loadRazorpayScript,
  createOrder,
  openCheckout,
  verifyPayment,
  PaymentCancelled,
} from "@/lib/razorpay";
import { sendWorkshopBookingEmails, ticketCode } from "@/lib/email";

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Pre-select this workshop (e.g. from its "Book Now" button). */
  workshopId?: string;
}

const emptyForm = { name: "", phone: "", email: "", people: "1", notes: "" };

const WorkshopBookingModal = ({ open, onClose, workshopId }: Props) => {
  const { data: workshops = [], isLoading } = useWorkshops();
  const [day, setDay] = useState<string | undefined>();
  const [chosenId, setChosenId] = useState<string | undefined>();
  const [form, setForm] = useState(emptyForm);
  const [state, setState] = useState<"idle" | "paying" | "saving" | "done">("idle");
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState("");

  // Reset each time the box opens; jump to the requested (or soonest) workshop.
  useEffect(() => {
    if (!open) return;
    const start = workshops.find((w) => w.id === workshopId) ?? workshops[0];
    setDay(start?.workshop_date);
    setChosenId(start?.id);
    setForm(emptyForm);
    setState("idle");
    setError("");
    setTicket("");
  }, [open, workshopId, workshops]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const workshopDays = useMemo(() => new Set(workshops.map((w) => w.workshop_date)), [workshops]);
  const onDay = workshops.filter((w) => w.workshop_date === day);
  const chosen: Workshop | undefined = onDay.find((w) => w.id === chosenId) ?? onDay[0];

  if (!open) return null;

  const busy = state === "paying" || state === "saving";
  const peopleCount = Math.min(20, Math.max(1, Number(form.people) || 1));
  const totals = chosen ? workshopTotals(chosen.price, peopleCount) : null;
  const set = (field: keyof typeof emptyForm, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async () => {
    setError("");
    if (!chosen) return setError("Please pick a workshop date on the calendar.");
    if (!form.name.trim() || !form.phone.trim()) return setError("Please fill in your name and phone number.");
    const people = Number(form.people);
    if (!Number.isInteger(people) || people < 1 || people > 20) return setError("Number of people must be between 1 and 20.");
    if (!supabase || chosen.id.startsWith("fallback")) {
      return setError("Bookings are not open online yet. Please contact us to book this workshop.");
    }
    if (!razorpayConfigured) {
      return setError("Online payment isn't available right now. Please contact us to book this workshop.");
    }

    // Charge the GST-inclusive total (base × people + 18% GST).
    const { total: amountRupees } = workshopTotals(chosen.price, people);
    const amountPaise = Math.round(amountRupees * 100);
    if (amountPaise < 100) {
      return setError("This workshop's price is not set correctly. Please contact us to book.");
    }

    // 1) Take payment first — a booking is only created once payment is verified.
    setState("paying");
    let payment: { razorpay_payment_id: string; razorpay_order_id: string };
    try {
      await loadRazorpayScript();
      const order = await createOrder(amountPaise, `ws_${chosen.id.slice(0, 8)}_${Date.now()}`.slice(0, 40));
      const success = await openCheckout({
        order,
        name: "Bon Appetit · Pasta Workshop",
        description: `${chosen.title} · ${people} ${people === 1 ? "seat" : "seats"}`,
        prefill: { name: form.name.trim(), email: form.email.trim() || undefined, contact: form.phone.trim() },
      });
      const verified = await verifyPayment(success);
      if (!verified) {
        setState("idle");
        return setError("We couldn't verify your payment. If money was deducted, please contact us — you won't be charged twice.");
      }
      payment = { razorpay_payment_id: success.razorpay_payment_id, razorpay_order_id: success.razorpay_order_id };
    } catch (err) {
      setState("idle");
      if (err instanceof PaymentCancelled) {
        return setError("Payment cancelled. Your spot isn't booked yet — you can try again.");
      }
      return setError(err instanceof Error ? err.message : "Payment couldn't be completed. Please try again.");
    }

    // 2) Record the paid booking.
    setState("saving");
    const { error: dbError } = await supabase.from("workshop_bookings").insert({
      workshop_id: chosen.id,
      workshop_title: chosen.title,
      workshop_date: chosen.workshop_date,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      people,
      notes: form.notes.trim() || null,
      amount: amountRupees,
      paid: true,
      razorpay_order_id: payment.razorpay_order_id,
      razorpay_payment_id: payment.razorpay_payment_id,
    });
    if (dbError) {
      // Payment succeeded but we couldn't save the booking — make sure the user can reach us.
      setState("idle");
      return setError(
        `Payment received (ref ${payment.razorpay_payment_id}), but we couldn't save your booking automatically. Please contact us with this reference and we'll confirm your seat.`,
      );
    }

    // 3) Email the customer + admin. Best-effort — the booking is already paid & saved.
    try {
      await sendWorkshopBookingEmails({
        workshopTitle: chosen.title,
        dateLabel: format(parseDay(chosen.workshop_date), "EEEE, d MMMM yyyy"),
        timeLabel: chosen.time_label,
        venue: chosen.venue,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        people,
        amount: amountRupees,
        notes: form.notes.trim(),
        paymentId: payment.razorpay_payment_id,
        orderId: payment.razorpay_order_id,
      });
    } catch {
      // Ignore — a failed confirmation email must not block a paid booking.
    }

    setTicket(ticketCode(payment.razorpay_payment_id));
    setState("done");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="workshop-booking-title"
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 id="workshop-booking-title" className="text-xl font-bold text-gray-800">Workshop Booking</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600"
              aria-label="Close workshop booking"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {state === "done" && chosen ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Payment received — you're booked in!</h4>
            {ticket && (
              <div className="mb-4 rounded-lg border border-dashed border-orange-300 bg-orange-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-orange-700 font-semibold">Your ticket</p>
                <p className="text-2xl font-bold text-orange-700">{ticket}</p>
              </div>
            )}
            <p className="text-sm text-gray-600 mb-6">
              {chosen.title} on {format(parseDay(chosen.workshop_date), "EEEE, d MMMM yyyy")}.{" "}
              {form.email ? <>Your ticket &amp; QR code are on their way to {form.email}. </> : null}
              We'll contact you on {form.phone} with the joining details.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">Workshop Date *</span>
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 py-6 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading dates…
                </div>
              ) : workshops.length === 0 ? (
                <p className="text-sm text-gray-600 bg-stone-50 rounded-lg p-4">
                  No upcoming workshops are scheduled right now. Please check back soon.
                </p>
              ) : (
                <div className="border border-gray-300 rounded-lg flex justify-center">
                  <Calendar
                    mode="single"
                    selected={day ? parseDay(day) : undefined}
                    defaultMonth={day ? parseDay(day) : undefined}
                    onSelect={(d) => {
                      if (!d) return;
                      const iso = toDay(d);
                      setDay(iso);
                      setChosenId(workshops.find((w) => w.workshop_date === iso)?.id);
                    }}
                    disabled={(d) => !workshopDays.has(toDay(d))}
                    modifiers={{ workshop: (d) => workshopDays.has(toDay(d)) }}
                    modifiersClassNames={{ workshop: "font-bold text-orange-700" }}
                  />
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">Highlighted dates have a workshop.</p>
            </div>

            {onDay.length > 1 && (
              <div>
                <label htmlFor="ws-session" className="block text-sm font-medium text-gray-700 mb-2">Session *</label>
                <select id="ws-session" className={inputCls} value={chosen?.id} onChange={(e) => setChosenId(e.target.value)}>
                  {onDay.map((w) => (
                    <option key={w.id} value={w.id}>{w.title} · {w.time_label}</option>
                  ))}
                </select>
              </div>
            )}

            {chosen && (
              <div className="bg-orange-50 rounded-lg p-4 text-sm text-gray-700 space-y-1.5">
                <p className="font-semibold text-gray-800">{chosen.title}</p>
                <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-orange-600" />{format(parseDay(chosen.workshop_date), "EEEE, d MMMM yyyy")}</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-600" />{chosen.time_label}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-600" />{chosen.venue}</p>
                {totals && (
                  <div className="pt-2 mt-1 border-t border-orange-200 space-y-1">
                    <div className="flex justify-between">
                      <span>₹{chosen.price} × {peopleCount} {peopleCount === 1 ? "person" : "people"}</span>
                      <span>₹{inr(totals.base)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST ({Math.round(GST_RATE * 100)}%)</span>
                      <span>₹{inr(totals.gst)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-orange-700 pt-1">
                      <span>Total payable</span>
                      <span>₹{inr(totals.total)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="ws-name" className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input id="ws-name" type="text" className={inputCls} placeholder="Enter your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label htmlFor="ws-phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input id="ws-phone" type="tel" className={inputCls} placeholder="Enter your phone number" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <label htmlFor="ws-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input id="ws-email" type="email" className={inputCls} placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label htmlFor="ws-people" className="block text-sm font-medium text-gray-700 mb-2">No of People *</label>
              <input id="ws-people" type="number" min={1} max={20} className={inputCls} value={form.people} onChange={(e) => set("people", e.target.value)} />
            </div>
            <div>
              <label htmlFor="ws-notes" className="block text-sm font-medium text-gray-700 mb-2">Anything we should know?</label>
              <textarea id="ws-notes" rows={3} className={`${inputCls} resize-none`} placeholder="Dietary needs, questions…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>

            <p className="text-xs text-red-700 font-semibold text-center">Payment is non-refundable</p>
            {error && <p role="alert" className="text-sm text-red-600 text-center">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={busy}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white rounded-lg font-semibold transition-colors"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {state === "paying" ? "Opening payment…" : state === "saving" ? "Confirming…" : totals ? `Pay ₹${inr(totals.total)}` : "Pay"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopBookingModal;
