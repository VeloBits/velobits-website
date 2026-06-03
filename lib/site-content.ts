export const brand = {
  name: "Velobits",
  tagline: "Software that works for you",
  description:
    "Velobits builds FixMyText — a 254-tool text-transformation platform with instant case, encode, hash, cipher, and format tools, plus 50+ AI tools for rewriting, summarizing, and analysis, right in your browser. Join the FixMyText waitlist.",
  domain: "https://velobits.dev",
  logo: {
    src: "/velobits-white-png.png",
    alt: "Velobits logo",
    width: 120,
    height: 28,
  },
  socialLinks: {
    github: "https://github.com/velobits",
    twitter: "https://x.com/velobits",
  },
};

export const navLinks = [
  { label: "Products", href: "#products", soon: false },
  { label: "Community", href: "#community", soon: false },
  { label: "Updates", href: "#updates", soon: false },
  { label: "About", href: "#about", soon: false },
  { label: "Blog", href: "#", soon: true },
];

export const taglines = [
  "254 Tools. Infinite Possibilities.",
  "Your text, transformed instantly.",
  "The Swiss Army knife for text work.",
  "From writers to developers, one platform.",
];

export type Product = {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  tags: string[];
  ctaLabel: string | null;
  ctaHref: string | null;
  launchLabel: string;
  preview: {
    url: string;
    originalText: string;
    fixedText: string;
    actions: string[];
    accuracy: string;
    accuracyLabel: string;
  } | null;
  seoKeywords: string[];
  metric: string | null;
  metricLabel: string | null;
  icon: string;
  featured: boolean;
};

export const products: Product[] = [
  {
    id: "fixmytext",
    name: "FixMyText",
    status: "Launching Soon",
    statusColor: "#c8f135",
    shortDescription:
      "254 text tools in one editor — case, encode, hash, cipher, JSON/XML formatting, plus 50+ AI tools for rewriting, summarizing, and analysis.",
    longDescription:
      "An all-in-one text-transformation platform. Convert case, encode/decode, hash, format JSON, run ciphers, and tap 50+ AI tools — summarize, paraphrase, sentiment, keyword extraction — with real-time preview and shareable results, right in your browser.",
    features: [
      "254 tools across 12 categories",
      "Instant case, encode, hash & cipher tools",
      "50+ AI tools — summarize, paraphrase, analyze",
      "Real-time preview & shareable links",
    ],
    tags: ["AI", "Developer Tools", "Writing", "Productivity"],
    ctaLabel: "Join FixMyText Waitlist",
    ctaHref: "#waitlist",
    launchLabel: "Launching Soon",
    preview: {
      url: "fixmytext.velobits.dev",
      originalText:
        "I writed this email yesterday but i think it can be improved alot. Can you help me?",
      fixedText:
        "I wrote this email yesterday, but I believe it could be improved significantly. Could you help me refine it?",
      actions: ["Fix Grammar", "Summarize", "Format"],
      accuracy: "254",
      accuracyLabel: "Text tools",
    },
    seoKeywords: [
      "text transformation platform",
      "online case converter",
      "free JSON formatter",
      "base64 encoder decoder",
      "AI text summarizer",
      "paraphrase tool",
      "FixMyText",
    ],
    metric: "254",
    metricLabel: "Text tools",
    icon: "✏️",
    featured: true,
  },
  {
    id: "mystery",
    name: "Coming Soon",
    status: "In the Lab",
    statusColor: "#666",
    shortDescription: "Something new is brewing. Vote on what you'd like us to build next.",
    longDescription:
      "We're exploring what to build next. No promises, no roadmap locked in — just community votes that guide the next product.",
    features: [],
    tags: ["Productivity", "Developer Tools", "Privacy"],
    ctaLabel: "Vote in Community →",
    ctaHref: "#community",
    launchLabel: "In the Lab",
    preview: null,
    seoKeywords: [],
    metric: null,
    metricLabel: null,
    icon: "?",
    featured: false,
  },
  {
    id: "suite",
    name: "Velobits Suite",
    status: "2027",
    statusColor: "#444",
    shortDescription:
      "A full ecosystem of everyday tools — built product by product, driven by this community.",
    longDescription:
      "Each product we ship becomes part of the Suite — a cohesive collection of focused tools that work together. One product at a time, starting now.",
    features: [],
    tags: ["AI Writing", "Focus Tools", "Dev Utilities"],
    ctaLabel: null,
    ctaHref: null,
    launchLabel: "2027",
    preview: null,
    seoKeywords: [],
    metric: null,
    metricLabel: null,
    icon: "🌌",
    featured: false,
  },
];

export const featuredProductId = "fixmytext";

export function getFeaturedProduct(): Product {
  return products.find((p) => p.id === featuredProductId)!;
}

// ── Community poll ──────────────────────────────────────────────
// Option labels live here (source of truth for display + SEO); live vote counts
// come from the Google Sheet, joined by `optionId`. To add an option later, add
// it here AND add a matching row to the Sheet's "Polls" tab (same pollId/optionId).
export type PollOption = { id: string; label: string };
export type Poll = { id: string; question: string; options: PollOption[] };

export const poll: Poll = {
  id: "next-app",
  question: "Which app should we build next?",
  options: [
    { id: "fixmytext", label: "FixMyText" },
    { id: "note-sharing", label: "Note-sharing app" },
  ],
};

// A single live count for one poll option, as returned by the backend.
export type PollCount = {
  poll_id: string;
  option_id: string;
  option_label: string;
  count: number;
};

// ── Latest Updates feed ─────────────────────────────────────────
export type UpdateType = "launch" | "feature" | "update" | "fix";

export type Update = {
  id: string;
  date: string; // ISO date
  type: UpdateType;
  title: string;
  body: string;
  link?: string;
};

export const updateTypeMeta: Record<UpdateType, { label: string }> = {
  launch: { label: "Launch" },
  feature: { label: "New Feature" },
  update: { label: "Update" },
  fix: { label: "Bug Fix" },
};
