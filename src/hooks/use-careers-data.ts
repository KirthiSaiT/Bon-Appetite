/* Careers page content. The admin edits it in /admin → Careers; it is stored in the
 * site_settings table under "careers.*" keys. Anything not saved yet uses the defaults below. */

export interface Opening {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  blurb: string;
  responsibilities: string[];
  requirements: string[];
  is_active: boolean;
}

export const OPENINGS_KEY = "careers.openings";

export const CAREERS_DEFAULTS: Record<string, string> = {
  "careers.hero_label": "Careers at Bon Appetit",
  "careers.hero_title": "Come make something",
  "careers.hero_highlight": "real.",
  "careers.hero_text":
    "We're a small team of pasta obsessives in Hyderabad — handmaking every product, running workshops, and building a community around Italian food. If that sounds like your kind of place, we'd love to meet you.",
  "careers.hero_image": "/pastaworkshop.webp",
  "careers.openings_title": "We're hiring right now.",
  "careers.openings_text": "", // empty = counted from the visible roles
  "careers.photo_image": "/bts1.webp",
  "careers.photo_quote": "\"Every pasta shape has a story. Come help us write more.\"",
  "careers.apply_title": "Apply now.",
  "careers.apply_text": "Takes less than 3 minutes. We read every single one.",
  "careers.success_title": "We've got your application!",
  "careers.success_text": "Thanks for taking the time. We read every application personally and will be in touch within 5–7 working days.",
};

export const DEFAULT_OPENINGS: Opening[] = [
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
    is_active: true,
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
    is_active: true,
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
    is_active: true,
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
    is_active: true,
  },
];

const text = (v: unknown) => (typeof v === "string" ? v : "");
const lines = (v: unknown) => (Array.isArray(v) ? v.map(text).filter(Boolean) : []);

/** The saved list of roles. Nothing saved (or unreadable) = the defaults; a saved empty list stays empty. */
export const parseOpenings = (saved: string | undefined): Opening[] => {
  if (!saved) return DEFAULT_OPENINGS;
  try {
    const list: unknown = JSON.parse(saved);
    if (!Array.isArray(list)) return DEFAULT_OPENINGS;
    return list
      .filter((o) => o && text(o.id) && text(o.title))
      .map((o) => ({
        id: text(o.id),
        title: text(o.title),
        department: text(o.department),
        type: text(o.type),
        location: text(o.location),
        blurb: text(o.blurb),
        responsibilities: lines(o.responsibilities),
        requirements: lines(o.requirements),
        is_active: o.is_active !== false,
      }));
  } catch {
    return DEFAULT_OPENINGS;
  }
};
