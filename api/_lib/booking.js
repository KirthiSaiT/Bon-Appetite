// Shared server-side helpers for workshop payments.
// Files under api/_lib are not exposed as routes by Vercel (leading underscore).
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
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

/**
 * Email the admin the full booking details, from the server (Gmail SMTP).
 * Needs SMTP_USER (a Gmail address) and SMTP_PASS (a Gmail App Password).
 * Goes to ADMIN_NOTIFY_EMAIL, defaulting to admin.bonappetit@gmail.com.
 * Best-effort: never throws. Returns true only if the mail was accepted.
 */
export async function emailAdmin({ subject, text }) {
  const to = process.env.ADMIN_NOTIFY_EMAIL || "admin.bonappetit@gmail.com";

  // Preferred: Resend (just an API key, no Gmail password). Until a domain is verified,
  // Resend only delivers to the email the Resend account was created with.
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Bon Appetit Bookings <onboarding@resend.dev>",
          to: [to],
          subject,
          text,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return true;
      console.error("[email] Resend responded", res.status, await res.text().catch(() => ""));
    } catch (err) {
      console.error("[email] Resend failed", err?.message);
    }
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.warn("[email] skipped: SMTP_USER / SMTP_PASS not set");
    return false;
  }
  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `"Bon Appetit Bookings" <${user}>`,
      to,
      subject,
      text,
    });
    return true;
  } catch (err) {
    console.error("[email] send failed", err?.message);
    return false;
  }
}

export const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
