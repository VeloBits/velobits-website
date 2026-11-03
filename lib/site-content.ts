export const brand = {
  name: "Velobits",
  tagline: "Software that works for you",
  description:
    "Velobits builds Revon, the group motorcycle ride app with one live map, rider hand signals, SOS and regroup points, and FixMyText, a 254-tool text-transformation platform that is live today.",
  domain: "https://velobits.dev",
  contactEmail: "hello@velobits.dev",
  fixmytextUrl: "https://fixmytext.velobits.dev",
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

// The blog is hidden for now (see redirects in next.config.ts), so it has no nav entry.
export const navLinks = [
  { label: "Revon", href: "/#revon", soon: false },
  { label: "Products", href: "/#products", soon: false },
  { label: "Community", href: "/#community", soon: false },
  { label: "Updates", href: "/#updates", soon: false },
  { label: "About", href: "/#about", soon: false },
];

export const taglines = [
  "Every rider. One live map.",
  "Ride together, arrive together.",
  "Help is one tap away.",
  "254 text tools, live at fixmytext.velobits.dev.",
];

// ── Revon marketing content ─────────────────────────────────────
// Written for riders, not engineers: say only what the app does today.
export type RevonFeature = { id: string; icon: string; title: string; body: string };

export const revonSteps: { title: string; body: string }[] = [
  {
    title: "Plan the ride",
    body: "Pick a destination, check the route and tap Start Group Ride. You get a six-letter code.",
  },
  {
    title: "Share the code",
    body: "Friends join with the code or an invite link. No setup, no groups to build first.",
  },
  {
    title: "Ride as one",
    body: "Everyone shows up on one live map. Eyes on the road, not on a chat thread.",
  },
];

export const revonFeatures: RevonFeature[] = [
  {
    id: "live-map",
    icon: "users",
    title: "One live map",
    body: "See every rider by name, with speed and whether they are moving or stopped. Know who is ahead and who is behind.",
  },
  {
    id: "sos",
    icon: "alert",
    title: "SOS in one tap",
    body: "A five-second countdown you can cancel, then every rider is alerted with what happened and a Ride to them button.",
  },
  {
    id: "signs",
    icon: "hand",
    title: "Hand signals",
    body: "Send Slow down, Fuel stop or Hazard. It flashes on every phone in the group, big enough to read at a glance.",
  },
  {
    id: "regroup",
    icon: "flag",
    title: "Regroup points",
    body: "The host drops a meeting spot. Everyone gets a route to it, so a stretched-out group comes back together.",
  },
  {
    id: "navigate",
    icon: "navigation",
    title: "Navigation built in",
    body: "A next-turn card, distance and time left, and a fresh route when you miss a turn. Use it solo too.",
  },
  {
    id: "alerts",
    icon: "volume",
    title: "Alerts you can hear",
    body: "Stops, wrong turns, arrivals and SOS are announced out loud and as banners, so you rarely need to look down.",
  },
  {
    id: "cards",
    icon: "route",
    title: "Keep every ride",
    body: "Every ride is saved on your phone with its path, distance, time and speed. Share a ride card to your story.",
  },
  {
    id: "maps",
    icon: "layers",
    title: "Your map, your way",
    body: "Choose Google Maps or OpenStreetMap, plus satellite, terrain and traffic views, and a route colour that works for you.",
  },
];

export const revonRiderNotes: { icon: string; title: string; body: string }[] = [
  {
    icon: "shield",
    title: "You decide what the group sees",
    body: "Your phone number is shared only if you allow it. Emergency details stay private to you.",
  },
  {
    icon: "phone",
    title: "Built for gloves and glances",
    body: "Large targets, few options and a dark mode that is easy on the eyes at night.",
  },
  {
    icon: "bike",
    title: "Made for bikers",
    body: "Two-wheeler routing where the map provider offers it, and signals riders already know.",
  },
];

export type Product = {
  id: string;
  name: string;
  status: string;
  /** Semantic emphasis for the status pill. Was a raw hex string, which meant
   *  content data carried presentation and could not follow the theme. */
  statusTone: "accent" | "neutral";
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
    id: "revon",
    name: "Revon",
    status: "Coming Soon",
    statusTone: "accent",
    shortDescription:
      "The group ride app for motorcyclists: one live map, hand signals, SOS and regroup points.",
    longDescription:
      "Revon puts every rider in a group on one live map. See who is ahead, who has stopped and who needs help, send hand signals, drop a regroup point and keep every ride, without pulling over to check a chat.",
    features: [
      "Live map of every rider in the group",
      "One-tap SOS that alerts the whole group",
      "Hand signals, regroup points and spoken alerts",
      "Navigation built in, solo or with the group",
    ],
    tags: ["Motorcycles", "Group Rides", "Safety", "Navigation"],
    ctaLabel: "Join the Revon Waitlist",
    ctaHref: "#waitlist",
    launchLabel: "Coming Soon",
    preview: null,
    seoKeywords: [
      "group motorcycle ride app",
      "live location for riders",
      "motorcycle convoy app",
      "rider SOS",
      "Revon",
    ],
    metric: null,
    metricLabel: null,
    icon: "revon",
    featured: true,
  },
  {
    id: "fixmytext",
    name: "FixMyText",
    status: "Live Now",
    statusTone: "accent",
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
    ctaLabel: "Open FixMyText",
    ctaHref: "https://fixmytext.velobits.dev",
    launchLabel: "Live Now",
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
    icon: "fixmytext",
    featured: false,
  },
  {
    id: "mystery",
    name: "Coming Soon",
    status: "In the Lab",
    statusTone: "neutral",
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
    icon: "mystery",
    featured: false,
  },
  {
    id: "suite",
    name: "Velobits Suite",
    status: "2027",
    statusTone: "neutral",
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
    icon: "suite",
    featured: false,
  },
];

export const featuredProductId = "revon";

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
