// Workshop booking emails via EmailJS (same service/template the order flow uses).
// Sends a confirmation to the customer and a notification to the admin.
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_0ngsn9l";
const TEMPLATE_ID = "template_rdzt2i6";
const PUBLIC_KEY = "lBQ8UpD7SH9b45AVq";

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

/**
 * Send one email to a single recipient through the shared template.
 * Recipient is placed under several common variable names so it routes
 * regardless of which one the EmailJS template's "To Email" field uses.
 */
function sendTo(recipient: string, toName: string, subject: string, message: string, replyTo: string) {
  const params = {
    to_email: recipient,
    email: recipient,
    user_email: recipient,
    to_name: toName,
    from_name: "Bon Appetit",
    reply_to: replyTo || ADMIN_BOOKING_EMAIL,
    subject,
    message,
  };
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
}

/**
 * Fire the customer + admin emails for a paid workshop booking.
 * Never throws — email problems must not undo a successful, paid booking.
 * Returns which sends succeeded so the caller can log/inform.
 */
export async function sendWorkshopBookingEmails(d: BookingEmailData): Promise<{ admin: boolean; customer: boolean }> {
  const adminMsg =
    `New PAID workshop booking\n\n` +
    `Workshop: ${d.workshopTitle}\n` +
    `Date: ${d.dateLabel} · ${d.timeLabel}\n` +
    `Venue: ${d.venue}\n\n` +
    `Name: ${d.name}\n` +
    `Phone: ${d.phone}\n` +
    `Email: ${d.email || "—"}\n` +
    `Guests: ${d.people}\n` +
    (d.notes ? `Notes: ${d.notes}\n` : "") +
    `\nAmount paid: ₹${d.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (incl. 18% GST)\n` +
    `Razorpay payment id: ${d.paymentId}\n` +
    `Razorpay order id: ${d.orderId}`;

  const customerMsg =
    `Hi ${d.name}, your spot is confirmed! 🎉\n\n` +
    `Thanks for booking a Bon Appetit pasta workshop. Here are your details:\n\n` +
    `Workshop: ${d.workshopTitle}\n` +
    `Date: ${d.dateLabel}\n` +
    `Time: ${d.timeLabel}\n` +
    `Venue: ${d.venue}\n` +
    `Guests: ${d.people}\n` +
    `Amount paid: ₹${d.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (incl. 18% GST)\n` +
    `Payment reference: ${d.paymentId}\n\n` +
    `We'll reach out on ${d.phone} with joining details. See you there!\n\n— Bon Appetit`;

  const results = await Promise.allSettled([
    sendTo(ADMIN_BOOKING_EMAIL, "Bon Appetit Admin", `New booking · ${d.workshopTitle}`, adminMsg, d.email),
    d.email
      ? sendTo(d.email, d.name, `Booking confirmed · ${d.workshopTitle}`, customerMsg, ADMIN_BOOKING_EMAIL)
      : Promise.reject(new Error("no customer email")),
  ]);

  return {
    admin: results[0].status === "fulfilled",
    customer: results[1].status === "fulfilled",
  };
}
