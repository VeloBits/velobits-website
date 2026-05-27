import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Hero from "@/components/sections/Hero";
import { mockIntersectionObserver } from "../../helpers";

describe("Hero", () => {
  beforeEach(() => {
    mockIntersectionObserver();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("renders the hero section with id", () => {
    render(<Hero />);
    expect(document.getElementById("hero")).toBeInTheDocument();
  });

  it("renders the main heading text", () => {
    render(<Hero />);
    expect(screen.getByText(/SMARTER/i)).toBeInTheDocument();
    expect(screen.getByText(/SOFTWARE/i)).toBeInTheDocument();
  });

  it("renders the 'Bits that matter' slogan", () => {
    render(<Hero />);
    expect(screen.getByText(/Bits that matter/i)).toBeInTheDocument();
  });

  it("renders the subtitle description", () => {
    render(<Hero />);
    expect(screen.getByText(/Velobits builds/i)).toBeInTheDocument();
  });

  it("renders the Get Early Access CTA", () => {
    render(<Hero />);
    expect(screen.getByText("Get Early Access")).toBeInTheDocument();
  });

  it("renders the View Products CTA", () => {
    render(<Hero />);
    expect(screen.getByText("View Products")).toBeInTheDocument();
  });

  it("CTA links have correct hrefs", () => {
    render(<Hero />);
    expect(screen.getByText("Get Early Access").closest("a")).toHaveAttribute("href", "#waitlist");
    expect(screen.getByText("View Products").closest("a")).toHaveAttribute("href", "#products");
  });

  it("renders trust metric pills", () => {
    render(<Hero />);
    expect(screen.getByText(/Community-driven/i)).toBeInTheDocument();
    expect(screen.getByText(/Open roadmap/i)).toBeInTheDocument();
  });

  it("renders the product card with FixMyText", () => {
    render(<Hero />);
    expect(screen.getByText("FixMyText")).toBeInTheDocument();
  });

  it("renders the 98% accuracy stat chip", () => {
    render(<Hero />);
    expect(screen.getByText("98%")).toBeInTheDocument();
    expect(screen.getByText("Accuracy score")).toBeInTheDocument();
  });

  it("renders the TRY FREE sticker", () => {
    render(<Hero />);
    expect(screen.getByText(/TRY/)).toBeInTheDocument();
    expect(screen.getByText(/FREE/)).toBeInTheDocument();
  });

  it("renders the editor preview bar", () => {
    render(<Hero />);
    expect(screen.getByText(/Your next big idea starts here/i)).toBeInTheDocument();
  });

  it("renders the scroll prompt", () => {
    render(<Hero />);
    expect(screen.getByText(/Scroll to explore/i)).toBeInTheDocument();
  });
});
