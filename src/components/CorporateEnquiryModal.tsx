/* Corporate workshop enquiry: the single way to get in touch about workshops for teams.
 * Sends through the shared EmailJS setup (see src/lib/emailjsConfig.ts). */
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } from "@/lib/emailjsConfig";

const empty = { company: "", name: "", email: "", phone: "", people: "", mode: "", date: "", message: "" };

const CorporateEnquiryModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.company.trim() || !form.name.trim() || !form.email.trim() || form.phone.trim().length < 6) {
      setError("Please fill in your company, name, email and phone number.");
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name.trim(),
          to_name: "Bon Appetit",
          subject: `Corporate workshop enquiry · ${form.company.trim()}`,
          user_email: form.email.trim(),
          message:
            `New corporate workshop enquiry\n\n` +
            `Company: ${form.company}\nContact: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n` +
            `Team size: ${form.people || "-"}\nOnline or at office: ${form.mode || "-"}\nPreferred date: ${form.date || "-"}\n\n` +
            `Message:\n${form.message || "-"}`,
        },
        EMAILJS_PUBLIC_KEY,
      );
      toast.success("Thanks! We'll get back to you about your team workshop.");
      setForm(empty);
      onClose();
    } catch {
      setError("We couldn't send your enquiry. Please try again or call us on 93901 05767.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }} className="text-2xl">
            Corporate enquiry
          </DialogTitle>
          <DialogDescription>
            Tell us about your team and we'll plan a hands-on pasta session, online or at your office.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ce-company">Company</Label>
            <Input id="ce-company" value={form.company} onChange={set("company")} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ce-name">Your name</Label>
              <Input id="ce-name" value={form.name} onChange={set("name")} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ce-phone">Phone</Label>
              <Input id="ce-phone" type="tel" value={form.phone} onChange={set("phone")} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ce-email">Email</Label>
            <Input id="ce-email" type="email" value={form.email} onChange={set("email")} required />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ce-people">Team size</Label>
              <Input id="ce-people" inputMode="numeric" value={form.people} onChange={set("people")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ce-mode">Online or office</Label>
              <Input id="ce-mode" placeholder="Online" value={form.mode} onChange={set("mode")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ce-date">Preferred date</Label>
              <Input id="ce-date" type="date" value={form.date} onChange={set("date")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ce-message">Anything else?</Label>
            <Textarea id="ce-message" rows={3} value={form.message} onChange={set("message")} className="resize-none" />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" disabled={sending} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              "Send enquiry"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CorporateEnquiryModal;
