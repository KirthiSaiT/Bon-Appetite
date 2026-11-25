// POST /api/verify-cart-payment — Vercel serverless function (Node).
// 1. Checks the Razorpay signature (HMAC_SHA256(order_id|payment_id, KEY_SECRET)).
// 2. Reads the order back FROM RAZORPAY and re-prices the submitted cart on the server: the amount paid
//    and the cart fingerprint saved in the order must both match, so a paid order can't be swapped.
// 3. Saves the paid order as a JSON file in the private "orders" bucket (one file per payment, so a
//    retried confirmation can't create a duplicate) and emails the admin the full order.
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer, items }
import crypto from "node:crypto";
import { emailAdmin, razorpayClient, readBody, supabaseAdmin } from "./_lib/booking.js";
import { cleanCustomer, loadPriceContext, priceCart } from "./_lib/catalog.js";
import { createShiprocketOrder, parcelFor, shiprocketConfigured } from "./_lib/delivery.js";

const BUCKET = "orders";

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const razorpay = razorpayClient();
  const db = supabaseAdmin();
  if (!keySecret || !razorpay || !db) {
    return res.status(503).json({ verified: false, saved: false, error: "Payment checks aren't configured on the server." });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items } = readBody(req);
  const customer = cleanCustomer(readBody(req).customer);
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ verified: false, saved: false, error: "Missing payment details." });
  }

  const expected = crypto.createHmac("sha256", keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (!safeEqual(expected, razorpay_signature)) {
    return res.status(400).json({ verified: false, saved: false, error: "Payment signature verification failed." });
  }

  // From here the payment is genuine. Never lose the reference if something below fails.
  const ref = { verified: true, payment_id: razorpay_payment_id };

  let order;
  try {
    order = await razorpay.orders.fetch(razorpay_order_id);
  } catch (err) {
    console.error("[verify-cart-payment] order fetch", err?.error?.description || err?.message);
    return res.status(502).json({ ...ref, saved: false });
  }
  if (order?.notes?.kind !== "shop") return res.status(400).json({ ...ref, saved: false });

  let priced;
  try {
    priced = priceCart(items, await loadPriceContext(db));
  } catch (err) {
    console.error("[verify-cart-payment] price lookup", err?.message);
    return res.status(500).json({ ...ref, saved: false });
  }
  const deliveryMode = order.notes.delivery_mode || "none";
  const deliveryFee = Number(order.notes.delivery_fee || 0);
  if (priced.error || priced.hash !== order.notes.cart || priced.totalPaise + deliveryFee * 100 !== Number(order.amount)) {
    console.error("[verify-cart-payment] cart does not match the paid order", razorpay_order_id, priced.error || "hash/amount");
    // The customer HAS paid, so keep the reference and let a human sort it out.
    await emailAdmin({
      subject: `CHECK: paid order ${razorpay_payment_id} did not match its cart`,
      text: `A payment was received but the cart could not be matched.\nPayment id: ${razorpay_payment_id}\nOrder id: ${razorpay_order_id}\nAmount: ₹${Number(order.amount) / 100}\nCustomer: ${order.notes.name} ${order.notes.phone}`,
    });
    return res.status(409).json({ ...ref, saved: false });
  }

  const record = {
    paid_at: new Date().toISOString(),
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id,
    amount_rupees: Number(order.amount) / 100,
    delivery: { mode: deliveryMode, fee_rupees: deliveryFee },
    customer,
    items: priced.lines,
  };

  let saved = false;
  const path = `${razorpay_payment_id}.json`;
  try {
    const { error: bucketError } = await db.storage.createBucket(BUCKET, { public: false });
    if (bucketError && !/already exists|duplicate/i.test(bucketError.message)) throw bucketError;
    const { error: uploadError } = await db.storage
      .from(BUCKET)
      .upload(path, JSON.stringify(record, null, 2), { contentType: "application/json", upsert: false });
    if (uploadError) {
      // Already stored: this is a retried confirmation. Succeed without a second email.
      if (/already exists|duplicate/i.test(uploadError.message)) {
        return res.status(200).json({ ...ref, saved: true, duplicate: true, amount: record.amount_rupees });
      }
      throw uploadError;
    }
    saved = true;
  } catch (err) {
    console.error("[verify-cart-payment] save", err?.message || err);
    // Not saved, but still email the admin below so the order is not lost.
  }

  // Couriered orders go to Shiprocket automatically. This runs only when the record was newly saved,
  // so a retried confirmation can't create a second shipment.
  let shipping = "";
  if (deliveryMode === "courier") {
    const parcel = parcelFor(priced.lines);
    shipping = "ACTION NEEDED: please create this shipment in Shiprocket by hand.";
    if (saved && parcel && shiprocketConfigured()) {
      try {
        const shipment = await createShiprocketOrder({
          reference: razorpay_payment_id,
          customer,
          lines: priced.lines,
          shippingRupees: deliveryFee,
          parcel,
        });
        record.shipment = shipment;
        shipping = `Shiprocket order created (shipment ${shipment.shipment_id}). Choose the courier in Shiprocket to book it.`;
        await db.storage.from(BUCKET).upload(path, JSON.stringify(record, null, 2), { contentType: "application/json", upsert: true });
      } catch (err) {
        console.error("[verify-cart-payment] shiprocket", err?.message);
        if (!record.shipment) shipping = "ACTION NEEDED: the Shiprocket order was NOT created. Please create it by hand.";
      }
    }
  }

  const itemLines = priced.lines
    .map((l, n) => `${n + 1}. ${l.name} x ${l.quantity} = ₹${(l.unit * l.quantity).toFixed(2)}`)
    .join("\n");
  const emailed = await emailAdmin({
    subject: `New PAID order · ₹${record.amount_rupees} · ${customer.name}`,
    replyTo: customer.email,
    text:
      `New PAID order\n\n${itemLines}\n\nDelivery: ₹${deliveryFee} (${deliveryMode})\nTotal paid: ₹${record.amount_rupees}\n\n${shipping ? shipping + "\n\n" : ""}` +
      `Name: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${customer.email}\n` +
      `Address: ${customer.address}, ${customer.city}, ${customer.state} ${customer.zip}\n` +
      (customer.notes ? `Notes: ${customer.notes}\n` : "") +
      `\nRazorpay payment id: ${razorpay_payment_id}\nRazorpay order id: ${razorpay_order_id}` +
      `\n\nAfter delivery, send the customer this rating link:\n${process.env.SITE_URL || "https://bon-appetit-hyd.vercel.app"}/rate?ref=${razorpay_payment_id}`,
  });

  return res.status(200).json({ ...ref, saved: true, emailed, amount: record.amount_rupees });
}
