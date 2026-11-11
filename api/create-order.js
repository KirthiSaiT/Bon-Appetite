// POST /api/create-order — Vercel serverless function (Node).
// Creates a Razorpay order for a workshop booking. The PRICE IS LOOKED UP HERE from
// the workshops table — the browser only says which workshop and how many people,
// so it can't change what gets charged. The booking details ride along in the
// order's notes, which the browser can't edit once the order exists.
import { clean, razorpayClient, readBody, supabaseAdmin, todayIST, totalPaise } from "./_lib/booking.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const razorpay = razorpayClient();
  const db = supabaseAdmin();
  // Refuse before taking any money if we couldn't record the booking afterwards.
  if (!razorpay || !db) {
    console.error("[create-order] missing", !razorpay ? "Razorpay keys" : "SUPABASE_SECRET_KEY");
    return res.status(503).json({ error: "Online payment isn't available right now. Please contact us to book." });
  }

  const body = readBody(req);
  const workshopId = clean(body.workshop_id, 64);
  const people = Number(body.people);
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 20);
  const email = clean(body.email, 120);
  const notes = clean(body.notes, 250);

  if (!workshopId) return res.status(400).json({ error: "Please pick a workshop." });
  if (!Number.isInteger(people) || people < 1 || people > 20) {
    return res.status(400).json({ error: "Number of people must be between 1 and 20." });
  }
  if (!name || phone.length < 6) {
    return res.status(400).json({ error: "Please fill in your name and phone number." });
  }

  const { data: workshop, error: wsError } = await db
    .from("workshops")
    .select("id, title, workshop_date, price, is_active")
    .eq("id", workshopId)
    .maybeSingle();

  if (wsError) {
    console.error("[create-order] workshop lookup", wsError.message);
    return res.status(500).json({ error: "Could not load this workshop. Please try again." });
  }
  if (!workshop || !workshop.is_active || workshop.workshop_date < todayIST()) {
    return res.status(400).json({ error: "This workshop is no longer open for booking." });
  }

  const amount = totalPaise(workshop.price, people);
  if (amount < 100) {
    return res.status(400).json({ error: "This workshop's price is not set correctly. Please contact us to book." });
  }

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `ws_${workshop.id.slice(0, 8)}_${Date.now()}`.slice(0, 40),
      notes: { workshop_id: workshop.id, people: String(people), name, phone, email, notes },
    });
    return res.status(200).json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    const message = err?.error?.description || err?.message || "Could not create the Razorpay order.";
    console.error("[create-order]", message);
    return res.status(500).json({ error: "Could not start payment. Please try again." });
  }
}
