/* Workshop booking box — same shell as the Catering Booking modal on the Cafe page,
 * with a calendar that only enables days that have an active workshop. */
import { useEffect, useMemo, useState } from "react";
import { X, CalendarDays, Clock, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase";
import { useWorkshops, parseDay, toDay, Workshop } from "@/hooks/use-menu-data";

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
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState("");

  // Reset each time the box opens; jump to the requested (or soonest) workshop.
  useEffect(() => {
    if (!open) return;
    const start = workshops.find((w) => w.id === workshopId) ?? workshops[0];
    setDay(start?.workshop_date);
    setChosenId(start?.id);
    setForm(emptyForm);
    setState("idle");
    setError("");
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
    });
    if (dbError) {
      setState("idle");
      return setError("Couldn't save your booking. Please try again, or contact us.");
    }
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
            <h4 className="text-lg font-bold text-gray-800 mb-2">You're booked in!</h4>
            <p className="text-sm text-gray-600 mb-6">
              {chosen.title} on {format(parseDay(chosen.workshop_date), "EEEE, d MMMM yyyy")}. We'll contact you on{" "}
              {form.phone} with payment and joining details.
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
                <p className="pt-1 font-bold text-orange-700">₹{chosen.price} per person</p>
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={state === "saving"}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white rounded-lg font-semibold transition-colors"
              >
                {state === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
                {state === "saving" ? "Booking…" : "Book"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopBookingModal;
