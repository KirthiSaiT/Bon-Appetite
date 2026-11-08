# Workshop booking emails — admin notification + customer ticket

When a workshop payment succeeds, the app sends **two** emails (code in
`src/lib/email.ts`, triggered from `src/components/WorkshopBookingModal.tsx`):

1. **Admin notification** → `admin.bonappetit@gmail.com` — who booked, workshop,
   guests, amount paid, Razorpay payment id, and the ticket code.
2. **Customer ticket** → the email the customer entered — a booking reference
   (e.g. `BA-7XP7X`) plus a **QR code** to scan at check-in.

Both go through EmailJS (service `service_0ngsn9l`, public key `lBQ8UpD7SH9b45AVq`).

---

## It already works with your current template

With no changes, both emails send using your existing template (`template_rdzt2i6`).
The ticket code and a QR **link** are included in the plain-text `message`, so the
customer always gets their ticket. Two things to verify once:

- **Customer actually receives their copy.** In EmailJS → Email Templates →
  `template_rdzt2i6`, the **To Email** field must be `{{to_email}}` (a variable),
  not a hardcoded admin address. Otherwise both emails land in the admin inbox.
- Do a test booking with a real email and confirm it arrives.

---

## Recommended: a dedicated ticket template (renders the QR as an image)

For a proper visual ticket (QR shown as an image, not a link):

1. EmailJS dashboard → **Email Templates → Create New Template**.
2. Set **To Email** = `{{to_email}}`, **Subject** = `{{subject}}`,
   **Reply To** = `{{reply_to}}`.
3. Paste the HTML below into the **content** (switch the editor to “Code”/HTML).
4. Save, copy the new **Template ID** (looks like `template_xxxxxxx`).
5. Add it to Vercel **and** `.env.local` as:
   `VITE_EMAILJS_TICKET_TEMPLATE_ID=template_xxxxxxx`
6. Redeploy. The customer ticket now uses this template; the admin mail keeps
   using the order template.

### Ticket HTML (paste into the new template)

```html
<div style="max-width:480px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1c1917;">
  <div style="background:#ea580c;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.85;">Bon Appetit · Pasta Workshop</div>
    <div style="font-size:22px;font-weight:bold;margin-top:4px;">Your Ticket</div>
  </div>
  <div style="border:1px solid #e7e5e4;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <div style="text-align:center;margin-bottom:20px;">
      <div style="font-size:12px;color:#9a3412;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Ticket code</div>
      <div style="font-size:30px;font-weight:bold;color:#ea580c;letter-spacing:2px;">{{ticket_code}}</div>
      <img src="{{ticket_qr}}" alt="Check-in QR" width="200" height="200" style="margin-top:12px;border:1px solid #e7e5e4;border-radius:8px;" />
      <div style="font-size:12px;color:#78716c;margin-top:6px;">Show this QR at check-in</div>
    </div>
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#78716c;">Guest</td><td style="padding:6px 0;text-align:right;font-weight:bold;">{{customer_name}}</td></tr>
      <tr><td style="padding:6px 0;color:#78716c;">Workshop</td><td style="padding:6px 0;text-align:right;font-weight:bold;">{{workshop_title}}</td></tr>
      <tr><td style="padding:6px 0;color:#78716c;">Date</td><td style="padding:6px 0;text-align:right;">{{workshop_date}}</td></tr>
      <tr><td style="padding:6px 0;color:#78716c;">Time</td><td style="padding:6px 0;text-align:right;">{{workshop_time}}</td></tr>
      <tr><td style="padding:6px 0;color:#78716c;">Venue</td><td style="padding:6px 0;text-align:right;">{{workshop_venue}}</td></tr>
      <tr><td style="padding:6px 0;color:#78716c;">Guests</td><td style="padding:6px 0;text-align:right;">{{guests}}</td></tr>
      <tr><td style="padding:6px 0;color:#78716c;">Amount paid</td><td style="padding:6px 0;text-align:right;font-weight:bold;">{{amount_paid}}</td></tr>
      <tr><td style="padding:6px 0;color:#78716c;">Payment ref</td><td style="padding:6px 0;text-align:right;font-size:12px;">{{payment_id}}</td></tr>
    </table>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e7e5e4;font-size:13px;color:#78716c;">
      We'll contact you on {{customer_phone}} with joining details. See you there!
    </div>
  </div>
</div>
```

### Template variables the app sends to the ticket template

`ticket_code`, `ticket_qr`, `workshop_title`, `workshop_date`, `workshop_time`,
`workshop_venue`, `guests`, `amount_paid`, `payment_id`, `customer_name`,
`customer_phone`, plus `to_email`, `subject`, `reply_to`, `message`.

---

## Check-in at the door

The QR encodes: `BON-APPETIT-TICKET | <code> | <name> | <workshop> | <date> | <guests> | <payment_id>`.
Scan it (any QR reader) and match the code / name against **Admin → Bookings**,
where the same payment id is shown with a green **Paid** badge.
