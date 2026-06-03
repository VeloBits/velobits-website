import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Navbar from "@/components/layout/Navbar";
import { navLinks, brand } from "@/lib/site-content";
import { simulateScroll } from "../../helpers";

describe("Navbar", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("renders a semantic <header> with role banner", () => {
    render(<Navbar />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders a <nav> with aria-label 'Main navigation'", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation", { name: /Main navigation/i })).toBeInTheDocument();
  });

  it("renders the Velobits logo image with correct alt text", () => {
    render(<Navbar />);
    const img = screen.getByAltText(brand.logo.alt);
    expect(img).toBeInTheDocument();
  });

  it("renders the Velobits wordmark text", () => {
    render(<Navbar />);
    expect(screen.getByText(brand.name)).toBeInTheDocument();
  });

  it("renders all navigation links from config", () => {
    render(<Navbar />);
    navLinks.forEach((link) => {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    });
  });

  it("links Blog to the blog index", () => {
    render(<Navbar />);
    expect(screen.getByText("Blog").closest("a")).toHaveAttribute("href", "/blog");
  });

  it("renders the Join Waitlist CTA", () => {
    render(<Navbar />);
    const ctas = screen.getAllByText(/Join Waitlist/);
    expect(ctas.length).toBeGreaterThanOrEqual(1);
  });

  it("has correct href for nav links", () => {
    render(<Navbar />);
    expect(screen.getByText("Products").closest("a")).toHaveAttribute("href", "#products");
    expect(screen.getByText("Community").closest("a")).toHaveAttribute("href", "#community");
    expect(screen.getByText("About").closest("a")).toHaveAttribute("href", "#about");
  });

  it("renders the navbar element with id", () => {
    render(<Navbar />);
    expect(document.getElementById("navbar")).toBeInTheDocument();
  });

  it("renders hamburger menu button with aria-expanded=false initially", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /Open navigation menu/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("sets aria-expanded=true on hamburger click", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /Open navigation menu/i });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("button has aria-controls pointing to mobile-menu", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /Open navigation menu/i });
    expect(toggle).toHaveAttribute("aria-controls", "mobile-menu");
  });

  it("toggles mobile menu on hamburger click", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /Open navigation menu/i });
    const linksBefore = screen.getAllByText("Products").length;

    fireEvent.click(toggle);

    const linksAfter = screen.getAllByText("Products").length;
    expect(linksAfter).toBeGreaterThan(linksBefore);
  });

  it("closes mobile menu on outside click", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /Open navigation menu/i });
    fireEvent.click(toggle);
    const linksOpen = screen.getAllByText("Products").length;

    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    const linksClosed = screen.getAllByText("Products").length;
    expect(linksClosed).toBeLessThan(linksOpen);
  });

  it("closes mobile menu on link click", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /Open navigation menu/i });
    fireEvent.click(toggle);

    const menuLinks = screen.getAllByText("Products");
    fireEvent.click(menuLinks[menuLinks.length - 1]);

    expect(screen.getAllByText("Products").length).toBeLessThan(menuLinks.length);
  });

  it("closes mobile menu on Escape key", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /Open navigation menu/i });
    fireEvent.click(toggle);
    const linksOpen = screen.getAllByText("Products").length;

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    const linksClosed = screen.getAllByText("Products").length;
    expect(linksClosed).toBeLessThan(linksOpen);
  });

  it("applies scroll styling when scrolled", () => {
    render(<Navbar />);
    const nav = document.getElementById("navbar")!;
    const initialClass = nav.className;

    act(() => {
      simulateScroll(100);
    });

    expect(nav.className).not.toBe(initialClass);
  });
});
