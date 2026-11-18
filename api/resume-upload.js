// POST /api/resume-upload — Vercel serverless function (Node).
// Hands the browser a one-time signed upload URL for a resume, so the Supabase bucket
// needs NO public write policy. The server (secret key) creates the bucket on first use,
// checks the file type/size claim, and picks an unguessable path.
// Body: { filename, contentType, size }  →  { path, token, url }
import crypto from "node:crypto";
import { clean, readBody, supabaseAdmin } from "./_lib/booking.js";

const BUCKET = "resumes";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = supabaseAdmin();
  if (!db) {
    console.error("[resume-upload] SUPABASE_SECRET_KEY / SUPABASE_URL missing");
    return res.status(503).json({ error: "Resume upload isn't available right now. Please email us your CV." });
  }

  const body = readBody(req);
  const contentType = clean(body.contentType, 120);
  const size = Number(body.size);
  const ext = ALLOWED[contentType];
  if (!ext) return res.status(400).json({ error: "Please upload a PDF, DOC or DOCX file." });
  if (!Number.isFinite(size) || size <= 0 || size > MAX_BYTES) {
    return res.status(400).json({ error: "File must be under 5 MB." });
  }

  const base = clean(body.filename, 120).replace(/\.[^.]*$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60) || "resume";
  const path = `${crypto.randomUUID()}/${base}.${ext}`;

  try {
    // Create the bucket the first time (ignore "already exists").
    const { error: bucketError } = await db.storage.createBucket(BUCKET, {
      public: true, // direct link works, but only with the random path
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: Object.keys(ALLOWED),
    });
    if (bucketError && !/already exists|duplicate/i.test(bucketError.message)) throw bucketError;

    const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error) throw error;

    const publicUrl = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    return res.status(200).json({ path, token: data.token, url: publicUrl });
  } catch (err) {
    console.error("[resume-upload]", err?.message || err);
    return res.status(500).json({ error: "Could not start the upload. Please try again." });
  }
}
