// POST /api/create-cart-order — Vercel serverless function (Node).
// Creates a Razorpay order for the shopping cart. The amount is worked out HERE from the item ids
// (api/_lib/catalog.js); the browser's prices are only checked against it, never used.
// Body: { customer: { name, email, phone, address, city, zip, notes }, items: [{ id, name, price, quantity }] }
//   → { order_id, amount, currency }
import { razorpayClient, readBody, supabaseAdmin } from "./_lib/booking.js";
import { cleanCustomer, customerError, loadPriceContext, priceCart } from "./_lib/catalog.js";
import { quoteDelivery } from "./_lib/delivery.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const razorpay = razorpayClient();
  const db = supabaseAdmin();
  if (!razorpay || !db) {
    console.error("[create-cart-order] missing", !razorpay ? "Razorpay keys" : "SUPABASE_SECRET_KEY");
    return res.status(503).json({ error: "Online payment isn't available right now. Please order on WhatsApp." });
  }

  const body = readBody(req);
  const customer = cleanCustomer(body.customer);
  const problem = customerError(customer);
  if (problem) return res.status(400).json({ error: problem });

  let priced;
  try {
    priced = priceCart(body.items, await loadPriceContext(db));
  } catch (err) {
    console.error("[create-cart-order] price lookup", err?.message);
    return res.status(500).json({ error: "Could not check prices. Please try again." });
  }
  if (priced.error) return res.status(priced.status).json({ error: priced.error });

  // The delivery charge is worked out again here, and must match what the customer was shown.
  let delivery;
  try {
    delivery = await quoteDelivery(priced.lines, customer);
  } catch (err) {
    console.error("[create-cart-order] delivery", err?.message);
    return res.status(502).json({ error: "We couldn't calculate delivery just now. Please try again, or order on WhatsApp." });
  }
  if (delivery.error) return res.status(delivery.status).json({ error: delivery.error });
  if (Number(body.delivery_fee || 0) !== delivery.fee) {
    return res.status(409).json({ error: `The delivery charge is now ₹${delivery.fee}. Please check the new total and pay again.`, delivery_fee: delivery.fee });
  }

  try {
    const order = await razorpay.orders.create({
      amount: priced.totalPaise + delivery.fee * 100,
      currency: "INR",
      receipt: `shop_${Date.now()}`.slice(0, 40),
      notes: {
        kind: "shop",
        cart: priced.hash,
        name: customer.name.slice(0, 60),
        phone: customer.phone,
        // Set by the server, so verify-cart-payment can trust them
        delivery_mode: delivery.mode,
        delivery_fee: String(delivery.fee),
      },
    });
    return res.status(200).json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("[create-cart-order]", err?.error?.description || err?.message);
    return res.status(500).json({ error: "Could not start payment. Please try again." });
  }
}
