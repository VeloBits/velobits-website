import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Revon from "@/components/sections/Revon";
import { revonFeatures, revonRiderNotes, revonSteps } from "@/lib/site-content";

describe("Revon", () => {
  it("renders the section with id 'revon'", () => {
    render(<Revon />);
    expect(document.getElementById("revon")).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<Revon />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/Every rider/i);
  });

  it("renders every how-it-works step", () => {
    render(<Revon />);
    revonSteps.forEach((s) =>
      expect(screen.getByRole("heading", { name: s.title })).toBeInTheDocument()
    );
  });

  it("renders every feature with its copy", () => {
    render(<Revon />);
    revonFeatures.forEach((f) => {
      expect(screen.getByRole("heading", { name: f.title })).toBeInTheDocument();
      expect(screen.getByText(f.body)).toBeInTheDocument();
    });
  });

  it("covers the headline features riders care about", () => {
    const titles = revonFeatures.map((f) => f.title);
    expect(titles).toEqual(
      expect.arrayContaining(["One live map", "SOS in one tap", "Hand signals", "Regroup points"])
    );
  });

  it("renders the rider-facing notes", () => {
    render(<Revon />);
    revonRiderNotes.forEach((n) =>
      expect(screen.getByRole("heading", { name: n.title })).toBeInTheDocument()
    );
  });

  it("keeps engineering detail off the marketing page", () => {
    const { container } = render(<Revon />);
    expect(container.textContent).not.toMatch(
      /firebase|realtime database|expo|react native|polyline/i
    );
  });

  it("links to the privacy policy and the waitlist", () => {
    render(<Revon />);
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute(
      "href",
      "/revon/privacy"
    );
    expect(screen.getByRole("link", { name: /Join the Revon Waitlist/i })).toHaveAttribute(
      "href",
      "#waitlist"
    );
  });
});
