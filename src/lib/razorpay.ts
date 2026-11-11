// Razorpay Standard Checkout helper.
// The browser only ever sees the publishable key id (VITE_RAZORPAY_KEY_ID);
// order creation and signature verification happen on the server (/api/*).

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;
export const razorpayConfigured = Boolean(RAZORPAY_KEY_ID);

export interface CreatedOrder {
  order_id: string;
  amount: number; // paise
  currency: string;
}

export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface Prefill {
  name?: string;
  email?: string;
  contact?: string;
}

// Minimal shape of the global injected by checkout.js.
interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (resp: { error: { description?: string } }) => void) => void;
}
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;

/** Inject checkout.js once; resolves when window.Razorpay is ready. */
export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay.")));
      if (window.Razorpay) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Razorpay. Check your connection and try again."));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export interface BookingRequest {
  workshop_id: string;
  people: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

/**
 * Ask the server to create an order for a workshop booking.
 * The server looks up the price itself; the amount is never sent from here.
 */
export async function createOrder(booking: BookingRequest): Promise<CreatedOrder> {
  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not start payment. Please try again.");
  return data as CreatedOrder;
}

export interface VerifyResult {
  /** The payment signature is genuine. */
  verified: boolean;
  /** The server recorded the paid booking. */
  saved: boolean;
  payment_id?: string;
  order_id?: string;
  ticket?: string;
}

/** Ask the server to verify the payment and record the booking. */
export async function verifyPayment(success: RazorpaySuccess): Promise<VerifyResult> {
  try {
    const res = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(success),
    });
    const data = await res.json().catch(() => ({}));
    return { ...data, verified: data.verified === true, saved: res.ok && data.saved === true };
  } catch {
    // Network drop after payment: the money may be taken, so keep the reference.
    return { verified: false, saved: false, payment_id: success.razorpay_payment_id };
  }
}

export class PaymentCancelled extends Error {
  constructor() {
    super("Payment was cancelled.");
    this.name = "PaymentCancelled";
  }
}

/**
 * Open the Razorpay modal for an existing order.
 * Resolves with the success payload, or rejects with PaymentCancelled on dismiss
 * / an Error with the gateway message on payment.failed.
 */
export function openCheckout(opts: {
  order: CreatedOrder;
  name: string;
  description: string;
  prefill?: Prefill;
}): Promise<RazorpaySuccess> {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) return reject(new Error("Razorpay is not ready yet."));

    let settled = false;
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      order_id: opts.order.order_id,
      amount: opts.order.amount,
      currency: opts.order.currency,
      name: opts.name,
      description: opts.description,
      prefill: opts.prefill,
      theme: { color: "#ea580c" }, // orange-600, matches the site
      handler: (response: RazorpaySuccess) => {
        settled = true;
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          if (!settled) reject(new PaymentCancelled());
        },
      },
    });

    rzp.on("payment.failed", (resp) => {
      settled = true;
      reject(new Error(resp?.error?.description || "Payment failed. Please try again."));
    });

    rzp.open();
  });
}
