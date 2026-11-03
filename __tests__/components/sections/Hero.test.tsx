import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Hero from "@/components/sections/Hero";
import { brand, getFeaturedProduct } from "@/lib/site-content";

describe("Hero", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("renders the hero section with id", () => {
    render(<Hero />);
    expect(document.getElementById("hero")).toBeInTheDocument();
  });

  it("renders the main h1 heading 'Revon' with the Velobits attribution", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Revon/i);
    expect(h1).toHaveTextContent(/Velobits/i);
  });

  it("renders the coming-soon eyebrow", () => {
    render(<Hero />);
    expect(screen.getByText(/Coming soon to Android and iOS/i)).toBeInTheDocument();
  });

  it("renders the supporting description copy", () => {
    render(<Hero />);
    expect(screen.getByText(/One live map for your whole riding group/i)).toBeInTheDocument();
  });

  it("renders the waitlist CTA linking to #waitlist", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /Join the Revon Waitlist/i });
    expect(cta).toHaveAttribute("href", "#waitlist");
  });

  it("renders the 'See How It Works' CTA linking to #revon", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /See How It Works/i });
    expect(cta).toHaveAttribute("href", "#revon");
  });

  it("features Revon and lists its features", () => {
    render(<Hero />);
    const featured = getFeaturedProduct();
    expect(featured.id).toBe("revon");
    featured.features.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("describes the app illustration for assistive tech", () => {
    render(<Hero />);
    expect(screen.getByRole("img", { name: /Revon ride screen/i })).toBeInTheDocument();
  });

  it("keeps FixMyText one click away on its live URL", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: /FixMyText is live/i });
    expect(link).toHaveAttribute("href", brand.fixmytextUrl);
    expect(brand.fixmytextUrl).toBe("https://fixmytext.velobits.dev");
  });

  it("renders the scroll hint", () => {
    render(<Hero />);
    expect(screen.getByText(/Scroll to explore/i)).toBeInTheDocument();
  });
});
