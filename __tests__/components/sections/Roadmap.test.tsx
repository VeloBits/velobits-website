import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Roadmap from "@/components/sections/Roadmap";

describe("Roadmap", () => {
  it("renders the section with id 'roadmap'", () => {
    render(<Roadmap />);
    expect(document.getElementById("roadmap")).toBeInTheDocument();
  });

  it("renders the section eyebrow", () => {
    render(<Roadmap />);
    expect(screen.getByText(/What's Coming/i)).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<Roadmap />);
    expect(screen.getByText(/The road/i)).toBeInTheDocument();
  });

  it("renders all 5 milestones", () => {
    render(<Roadmap />);
    expect(screen.getByText(/FixMyText Alpha/i)).toBeInTheDocument();
    expect(screen.getByText(/Public Launch/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Suite & Sharing/i)).toBeInTheDocument();
    expect(screen.getByText(/API Access & Batch/i)).toBeInTheDocument();
    expect(screen.getByText(/Suite & Integrations/i)).toBeInTheDocument();
  });

  it("renders the active milestone badge", () => {
    render(<Roadmap />);
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
  });

  it("renders milestone dates", () => {
    render(<Roadmap />);
    expect(screen.getAllByText("2026").length).toBeGreaterThan(0);
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("2027")).toBeInTheDocument();
  });

  it("renders the subheading description", () => {
    render(<Roadmap />);
    expect(screen.getByText(/We move fast/i)).toBeInTheDocument();
  });
});
