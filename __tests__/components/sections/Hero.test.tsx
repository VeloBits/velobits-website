import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Hero from "@/components/sections/Hero";
import { getFeaturedProduct } from "@/lib/site-content";

describe("Hero", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("renders the hero section with id", () => {
    render(<Hero />);
    expect(document.getElementById("hero")).toBeInTheDocument();
  });

  it("renders the main h1 heading 'FixMyText by Velobits'", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent(/FixMyText/i);
    expect(h1).toHaveTextContent(/Velobits/i);
  });

  it("renders the eyebrow 'FixMyText is launching soon'", () => {
    render(<Hero />);
    expect(screen.getByText(/FixMyText is launching soon/i)).toBeInTheDocument();
  });

  it("renders the supporting description copy", () => {
    render(<Hero />);
    // "rewrites sentences" and "improves tone in seconds" are unique to the description paragraph
    expect(screen.getByText(/rewrites sentences/i)).toBeInTheDocument();
    expect(screen.getByText(/improves tone in seconds/i)).toBeInTheDocument();
  });

  it("renders the 'Join FixMyText Waitlist' CTA linking to #waitlist", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /Join FixMyText Waitlist/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "#waitlist");
  });

  it("renders the 'See Product Preview' CTA linking to #products", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /See Product Preview/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "#products");
  });

  it("renders trust tags from featured product config", () => {
    render(<Hero />);
    const featured = getFeaturedProduct();
    featured.features.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("renders the product preview browser frame", () => {
    render(<Hero />);
    const featured = getFeaturedProduct();
    expect(screen.getByText(featured.preview!.url)).toBeInTheDocument();
  });

  it("renders the original and fixed preview text", () => {
    render(<Hero />);
    const featured = getFeaturedProduct();
    expect(screen.getByText(featured.preview!.originalText)).toBeInTheDocument();
    expect(screen.getByText(featured.preview!.fixedText)).toBeInTheDocument();
  });

  it("renders the accuracy stat from config", () => {
    render(<Hero />);
    const featured = getFeaturedProduct();
    expect(screen.getByText(featured.preview!.accuracy)).toBeInTheDocument();
    expect(screen.getByText(featured.preview!.accuracyLabel)).toBeInTheDocument();
  });

  it("renders action chips from preview config", () => {
    render(<Hero />);
    const featured = getFeaturedProduct();
    featured.preview!.actions.forEach((action) => {
      expect(screen.getByText(action)).toBeInTheDocument();
    });
  });

  it("renders the scroll hint", () => {
    render(<Hero />);
    expect(screen.getByText(/Scroll to explore/i)).toBeInTheDocument();
  });
});
