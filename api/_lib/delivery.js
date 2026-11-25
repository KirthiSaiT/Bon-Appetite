// Delivery charges, worked out on the server.
//
//  CAFE items   (hot food, desserts, fresh pasta, sauces) -> local delivery fee by road distance from the kitchen
//  COURIER items (dry pasta, pasta packs)                 -> Shiprocket live courier rate
//
// Each method is OFF until it is configured; while off, checkout behaves as before (no delivery charge).
//   Cafe:    GOOGLE_MAPS_API_KEY  (Routes API enabled). Optional KITCHEN_ADDRESS.
//   Courier: SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD (a Shiprocket *API user*), SHIPROCKET_PICKUP_PINCODE,
//            SHIPROCKET_PICKUP_LOCATION (the pickup nickname in Shiprocket), and PACKAGES below filled in.
// NOTE: Shiprocket's official API reference could not be read while writing this, so the request and response
// field names below must be confirmed against a real account before relying on them.

export const KITCHEN_ADDRESS =
  process.env.KITCHEN_ADDRESS || "8-1-284/OU/461, OU Colony, Shaikpet, Hyderabad, Telangana 500008, India";

/** ₹49 up to 3 km, ₹69 above 3 and up to 5 km, no delivery beyond 5 km. */
export const CAFE_BANDS = [
  { maxKm: 3, fee: 49 },
  { maxKm: 5, fee: 69 },
];

export const cafeFeeFor = (km) => CAFE_BANDS.find((b) => km <= b.maxKm)?.fee ?? null;

/**
 * Packed weight (kg) and box size (cm) of ONE unit, by product type and grams.
 * FILL THESE IN with real measurements; courier shipping stays off for any item left as null.
 * Example: "pack-100": { weight: 0.15, length: 20, breadth: 12, height: 5 },
 */
export const PACKAGES = {
  "pack-50": null,
  "pack-100": null,
  "pack-200": null,
  "dry-25": null,
  "dry-50": null,
  "dry-100": null,
  "dry-250": null,
  "dry-500": null,
};

export const isCourierItem = (id) => /^(pack-|dp0)/.test(String(id));

export function packageKey(line) {
  const pack = String(line.id).match(/^pack-[a-z]+-(\d+)$/);
  if (pack) return `pack-${pack[1]}`;
  const grams = String(line.name).match(/\((\d+)g\)/);
  return /^dp0/.test(String(line.id)) && grams ? `dry-${grams[1]}` : null;
}

export const cafeConfigured = () => Boolean(process.env.GOOGLE_MAPS_API_KEY);

export const shiprocketConfigured = () =>
  Boolean(
    process.env.SHIPROCKET_EMAIL &&
      process.env.SHIPROCKET_PASSWORD &&
      process.env.SHIPROCKET_PICKUP_PINCODE &&
      process.env.SHIPROCKET_PICKUP_LOCATION,
  );

/** One shipment for all the units: weights add up, boxes are stacked. Null if any item has no measurements. */
export function parcelFor(lines, packages = PACKAGES) {
  let weight = 0;
  let length = 0;
  let breadth = 0;
  let height = 0;
  for (const l of lines) {
    const p = packages[packageKey(l)];
    if (!p) return null;
    weight += p.weight * l.quantity;
    height += p.height * l.quantity;
    length = Math.max(length, p.length);
    breadth = Math.max(breadth, p.breadth);
  }
  return { weight: Math.round(weight * 1000) / 1000, length, breadth, height };
}

const timeout = () => AbortSignal.timeout(10000);

/* ── Google Routes API: road distance from the kitchen ── */
export async function roadDistanceKm(destination) {
  const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
      "X-Goog-FieldMask": "routes.distanceMeters",
    },
    body: JSON.stringify({
      origin: { address: KITCHEN_ADDRESS },
      destination: { address: destination },
      travelMode: "DRIVE",
    }),
    signal: timeout(),
  });
  if (!res.ok) throw new Error(`Routes API ${res.status}`);
  const data = await res.json();
  const meters = data?.routes?.[0]?.distanceMeters;
  return typeof meters === "number" ? meters / 1000 : null;
}

/* ── Shiprocket ── */
const SR = "https://apiv2.shiprocket.in/v1/external";
let cachedToken = null; // { value, expires }

export const resetShiprocketToken = () => {
  cachedToken = null;
};

async function shiprocketToken() {
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.value;
  const res = await fetch(`${SR}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }),
    signal: timeout(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) throw new Error(`Shiprocket login failed (${res.status})`);
  // Tokens last 10 days; refresh after 9.
  cachedToken = { value: data.token, expires: Date.now() + 9 * 24 * 3600 * 1000 };
  return data.token;
}

async function shiprocket(path, options = {}) {
  const token = await shiprocketToken();
  const res = await fetch(`${SR}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(options.headers || {}) },
    signal: timeout(),
  });
  if (res.status === 401) cachedToken = null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Shiprocket ${path.split("?")[0]} ${res.status}: ${data.message || ""}`);
  return data;
}

/** Cheapest courier for this parcel, or null if the PIN code isn't served. */
export async function shiprocketRate(deliveryPin, parcel) {
  const q = new URLSearchParams({
    pickup_postcode: process.env.SHIPROCKET_PICKUP_PINCODE,
    delivery_postcode: deliveryPin,
    weight: String(parcel.weight),
    length: String(parcel.length),
    breadth: String(parcel.breadth),
    height: String(parcel.height),
    cod: "0",
  });
  const data = await shiprocket(`/courier/serviceability/?${q}`);
  const options = (data?.data?.available_courier_companies || [])
    .map((c) => ({ rate: Number(c.rate ?? c.freight_charge), courier: c.courier_name, etd: c.etd || "" }))
    .filter((c) => Number.isFinite(c.rate) && c.rate > 0)
    .sort((a, b) => a.rate - b.rate);
  return options[0] || null;
}

/** Create the order in Shiprocket. The courier is then chosen and booked in the Shiprocket panel. */
export async function createShiprocketOrder({ reference, customer, lines, shippingRupees, parcel }) {
  const [first, ...rest] = customer.name.split(/\s+/);
  const data = await shiprocket("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify({
      order_id: reference,
      order_date: new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 16).replace("T", " "),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
      billing_customer_name: first,
      billing_last_name: rest.join(" "),
      billing_address: customer.address,
      billing_city: customer.city,
      billing_pincode: customer.zip,
      billing_state: customer.state,
      billing_country: "India",
      billing_email: customer.email,
      billing_phone: customer.phone.replace(/\D/g, "").slice(-10),
      shipping_is_billing: true,
      order_items: lines.map((l) => ({ name: l.name, sku: l.id.slice(0, 50), units: l.quantity, selling_price: l.unit })),
      payment_method: "Prepaid",
      shipping_charges: shippingRupees,
      sub_total: lines.reduce((s, l) => s + l.unit * l.quantity, 0),
      ...parcel,
    }),
  });
  if (!data.shipment_id) throw new Error(`Shiprocket did not return a shipment: ${data.message || "unknown response"}`);
  return { shiprocket_order_id: data.order_id, shipment_id: data.shipment_id };
}

export async function trackShipment(shipmentId) {
  const data = await shiprocket(`/courier/track/shipment/${encodeURIComponent(shipmentId)}`);
  const t = data?.tracking_data || {};
  const latest = t.shipment_track?.[0] || {};
  return {
    status: latest.current_status || null,
    courier: latest.courier_name || null,
    awb: latest.awb_code || null,
    url: typeof t.track_url === "string" && t.track_url.startsWith("https://") ? t.track_url : null,
  };
}

/**
 * The delivery charge for a priced cart.
 * → { mode: "none" | "cafe" | "courier", fee (rupees), label } or { error, status }
 */
export async function quoteDelivery(lines, customer, packages = PACKAGES) {
  const courier = lines.filter((l) => isCourierItem(l.id));
  const cafe = lines.filter((l) => !isCourierItem(l.id));
  const anyOn = cafeConfigured() || shiprocketConfigured();

  if (courier.length && cafe.length && anyOn) {
    return {
      status: 409,
      error: "Cafe food and couriered pasta are delivered differently. Please order them separately.",
    };
  }

  if (cafe.length && cafeConfigured()) {
    if (customer.address.length < 5 || !/^\d{6}$/.test(customer.zip)) {
      return { status: 400, error: "Enter your full address and 6-digit PIN code to see the delivery charge." };
    }
    const km = await roadDistanceKm(`${customer.address}, ${customer.city} ${customer.zip}, India`);
    if (km === null) return { status: 409, error: "We couldn't find that address. Please check it, or order on WhatsApp." };
    const fee = cafeFeeFor(km);
    if (fee === null) {
      return { status: 409, error: `Sorry, cafe delivery is available up to 5 km. Your address is about ${km.toFixed(1)} km away.` };
    }
    return { mode: "cafe", fee, label: `Delivery (${km.toFixed(1)} km)` };
  }

  if (courier.length && !cafe.length && shiprocketConfigured()) {
    const parcel = parcelFor(courier, packages);
    if (parcel) {
      if (!/^\d{6}$/.test(customer.zip)) return { status: 400, error: "Enter your 6-digit PIN code to see the shipping charge." };
      if (!customer.state) return { status: 400, error: "Enter your state to see the shipping charge." };
      const best = await shiprocketRate(customer.zip, parcel);
      if (!best) return { status: 409, error: "We can't courier to that PIN code yet. Please order on WhatsApp." };
      return {
        mode: "courier",
        fee: Math.ceil(best.rate),
        label: `Shipping via ${best.courier}${best.etd ? ` (expected ${best.etd})` : ""}`,
        parcel,
      };
    }
  }

  return { mode: "none", fee: 0, label: "Shipping" };
}
