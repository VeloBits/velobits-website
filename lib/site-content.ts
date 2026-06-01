export const brand = {
  name: "Velobits",
  tagline: "Software that works for you",
  description:
    "Velobits builds FixMyText, an AI writing assistant for grammar fixes, sentence rewriting, and tone improvement. Join the FixMyText waitlist.",
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
  { label: "About", href: "#about", soon: false },
  { label: "Blog", href: "#", soon: true },
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
      "AI writing assistant that fixes grammar, rewrites sentences, and improves tone in seconds.",
    longDescription:
      "Your AI-powered writing companion. Fix grammar, rephrase sentences, improve tone, and more — right in your browser.",
    features: [
      "Fix grammar & spelling instantly",
      "Rephrase sentences with one click",
      "Adjust tone — formal, casual, sharp",
      "Runs right in your browser",
    ],
    tags: ["AI", "Writing", "Productivity"],
    ctaLabel: "Join FixMyText Waitlist",
    ctaHref: "#waitlist",
    launchLabel: "Launching Soon",
    preview: {
      url: "app.fixmytext.com",
      originalText:
        "I writed this email yesterday but i think it can be improved alot. Can you help me?",
      fixedText:
        "I wrote this email yesterday, but I believe it could be improved significantly. Could you help me refine it?",
      actions: ["Fix Grammar", "Rephrase", "Improve Tone"],
      accuracy: "98%",
      accuracyLabel: "Accuracy score",
    },
    seoKeywords: [
      "AI writing assistant",
      "grammar fixer",
      "sentence rewriter",
      "tone improvement",
      "FixMyText",
    ],
    metric: "98%",
    metricLabel: "Grammar accuracy",
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
