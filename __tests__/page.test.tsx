import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// LatestUpdates is an async Server Component that pulls in server-only modules
// (lib/apps-script); it can't render in jsdom. Stub it so the page test stays
// focused on layout. Its presentational seam is covered by UpdatesList.test.tsx.
vi.mock("@/components/sections/LatestUpdates", () => ({
  default: () => null,
}));

import Home from "../app/page";

describe("Home page", () => {
  it("renders a main content area", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders a footer with the Velobits name and current year", () => {
    render(<Home />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent("Velobits");
    expect(footer).toHaveTextContent(String(new Date().getFullYear()));
  });
});
