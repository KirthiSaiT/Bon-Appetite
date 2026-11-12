// Workshop booking emails via EmailJS.
// - Admin gets an order notification (to admin.bonappetit@gmail.com).
// - Customer gets a TICKET: a booking reference + a scannable QR code for check-in.
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_z4w0fmg";
const PUBLIC_KEY = "lBQ8UpD7SH9b45AVq";

// Admin notification uses the existing order template.
const ADMIN_TEMPLATE_ID = "template_rdzt2i6";
// Customer ticket template. Falls back to the admin template until a dedicated
// ticket template is created in the EmailJS dashboard (see TICKET-EMAIL-SETUP.md).
const TICKET_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TICKET_TEMPLATE_ID || "template_rdzt2i6";

export const ADMIN_BOOKING_EMAIL = "admin.bonappetit@gmail.com";

export interface BookingEmailData {
  workshopTitle: string;
  dateLabel: string; // e.g. "Saturday, 21 November 2026"
  timeLabel: string;
  venue: string;
  name: string;
  phone: string;
  email: string; // customer email (may be empty)
  people: number;
  amount: number; // total paid, rupees (incl. GST)
  notes: string;
  paymentId: string;
  orderId: string;
}

/** Human-friendly, deterministic ticket code from the (unique) payment id, e.g. "BA-7XP7X". */
export function ticketCode(paymentId: string): string {
  const tail = paymentId.replace(/[^a-zA-Z0-9]/g, "").slice(-5).toUpperCase();
  return `BA-${tail || "TICKET"}`;
}

/** A QR image URL (no dependency) encoding a check-in payload the admin can scan at the door. */
function ticketQrUrl(d: BookingEmailData, code: string): string {
  const payload = [
    "BON-APPETIT-TICKET",
    code,
    d.name,
    d.workshopTitle,
    d.dateLabel,
    `${d.people} guest(s)`,
    d.paymentId,
  ].join(" | ");
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(payload)}`;
}

/** Send one email via EmailJS. Extra vars let a ticket template render the QR/code. */
function sendTo(
  templateId: string,
  recipient: string,
  toName: string,
  subject: string,
  message: string,
  replyTo: string,
  extra: Record<string, string> = {},
) {
  const params = {
    to_email: recipient,
    email: recipient,
    user_email: recipient,
    to_name: toName,
    from_name: "Bon Appetit",
    reply_to: replyTo || ADMIN_BOOKING_EMAIL,
    subject,
    message,
    ...extra,
  };
  return emailjs.send(SERVICE_ID, templateId, params, PUBLIC_KEY);
}

/**
 * Fire the admin notification + customer ticket for a paid workshop booking.
 * Never throws — email problems must not undo a successful, paid booking.
 * Returns which sends succeeded.
 */
export async function sendWorkshopBookingEmails(d: BookingEmailData): Promise<{ admin: boolean; customer: boolean }> {
  const code = ticketCode(d.paymentId);
  const qr = ticketQrUrl(d, code);
  const amount = `₹${d.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  // ── Admin: order notification ──
  const adminMsg =
    `New PAID workshop booking\n\n` +
    `Ticket: ${code}\n` +
    `Workshop: ${d.workshopTitle}\n` +
    `Date: ${d.dateLabel} · ${d.timeLabel}\n` +
    `Venue: ${d.venue}\n\n` +
    `Name: ${d.name}\n` +
    `Phone: ${d.phone}\n` +
    `Email: ${d.email || "—"}\n` +
    `Guests: ${d.people}\n` +
    (d.notes ? `Notes: ${d.notes}\n` : "") +
    `\nAmount paid: ${amount} (incl. 18% GST)\n` +
    `Razorpay payment id: ${d.paymentId}\n` +
    `Razorpay order id: ${d.orderId}`;

  // ── Customer: the ticket ──
  const customerMsg =
    `Hi ${d.name}, your spot is confirmed! 🎉\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `  YOUR TICKET: ${code}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Workshop: ${d.workshopTitle}\n` +
    `Date: ${d.dateLabel}\n` +
    `Time: ${d.timeLabel}\n` +
    `Venue: ${d.venue}\n` +
    `Guests: ${d.people}\n` +
    `Amount paid: ${amount} (incl. 18% GST)\n` +
    `Payment reference: ${d.paymentId}\n\n` +
    `Show this ticket (code ${code}) or the QR in your email at check-in.\n` +
    `QR: ${qr}\n\n` +
    `We'll also reach out on ${d.phone} with joining details. See you there!\n\n— Bon Appetit`;

  // Structured vars so a ticket HTML template can render a proper ticket + QR image.
  const ticketVars: Record<string, string> = {
    ticket_code: code,
    ticket_qr: qr,
    workshop_title: d.workshopTitle,
    workshop_date: d.dateLabel,
    workshop_time: d.timeLabel,
    workshop_venue: d.venue,
    guests: String(d.people),
    amount_paid: `${amount} (incl. 18% GST)`,
    payment_id: d.paymentId,
    customer_name: d.name,
    customer_phone: d.phone,
  };

  const results = await Promise.allSettled([
    sendTo(ADMIN_TEMPLATE_ID, ADMIN_BOOKING_EMAIL, "Bon Appetit Admin", `New booking ${code} · ${d.workshopTitle}`, adminMsg, d.email, {
      ticket_code: code,
    }),
    d.email
      ? sendTo(TICKET_TEMPLATE_ID, d.email, d.name, `🎟️ Your ticket ${code} · ${d.workshopTitle}`, customerMsg, ADMIN_BOOKING_EMAIL, ticketVars)
      : Promise.reject(new Error("no customer email")),
  ]);

  return {
    admin: results[0].status === "fulfilled",
    customer: results[1].status === "fulfilled",
  };
}
