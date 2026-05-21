import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../page";

describe("Home page", () => {
  it("renders a header with the Velobits brand name", () => {
    render(<Home />);
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Velobits");
  });

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
