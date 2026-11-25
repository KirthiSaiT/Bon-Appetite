// POST /api/track-order — order and shipment status for a customer.
// They must give BOTH the payment reference and the phone number used on the order; nothing personal is returned.
// Body: { reference, phone } → { found, paid_at, amount, delivery, status, courier, awb, url }
import { clean, readBody, supabaseAdmin } from "./_lib/booking.js";
import { shiprocketConfigured, trackShipment } from "./_lib/delivery.js";

const last10 = (v) => String(v || "").replace(/\D/g, "").slice(-10);
const NOT_FOUND = "We couldn't find an order with that reference and phone number.";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const db = supabaseAdmin();
  if (!db) return res.status(503).json({ error: "Order tracking isn't available right now." });

  const body = readBody(req);
  const reference = clean(body.reference, 60);
  const phone = last10(body.phone);
  if (!/^pay_[A-Za-z0-9]{6,40}$/.test(reference) || phone.length < 7) return res.status(400).json({ error: NOT_FOUND });

  const { data: blob } = await db.storage.from("orders").download(`${reference}.json`);
  if (!blob) return res.status(404).json({ error: NOT_FOUND });
  let record;
  try {
    record = JSON.parse(await blob.text());
  } catch {
    return res.status(404).json({ error: NOT_FOUND });
  }
  if (last10(record.customer?.phone) !== phone) return res.status(404).json({ error: NOT_FOUND });

  const out = { found: true, paid_at: record.paid_at, amount: record.amount_rupees, delivery: record.delivery?.mode || "none" };
  if (record.shipment?.shipment_id && shiprocketConfigured()) {
    try {
      Object.assign(out, await trackShipment(record.shipment.shipment_id));
    } catch (err) {
      console.error("[track-order]", err?.message);
    }
  }
  return res.status(200).json(out);
}
