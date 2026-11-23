// POST /api/submit-application — Vercel serverless function (Node).
// Emails a job application to the admin WITH THE RESUME ATTACHED.
// The browser has already uploaded the CV to the "resumes" bucket (via /api/resume-upload);
// here the server downloads that exact file and attaches it, so the file size is not limited by
// the request body. Replies go straight to the applicant.
// Body: { path, role, name, email, phone, linkedin, message }  →  { emailed: boolean }
import { clean, emailAdmin, readBody, supabaseAdmin } from "./_lib/booking.js";

const BUCKET = "resumes";
const MAX_BYTES = 5 * 1024 * 1024;
// <uuid>/<name>.<ext>, exactly the shape /api/resume-upload hands out
const PATH_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[A-Za-z0-9_-]{1,60}\.(pdf|doc|docx)$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = supabaseAdmin();
  if (!db) return res.status(503).json({ emailed: false, error: "Server email isn't configured." });

  const body = readBody(req);
  const path = clean(body.path, 160);
  const role = clean(body.role, 120);
  const name = clean(body.name, 120);
  const email = clean(body.email, 120);
  const phone = clean(body.phone, 30);
  const linkedin = clean(body.linkedin, 200);
  const message = clean(body.message, 2000);

  if (!PATH_RE.test(path)) return res.status(400).json({ emailed: false, error: "Invalid resume reference." });
  if (!name || !email || !phone || !role) return res.status(400).json({ emailed: false, error: "Missing application details." });

  try {
    const { data: blob, error } = await db.storage.from(BUCKET).download(path);
    if (error || !blob) throw new Error(error?.message || "resume not found");
    const content = Buffer.from(await blob.arrayBuffer());
    if (content.length > MAX_BYTES) throw new Error("resume too large");

    const publicUrl = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    const filename = `${name.replace(/[^a-zA-Z0-9]+/g, "_").slice(0, 40) || "Applicant"}_Resume.${path.split(".").pop()}`;

    const emailed = await emailAdmin({
      subject: `New application · ${role} · ${name}`,
      replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
      text:
        `New job application\n\nRole: ${role}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
        `LinkedIn / portfolio: ${linkedin || "-"}\n\nCover note:\n${message || "-"}\n\n` +
        `Resume is attached. Backup link: ${publicUrl}`,
      attachments: [{ filename, content }],
    });
    return res.status(200).json({ emailed });
  } catch (err) {
    console.error("[submit-application]", err?.message || err);
    return res.status(500).json({ emailed: false });
  }
}
