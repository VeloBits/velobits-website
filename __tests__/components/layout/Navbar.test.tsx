import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Navbar from "@/components/layout/Navbar";
import { simulateScroll } from "../../helpers";

describe("Navbar", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("renders the Velobits logo text", () => {
    render(<Navbar />);
    expect(screen.getByText("Velobits")).toBeInTheDocument();
  });

  it("renders the ⚡ logo icon", () => {
    render(<Navbar />);
    expect(screen.getByText("⚡")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("marks Blog with a 'Soon' badge", () => {
    render(<Navbar />);
    expect(screen.getByText("Soon")).toBeInTheDocument();
  });

  it("renders the Join Waitlist CTA", () => {
    render(<Navbar />);
    // Multiple "Join Waitlist" elements (desktop + mobile dropdown CTA)
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

  it("applies scroll styling when scrolled", () => {
    render(<Navbar />);
    const nav = document.getElementById("navbar")!;
    const initialBg = nav.style.background;

    act(() => {
      simulateScroll(100);
    });

    // Background should change after scroll
    expect(nav.style.background).not.toBe(initialBg);
  });

  it("renders hamburger menu button", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
  });

  it("toggles mobile menu on hamburger click", () => {
    render(<Navbar />);
    const toggle = screen.getByLabelText("Toggle menu");

    // Menu closed initially — only one set of nav links
    const linksBefore = screen.getAllByText("Products");

    fireEvent.click(toggle);

    // After opening, mobile dropdown should show a duplicate set of links
    const linksAfter = screen.getAllByText("Products");
    expect(linksAfter.length).toBeGreaterThan(linksBefore.length);
  });

  it("closes mobile menu on outside click", async () => {
    render(<Navbar />);
    const toggle = screen.getByLabelText("Toggle menu");

    fireEvent.click(toggle);
    const linksOpen = screen.getAllByText("Products").length;

    // Click outside (document)
    act(() => {
      document.dispatchEvent(new Event("click"));
    });

    // Menu should close — fewer "Products" links visible
    const linksClosed = screen.getAllByText("Products").length;
    expect(linksClosed).toBeLessThan(linksOpen);
  });
});
