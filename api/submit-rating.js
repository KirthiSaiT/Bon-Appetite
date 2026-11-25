// POST /api/submit-rating — saves a customer's rating for a paid order and emails the admin.
// Only someone with BOTH the payment reference and the order's phone number can rate, once per order.
// Body: { reference, phone, food, website, delivery, comment }   (omit the three scores to just look the order up)
//   → lookup: { order_id, order_type, rated }   → save: { saved: true }
import { clean, emailAdmin, readBody, supabaseAdmin } from "./_lib/booking.js";

const BUCKET = "orders";
const NOT_FOUND = "We couldn't find an order with that reference and phone number.";
const last10 = (v) => String(v || "").replace(/\D/g, "").slice(-10);
const score = (v) => (Number.isInteger(v) && v >= 1 && v <= 5 ? v : null);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const db = supabaseAdmin();
  if (!db) return res.status(503).json({ error: "Ratings aren't available right now." });

  const body = readBody(req);
  const reference = clean(body.reference, 60);
  const phone = last10(body.phone);
  if (!/^pay_[A-Za-z0-9]{6,40}$/.test(reference) || phone.length < 7) return res.status(400).json({ error: NOT_FOUND });

  const store = db.storage.from(BUCKET);
  const { data: blob } = await store.download(`${reference}.json`);
  if (!blob) return res.status(404).json({ error: NOT_FOUND });
  let order;
  try {
    order = JSON.parse(await blob.text());
  } catch {
    return res.status(404).json({ error: NOT_FOUND });
  }
  if (last10(order.customer?.phone) !== phone) return res.status(404).json({ error: NOT_FOUND });

  const ratingPath = `ratings/${reference}.json`;

  if (body.food === undefined && body.website === undefined && body.delivery === undefined) {
    const { data: existing } = await store.download(ratingPath);
    return res.status(200).json({
      order_id: reference.slice(-8).toUpperCase(),
      order_type: order.delivery?.mode === "courier" ? "Courier" : "Delivery",
      rated: Boolean(existing),
    });
  }

  const rating = { food: score(body.food), website: score(body.website), delivery: score(body.delivery) };
  if (!rating.food || !rating.website || !rating.delivery) {
    return res.status(400).json({ error: "Please give all three ratings." });
  }
  const comment = clean(body.comment, 1000);
  const record = { reference, rated_at: new Date().toISOString(), ...rating, comment, name: order.customer?.name };

  const { error: uploadError } = await store.upload(ratingPath, JSON.stringify(record, null, 2), {
    contentType: "application/json",
    upsert: false,
  });
  if (uploadError) {
    if (/already exists|duplicate/i.test(uploadError.message)) return res.status(409).json({ error: "You've already rated this order. Thank you!" });
    console.error("[submit-rating]", uploadError.message);
    return res.status(500).json({ error: "We couldn't save your rating. Please try again." });
  }

  const low = Math.min(rating.food, rating.website, rating.delivery) <= 3;
  await emailAdmin({
    subject: `${low ? "LOW rating" : "New rating"} · food ${rating.food}/5 · ${record.name || reference}`,
    text:
      `Food: ${rating.food}/5\nWebsite: ${rating.website}/5\nDelivery: ${rating.delivery}/5\n\n` +
      `Comment: ${comment || "-"}\n\nCustomer: ${record.name || "-"} (${order.customer?.phone || "-"})\nPayment reference: ${reference}`,
  });

  return res.status(200).json({ saved: true });
}
