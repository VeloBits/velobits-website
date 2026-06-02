import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Products from "@/components/sections/Products";

describe("Products", () => {
  it("renders the section with id 'products'", () => {
    render(<Products />);
    expect(document.getElementById("products")).toBeInTheDocument();
  });

  it("renders the section eyebrow", () => {
    render(<Products />);
    expect(screen.getByText(/Our Products/i)).toBeInTheDocument();
  });

  it("renders the featured product name FixMyText", () => {
    render(<Products />);
    expect(screen.getByText("FixMyText")).toBeInTheDocument();
  });

  it("renders the featured product description", () => {
    render(<Products />);
    expect(screen.getByText(/all-in-one text-transformation/i)).toBeInTheDocument();
  });

  it("renders the featured product status badge", () => {
    render(<Products />);
    expect(screen.getByText(/Launching Soon/i)).toBeInTheDocument();
  });

  it("renders the featured product CTA link", () => {
    render(<Products />);
    const cta = screen.getByRole("link", { name: /Join FixMyText Waitlist/i });
    expect(cta).toHaveAttribute("href", "#waitlist");
  });

  it("renders the Coming Soon product card", () => {
    render(<Products />);
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
  });

  it("renders the Velobits Suite product card", () => {
    render(<Products />);
    expect(screen.getByText(/Velobits Suite/i)).toBeInTheDocument();
  });

  it("renders feature list items for featured product", () => {
    render(<Products />);
    expect(screen.getByText(/254 tools across 12 categories/i)).toBeInTheDocument();
  });

  it("renders tags for featured product", () => {
    render(<Products />);
    expect(screen.getByText("#AI")).toBeInTheDocument();
  });
});
