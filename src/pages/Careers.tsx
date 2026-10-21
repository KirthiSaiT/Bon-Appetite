import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { SimpleFooter } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import emailjs from "@emailjs/browser";
import {
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  FileText,
  CheckCircle,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const perks = [
  {
    emoji: "🍝",
    title: "You'll always be fed",
    desc: "Working in a pasta kitchen has one very obvious, very delicious perk.",
  },
  {
    emoji: "🤝",
    title: "Small team, real impact",
    desc: "No bureaucracy. What you do today shows up on the plate tomorrow.",
  },
  {
    emoji: "✨",
    title: "Room to grow",
    desc: "We're early-stage and moving fast. Your role will grow as we do.",
  },
  {
    emoji: "❤️",
    title: "Work you're proud of",
    desc: "Every product is handmade. Every event is personal. This is the real thing.",
  },
];

const openings = [
  {
    id: "social-media",
    title: "Social Media & Content Creator",
    type: "Part-time",
    location: "Hyderabad / Remote",
    department: "Marketing",
    blurb:
      "Tell our story. You'll create the content that brings new pasta lovers into our community every day.",
    responsibilities: [
      "Shoot, edit and post daily content — Reels, Stories, carousels",
      "Engage authentically with our online community",
      "Collaborate on product launches and workshop promotions",
      "Track what's working and keep pushing the creative",
    ],
    requirements: [
      "You're fluent in Instagram and short-form video",
      "Strong eye for food photography and visual storytelling",
      "Genuine enthusiasm for food, Italian culture, and community",
      "Video editing tools (CapCut, Premiere, or similar)",
    ],
  },
  {
    id: "kitchen-assistant",
    title: "Kitchen Assistant",
    type: "Full-time",
    location: "Hyderabad (On-site)",
    department: "Operations",
    blurb:
      "Get your hands in the dough. You'll be at the heart of what we make every single day.",
    responsibilities: [
      "Help with fresh and dry pasta production each morning",
      "Uphold our kitchen hygiene and quality standards",
      "Support packaging, labelling and order fulfilment",
      "Keep track of ingredients and flag what needs restocking",
    ],
    requirements: [
      "Basic cooking knowledge or a culinary background is a plus",
      "Comfortable working in a busy, physical kitchen",
      "Detail-oriented — you notice when something's off",
      "Curious and willing to learn traditional Italian methods",
    ],
  },
  {
    id: "workshop-coordinator",
    title: "Workshop Coordinator",
    type: "Part-time",
    location: "Hyderabad",
    department: "Community",
    blurb:
      "Run the experience. You'll make sure every workshop attendee leaves inspired, full, and wanting to come back.",
    responsibilities: [
      "Manage registrations, payments and pre-workshop communications",
      "Set up and facilitate monthly online and in-person sessions",
      "Handle corporate and school event enquiries",
      "Build genuine relationships with our pasta-loving regulars",
    ],
    requirements: [
      "You're naturally good with people and at ease in front of a group",
      "Organised — juggling 20 bookings doesn't stress you out",
      "Warm, friendly energy that puts first-timers at ease",
      "Excited about building a real community around food",
    ],
  },
  {
    id: "sales-executive",
    title: "Sales & Distribution Executive",
    type: "Full-time",
    location: "Hyderabad",
    department: "Sales",
    blurb:
      "Grow our shelf space. You'll be the face of Bon Appetit with retailers across the city.",
    responsibilities: [
      "Onboard new grocery, gourmet and specialty stores",
      "Nurture relationships with our existing 30+ retail partners",
      "Coordinate orders and make sure shelves stay stocked",
      "Own your monthly sales numbers",
    ],
    requirements: [
      "1–3 years in B2B sales, FMCG, or retail preferred",
      "Confident communicator who builds trust quickly",
      "Own vehicle and happy to travel within Hyderabad",
      "Self-driven — you don't need to be chased for updates",
    ],
  },
];

const deptColors: Record<string, string> = {
  Marketing: "bg-purple-100 text-purple-700",
  Operations: "bg-blue-100 text-blue-700",
  Community: "bg-green-100 text-green-700",
  Sales: "bg-orange-100 text-orange-700",
};

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// ── Page ──────────────────────────────────────────────────────────────────────

const Careers = () => {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    message: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // ── File helpers ──

  const validateFile = (file: File) => {
    setFileError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Please upload a PDF, DOC or DOCX file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File must be under 5 MB.");
      return;
    }
    setResumeFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateFile(file);
  };

  const scrollToApply = (roleId: string) => {
    setSelectedRole(roleId);
    setTimeout(
      () => applyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80
    );
  };

  // ── Submit ──

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!form.name || !form.email || !form.phone || !selectedRole) {
      setSubmitError("Please fill in all required fields and choose a role.");
      return;
    }
    if (!resumeFile) {
      setSubmitError("Please upload your resume.");
      return;
    }
    setIsSubmitting(true);
    const roleLabel = openings.find((o) => o.id === selectedRole)?.title ?? selectedRole;
    try {
      await emailjs.send(
        "service_0ngsn9l",
        "template_rdzt2i6",
        {
          from_name: form.name,
          to_name: "Bon Appetit HR",
          user_email: form.email,
          message: `New Application — ${roleLabel}\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nLinkedIn: ${form.linkedin || "—"}\nResume: ${resumeFile.name}\n\nCover note:\n${form.message || "—"}`,
        },
        "lBQ8UpD7SH9b45AVq"
      );
      setIsSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-orange-50">
      <Navigation />

      {/* ── Hero — warm food-photo driven ────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src="/pastaworkshop.webp"
          alt="Bon Appetit Kitchen"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Warm overlay — matches the site's orange palette */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/80 via-orange-900/60 to-orange-800/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32 md:py-40">
          <p className="text-orange-300 text-sm font-bold uppercase tracking-[0.2em] mb-5">
            Careers at Bon Appetit
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-[1.08] max-w-2xl mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Come make something{" "}
            <span className="text-orange-300">real.</span>
          </h1>
          <p className="text-white/75 text-lg max-w-lg leading-relaxed mb-10">
            We're a small team of pasta obsessives in Hyderabad — handmaking
            every product, running workshops, and building a community around
            Italian food. If that sounds like your kind of place, we'd love to
            meet you.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-8 text-base"
              onClick={() =>
                document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See Open Roles
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 text-white hover:bg-white/10 font-semibold px-8 text-base"
              onClick={() => scrollToApply("")}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </section>

      {/* ── "Why us" — warm cards, not a flat strip ───────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More than a job.
            </h2>
            <p className="text-gray-500 leading-relaxed">
              We won't pretend we have the perks of a big company. What we do
              have is work that actually matters, a team that has each other's
              backs, and pasta on the house.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p) => (
              <div
                key={p.title}
                className="bg-orange-50 rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition-colors"
              >
                <span className="text-3xl mb-4 block">{p.emoji}</span>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open positions ───────────────────────────────────────────────── */}
      <section id="openings" className="py-20 px-6 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              We're hiring right now.
            </h2>
            <p className="text-gray-500">
              Four roles across kitchen, community, marketing and sales.
            </p>
          </div>

          <div className="space-y-3">
            {openings.map((role) => {
              const open = expandedRole === role.id;
              return (
                <div
                  key={role.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    open
                      ? "border-orange-300 shadow-md"
                      : "border-gray-200 hover:border-orange-200"
                  }`}
                >
                  {/* Collapsed row */}
                  <button
                    className="w-full text-left px-6 py-5"
                    onClick={() => setExpandedRole(open ? null : role.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="text-base font-bold text-gray-900">
                            {role.title}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              deptColors[role.department]
                            }`}
                          >
                            {role.department}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" />
                            {role.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {role.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToApply(role.id);
                          }}
                        >
                          Apply
                        </Button>
                        {open ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {open && (
                    <div className="px-6 pb-7 border-t border-gray-100 pt-5">
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {role.blurb}
                      </p>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            Your day looks like
                          </p>
                          <ul className="space-y-2.5">
                            {role.responsibilities.map((r) => (
                              <li key={r} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            You're our kind of person if
                          </p>
                          <ul className="space-y-2.5">
                            {role.requirements.map((r) => (
                              <li key={r} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-7">
                        <Button
                          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                          onClick={() => scrollToApply(role.id)}
                        >
                          Apply for this role →
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Photo break ──────────────────────────────────────────────────── */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="/bts1.webp"
          alt="Behind the scenes at Bon Appetit"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-orange-900/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="text-white text-2xl md:text-3xl font-bold text-center px-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            "Every pasta shape has a story. Come help us write more."
          </p>
        </div>
      </div>

      {/* ── Application form ─────────────────────────────────────────────── */}
      <section ref={applyRef} id="apply" className="py-24 px-6 bg-white scroll-mt-24">
        <div className="max-w-2xl mx-auto">
          {isSubmitted ? (
            <div className="text-center py-20">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-5" />
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                We've got your application!
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                Thanks for taking the time. We read every application personally
                and will be in touch within 5–7 working days.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h2
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Apply now.
                </h2>
                <p className="text-gray-500">
                  Takes less than 3 minutes. We read every single one.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Which role are you applying for?" />
                    </SelectTrigger>
                    <SelectContent>
                      {openings.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">
                        Other / Speculative Application
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Name + Phone */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Priya Sharma"
                      value={form.name}
                      onChange={setField("name")}
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={setField("phone")}
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                {/* Email + LinkedIn */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="priya@example.com"
                      value={form.email}
                      onChange={setField("email")}
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-700">
                      LinkedIn / Portfolio
                      <span className="text-gray-400 font-normal ml-1 text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="linkedin.com/in/priya"
                      value={form.linkedin}
                      onChange={setField("linkedin")}
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Cover note */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                    Tell us a bit about yourself
                    <span className="text-gray-400 font-normal ml-1 text-xs">(optional)</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Why does this role appeal to you? What would you bring to the team? No need to be formal."
                    value={form.message}
                    onChange={setField("message")}
                    rows={4}
                    className="resize-none text-sm"
                  />
                </div>

                {/* Resume upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Resume / CV <span className="text-red-500">*</span>
                  </Label>

                  {resumeFile ? (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-green-800 truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-green-600">
                          {(resumeFile.size / 1024).toFixed(0)} KB — ready to send
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove file"
                        onClick={() => {
                          setResumeFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-green-500 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label="Upload resume"
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                        isDragOver
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    >
                      <Upload className={`w-7 h-7 mx-auto mb-3 ${isDragOver ? "text-orange-500" : "text-gray-300"}`} />
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Drop your resume here or click to browse
                      </p>
                      <p className="text-xs text-gray-400">
                        PDF, DOC or DOCX — max 5 MB
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) validateFile(f); }}
                  />
                  {fileError && <p className="text-xs text-red-500">{fileError}</p>}
                </div>

                {submitError && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {submitError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-base py-6 rounded-xl disabled:opacity-60"
                >
                  {isSubmitting ? "Sending…" : "Send My Application"}
                </Button>

                <p className="text-center text-xs text-gray-400">
                  Your details are used only for this application and nothing else.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
};

export default Careers;
