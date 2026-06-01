import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "@/components/layout/Footer";

describe("Footer", () => {
  it("renders the Velobits brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Velobits")).toBeInTheDocument();
  });

  it("renders the ⚡ logo icon", () => {
    render(<Footer />);
    expect(screen.getByText("⚡")).toBeInTheDocument();
  });

  it("renders the brand description", () => {
    render(<Footer />);
    expect(screen.getByText(/Software that works for you/)).toBeInTheDocument();
  });

  it("renders the current year in copyright", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it("renders the copyright notice", () => {
    render(<Footer />);
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it("renders Products link group with links", () => {
    render(<Footer />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("FixMyText")).toBeInTheDocument();
    expect(screen.getByText("Community Pulse")).toBeInTheDocument();
    expect(screen.getByText("Roadmap")).toBeInTheDocument();
  });

  it("renders Company link group", () => {
    render(<Footer />);
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Join Waitlist")).toBeInTheDocument();
  });

  it("renders Legal link group", () => {
    render(<Footer />);
    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
  });

  it("renders social links with aria labels", () => {
    render(<Footer />);
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter/X")).toBeInTheDocument();
  });

  it("has correct href for social links", () => {
    render(<Footer />);
    expect(screen.getByLabelText("GitHub")).toHaveAttribute("href", "https://github.com/velobits");
    expect(screen.getByLabelText("Twitter/X")).toHaveAttribute("href", "https://x.com/velobits");
  });

  it("renders the Made with ⚡ footer line", () => {
    render(<Footer />);
    expect(screen.getByText(/Made with/)).toBeInTheDocument();
  });

  it("renders as a footer element", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
