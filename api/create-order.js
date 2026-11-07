// POST /api/create-order — Vercel serverless function (Node).
// Creates a Razorpay order so the browser can open Checkout with a real order_id.
// Keys live in server-only env vars (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET);
// the secret never reaches the browser.
import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(401).json({ error: "Razorpay keys are not configured on the server." });
  }

  // Vercel parses JSON bodies automatically; be defensive if it arrives as a string.
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const amount = Number(body.amount);
  const currency = typeof body.currency === "string" ? body.currency : "INR";
  const receipt = typeof body.receipt === "string" ? body.receipt.slice(0, 40) : `rcpt_${Date.now()}`;

  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < 100) {
    return res.status(400).json({ error: "amount must be an integer of at least 100 paise (₹1)." });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({ amount, currency, receipt });
    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    const status = err?.statusCode === 401 ? 401 : 500;
    const message = err?.error?.description || err?.message || "Could not create the Razorpay order.";
    console.error("[create-order]", message);
    return res.status(status).json({ error: message });
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
