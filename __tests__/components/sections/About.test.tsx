import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import About from "@/components/sections/About";

describe("About", () => {
  it("renders the section with id 'about'", () => {
    render(<About />);
    expect(document.getElementById("about")).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders the mission eyebrow", () => {
    render(<About />);
    expect(screen.getByText(/Our Mission/i)).toBeInTheDocument();
  });

  it("renders the brand description text", () => {
    render(<About />);
    expect(screen.getByText(/We started Velobits/i)).toBeInTheDocument();
  });

  it("renders the quote text", () => {
    render(<About />);
    expect(screen.getByText(/We build tools that work for people/i)).toBeInTheDocument();
  });

  it("renders all three stat cards", () => {
    render(<About />);
    expect(screen.getByText(/Product Launching/i)).toBeInTheDocument();
    expect(screen.getByText(/Community-First Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText(/Ideas Driven by Community/i)).toBeInTheDocument();
  });

  it("renders the Velobits logo in the orbit visual", () => {
    render(<About />);
    expect(screen.getByAltText(/Velobits/i)).toBeInTheDocument();
  });

  it("renders 'Just bits that matter'", () => {
    render(<About />);
    expect(screen.getByText(/Just bits that matter/i)).toBeInTheDocument();
  });
});
