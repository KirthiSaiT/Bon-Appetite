// Single source of truth for EmailJS. These are PUBLIC browser values (never put the
// EmailJS private key here). Override per environment with the VITE_EMAILJS_* vars.
export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_iv5ufkp";
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_f26rrnp";
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "7HeY8TYfNOquSNSYm";
