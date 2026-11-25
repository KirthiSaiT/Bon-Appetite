// POST /api/delivery-quote — the delivery charge to SHOW before payment.
// create-cart-order works the charge out again, so this answer is never trusted for the amount.
// Body: { customer: { address, city, state, zip }, items } → { mode, fee, label }
import { readBody, supabaseAdmin } from "./_lib/booking.js";
import { cleanCustomer, loadPriceContext, priceCart } from "./_lib/catalog.js";
import { quoteDelivery } from "./_lib/delivery.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const db = supabaseAdmin();
  if (!db) return res.status(503).json({ error: "Delivery charges aren't available right now." });

  const body = readBody(req);
  try {
    const priced = priceCart(body.items, await loadPriceContext(db));
    if (priced.error) return res.status(priced.status).json({ error: priced.error });
    const quote = await quoteDelivery(priced.lines, cleanCustomer(body.customer));
    if (quote.error) return res.status(quote.status).json({ error: quote.error });
    return res.status(200).json({ mode: quote.mode, fee: quote.fee, label: quote.label });
  } catch (err) {
    console.error("[delivery-quote]", err?.message);
    return res.status(502).json({ error: "We couldn't calculate delivery just now. Please try again, or order on WhatsApp." });
  }
}
