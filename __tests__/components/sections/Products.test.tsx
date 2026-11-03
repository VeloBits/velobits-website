import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Products from "@/components/sections/Products";
import { products } from "@/lib/site-content";

describe("Products", () => {
  it("renders the section with id 'products'", () => {
    render(<Products />);
    expect(document.getElementById("products")).toBeInTheDocument();
  });

  it("renders the section eyebrow", () => {
    render(<Products />);
    expect(screen.getByText(/Our Products/i)).toBeInTheDocument();
  });

  it("features Revon first, as the coming-soon product", () => {
    render(<Products />);
    expect(products[0].id).toBe("revon");
    expect(screen.getByRole("heading", { name: "Revon" })).toBeInTheDocument();
    expect(screen.getByText("Coming Soon", { selector: "span" })).toBeInTheDocument();
  });

  it("renders the Revon description, features, tags and waitlist CTA", () => {
    render(<Products />);
    expect(screen.getByText(/puts every rider in a group on one live map/i)).toBeInTheDocument();
    expect(screen.getByText(/One-tap SOS that alerts the whole group/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Join the Revon Waitlist/i })).toHaveAttribute(
      "href",
      "#waitlist"
    );
    expect(screen.getByText("#Motorcycles")).toBeInTheDocument();
  });

  it("keeps FixMyText as a live product with its demo and link", () => {
    render(<Products />);
    expect(screen.getByRole("heading", { name: "FixMyText" })).toBeInTheDocument();
    expect(screen.getByText("Live Now")).toBeInTheDocument();
    expect(screen.getByText(/all-in-one text-transformation/i)).toBeInTheDocument();
    expect(screen.getByText(/254 tools across 12 categories/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open FixMyText/i })).toHaveAttribute(
      "href",
      "https://fixmytext.velobits.dev"
    );
    expect(screen.getByText(/I writed this email yesterday/i)).toBeInTheDocument();
  });

  it("renders the In the Lab and Velobits Suite cards", () => {
    render(<Products />);
    expect(screen.getByText(/In the Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/Velobits Suite/i)).toBeInTheDocument();
  });
});
