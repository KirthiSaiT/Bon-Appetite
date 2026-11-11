// Shared server-side helpers for workshop payments.
// Files under api/_lib are not exposed as routes by Vercel (leading underscore).
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

export const GST_RATE = 0.18;

const round2 = (n) => Math.round(n * 100) / 100;

/** GST-inclusive total in paise for a per-person price × headcount. Mirrors workshopTotals() in the app. */
export function totalPaise(pricePerPerson, people) {
  const base = round2(Number(pricePerPerson) * people);
  const gst = round2(base * GST_RATE);
  return Math.round(round2(base + gst) * 100);
}

/** Razorpay client, or null when the server keys are missing. */
export function razorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  return key_id && key_secret ? new Razorpay({ key_id, key_secret }) : null;
}

/**
 * Supabase client with the server-only secret key. It bypasses row level security,
 * so it is the only thing allowed to record a paid booking.
 */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

/** Today's date in India as YYYY-MM-DD, so past workshops can't be booked. */
export function todayIST() {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Human-friendly ticket code from the payment id, e.g. "BA-7XP7X". Mirrors ticketCode() in the app. */
export function ticketCode(paymentId) {
  const tail = String(paymentId).replace(/[^a-zA-Z0-9]/g, "").slice(-5).toUpperCase();
  return `BA-${tail || "TICKET"}`;
}

export function readBody(req) {
  if (typeof req.body !== "string") return req.body || {};
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

export const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
