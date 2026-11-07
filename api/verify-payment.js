// POST /api/verify-payment — Vercel serverless function (Node).
// Confirms a Razorpay payment is genuine by recomputing the signature:
//   HMAC_SHA256(order_id + "|" + payment_id, KEY_SECRET) === razorpay_signature
// Only a request that passes this check should ever be treated as paid.
import crypto from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(401).json({ error: "Razorpay secret is not configured on the server." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      verified: false,
      error: "Missing razorpay_order_id, razorpay_payment_id or razorpay_signature.",
    });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (!timingSafeEqual(expected, razorpay_signature)) {
    // Signature mismatch — do NOT mark the booking as paid.
    return res.status(400).json({ verified: false, error: "Payment signature verification failed." });
  }

  return res.status(200).json({ verified: true, razorpay_payment_id, razorpay_order_id });
}

// Constant-time compare that won't throw on length mismatch.
function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
