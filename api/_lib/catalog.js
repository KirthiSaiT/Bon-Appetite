// Server-side price book for shop orders.
// The browser sends the cart, but the AMOUNT CHARGED is always worked out here from the item ids,
// so nobody can pay less by editing prices in their browser. Prices that the admin edits live in the
// Supabase "prices" table (fresh.*, sauce.*, dessert.*, combo.*, extra.*, pack.*) and the "cafe_pastas"
// table; the rest are the fixed menu prices below (keep them in step with the menu pages).
import crypto from "node:crypto";
import { clean } from "./booking.js";

const cents = (n) => Math.round(Number(n) * 100);

const FRESH_DEFAULT = { 25: 30, 50: 60, 100: 100, 250: 250 };
const DRY_BY_GRAMS = { 25: 30, 50: 60, 100: 100, 250: 250, 500: 500 };
const SAUCE_DEFAULT = { s009: 150, s010: 150, s011: 180 };
const SAUCE_ML = [100, 200, 300, 500];
const DESSERT_DEFAULT = { d001: 100, d002: 120, d003: 90, d004: 40, d005: 50 };
const COMBO_DEFAULT = { standard: 250, ravioli: 300, sauce: 70, cheese: 50 };
// Unit price × the quantity picked on the page (1–10 each)
const MENU_UNIT = {
  gs001: 120, gs002: 100, gs003: 150, gs004: 110, gs005: 140, gs006: 130, gs007: 135, gs008: 145, gs009: 90, gs010: 160,
  fsb001: 280, fsb002: 320, fsb003: 350,
  hcm001: 400, hcm002: 380, hcm003: 450,
};
const CAFE_FALLBACK = { "fallback-fettucine": 250, "fallback-spaghetti": 250, "fallback-ravioli": 250 };

export const MAX_LINES = 40;
export const MAX_TOTAL_RUPEES = 100000;

/** Load the admin-editable prices once per request. */
export async function loadPriceContext(db) {
  const prices = new Map();
  const cafe = new Map();
  const { data: rows } = await db.from("prices").select("key, amount");
  for (const r of rows || []) prices.set(r.key, Number(r.amount));
  const { data: pastas } = await db.from("cafe_pastas").select("id, price, is_active");
  for (const p of pastas || []) if (p.is_active !== false) cafe.set(String(p.id), Number(p.price));
  return { prices, cafe };
}

const dbOr = (ctx, key, fallback) => (ctx.prices.has(key) ? ctx.prices.get(key) : fallback);

/** Expected price of ONE unit of a cart line (what the page showed), or { error }. */
export function unitPrice(item, ctx) {
  const id = String(item.id || "");
  const name = String(item.name || "");
  let m;

  if ((m = id.match(/^pack-(plain|spinach|beetroot)-(50|100|200)$/))) {
    const p = ctx.prices.get(`pack.${m[1]}.${m[2]}`);
    return p > 0 ? { price: p } : { error: "This pack isn't available to order online yet." };
  }
  if ((m = id.match(/^fp00[1-7]-(.{1,40})-(25|50|100|250)$/))) {
    return { price: dbOr(ctx, `fresh.${m[2]}`, FRESH_DEFAULT[m[2]]) };
  }
  if (/^dp00[2-7]-/.test(id)) {
    const g = name.match(/\((25|50|100|250|500)g\)/);
    return g ? { price: DRY_BY_GRAMS[g[1]] } : { error: "Unknown dry pasta weight." };
  }
  if ((m = id.match(/^(s009|s010|s011)-(100|200|300|500)$/))) {
    const per200 = dbOr(ctx, `sauce.${m[1]}`, SAUCE_DEFAULT[m[1]]);
    return SAUCE_ML.includes(Number(m[2])) ? { price: Math.round(((per200 * Number(m[2])) / 200) * 100) / 100 } : { error: "Unknown size." };
  }
  if ((m = id.match(/^combo-(standard|ravioli)-.*-(none|Extra Sauce|Extra Cheese|Extra Sauce, Extra Cheese)$/))) {
    const base = dbOr(ctx, `combo.${m[1]}`, COMBO_DEFAULT[m[1]]);
    const extras =
      (m[2].includes("Extra Sauce") ? dbOr(ctx, "extra.sauce", COMBO_DEFAULT.sauce) : 0) +
      (m[2].includes("Extra Cheese") ? dbOr(ctx, "extra.cheese", COMBO_DEFAULT.cheese) : 0);
    return { price: base + extras };
  }
  if ((m = id.match(/^(d00[1-5])-(\d{1,2})$/))) {
    const qty = Number(m[2]);
    return qty >= 1 ? { price: Math.round(dbOr(ctx, `dessert.${m[1]}`, DESSERT_DEFAULT[m[1]]) * qty * 100) / 100 } : { error: "Bad quantity." };
  }
  if ((m = id.match(/^(gs\d{3}|fsb\d{3}|hcm\d{3})-(\d{1,2})$/))) {
    const unit = MENU_UNIT[m[1]];
    const qty = Number(m[2]);
    return unit && qty >= 1 && qty <= 10 ? { price: unit * qty } : { error: "Unknown menu item." };
  }
  if ((m = id.match(/^cafe-(.+)$/))) {
    const p = ctx.cafe.has(m[1]) ? ctx.cafe.get(m[1]) : CAFE_FALLBACK[m[1]];
    return p > 0 ? { price: p } : { error: "This item is no longer available." };
  }
  return { error: `"${name || id}" can't be ordered online.` };
}

/**
 * Price a whole cart. Returns { lines, totalPaise, hash } or { error, status }.
 * Rejects a line whose price differs from the real one, so the customer is never charged a surprise.
 */
export function priceCart(items, ctx) {
  if (!Array.isArray(items) || items.length === 0) return { status: 400, error: "Your cart is empty." };
  if (items.length > MAX_LINES) return { status: 400, error: "Too many items in one order." };

  const lines = [];
  let totalCents = 0;
  for (const it of items) {
    const qty = Number(it?.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) return { status: 400, error: "Invalid quantity in your cart." };
    const r = unitPrice(it, ctx);
    if (r.error) return { status: 409, error: r.error };
    if (Math.abs(cents(it.price) - cents(r.price)) > 0) {
      return { status: 409, error: `The price of "${String(it.name).slice(0, 60)}" has changed. Please remove it and add it again.` };
    }
    totalCents += cents(r.price) * qty;
    lines.push({ id: String(it.id), name: String(it.name).slice(0, 120), quantity: qty, unit: r.price });
  }
  if (totalCents < 100) return { status: 400, error: "The order total is too small." };
  if (totalCents > MAX_TOTAL_RUPEES * 100) return { status: 400, error: "This order is too large to pay online. Please contact us." };

  // A fingerprint of exactly what was priced, so the paid order can't be swapped for another cart afterwards.
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(lines.map((l) => [l.id, l.quantity, cents(l.unit)]).sort()))
    .digest("hex")
    .slice(0, 40);
  return { lines, totalPaise: totalCents, hash };
}

export const cleanCustomer = (c = {}) => ({
  name: clean(c.name, 120),
  email: clean(c.email, 120),
  phone: clean(c.phone, 20),
  address: clean(c.address, 300),
  city: clean(c.city, 80),
  zip: clean(c.zip, 12),
  notes: clean(c.notes, 400),
});

export const customerError = (c) => {
  if (c.name.length < 2) return "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return "Please enter a valid email address.";
  if (c.phone.replace(/\D/g, "").length < 7) return "Please enter a valid phone number.";
  if (c.address.length < 5 || c.city.length < 2 || c.zip.length < 3) return "Please fill in your full delivery address.";
  return null;
};
