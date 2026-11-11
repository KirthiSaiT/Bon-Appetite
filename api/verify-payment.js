// POST /api/verify-payment — Vercel serverless function (Node).
// 1. Confirms the payment is genuine:
//      HMAC_SHA256(order_id + "|" + payment_id, KEY_SECRET) === razorpay_signature
// 2. Reads the order back FROM RAZORPAY (amount + booking notes we set in create-order),
//    so nothing the browser sends after payment can change the booking.
// 3. Saves the paid booking with the server-only Supabase key. The public key is not
//    allowed to insert paid bookings, so this is the only way one can exist.
// Calling it twice for the same payment returns the same booking (no duplicates).
import crypto from "node:crypto";
import { razorpayClient, readBody, supabaseAdmin, ticketCode } from "./_lib/booking.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const razorpay = razorpayClient();
  const db = supabaseAdmin();
  if (!keySecret || !razorpay || !db) {
    return res.status(503).json({ verified: false, error: "Payment checks aren't configured on the server." });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = readBody(req);
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ verified: false, error: "Missing payment details." });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (!timingSafeEqual(expected, razorpay_signature)) {
    return res.status(400).json({ verified: false, error: "Payment signature verification failed." });
  }

  // The signature is genuine. Everything below comes from Razorpay or our own database.
  const paymentRef = { payment_id: razorpay_payment_id };
  let order;
  try {
    order = await razorpay.orders.fetch(razorpay_order_id);
  } catch (err) {
    console.error("[verify-payment] order fetch", err?.error?.description || err?.message);
    return res.status(502).json({ verified: true, saved: false, ...paymentRef });
  }

  const n = order.notes || {};
  const people = Number(n.people);
  if (!n.workshop_id || !Number.isInteger(people) || people < 1) {
    console.error("[verify-payment] order has no booking notes", razorpay_order_id);
    return res.status(400).json({ verified: true, saved: false, ...paymentRef });
  }

  const { data: workshop } = await db
    .from("workshops")
    .select("id, title, workshop_date")
    .eq("id", n.workshop_id)
    .maybeSingle();
  if (!workshop) {
    console.error("[verify-payment] workshop missing", n.workshop_id);
    return res.status(500).json({ verified: true, saved: false, ...paymentRef });
  }

  const { error: insertError } = await db.from("workshop_bookings").insert({
    workshop_id: workshop.id,
    workshop_title: workshop.title,
    workshop_date: workshop.workshop_date,
    name: n.name,
    phone: n.phone,
    email: n.email || null,
    people,
    notes: n.notes || null,
    amount: order.amount / 100,
    paid: true,
    razorpay_order_id,
    razorpay_payment_id,
  });

  // 23505 = unique violation: this payment was already recorded. Treat as success.
  if (insertError && insertError.code !== "23505") {
    console.error("[verify-payment] insert", insertError.message);
    return res.status(500).json({ verified: true, saved: false, ...paymentRef });
  }

  return res.status(200).json({
    verified: true,
    saved: true,
    ...paymentRef,
    order_id: razorpay_order_id,
    ticket: ticketCode(razorpay_payment_id),
    amount: order.amount / 100,
    people,
  });
}

// Constant-time compare that won't throw on length mismatch.
function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
