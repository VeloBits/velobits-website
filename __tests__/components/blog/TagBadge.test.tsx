import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TagBadge from "@/components/blog/TagBadge";
import { tag } from "./fixtures";

describe("TagBadge", () => {
  it("renders the tag name and links to its archive", () => {
    render(<TagBadge tag={tag("Writing")} />);
    const link = screen.getByRole("link", { name: /Writing/ });
    expect(link).toHaveAttribute("href", "/blog/tag/writing");
  });

  it("renders the post count when provided", () => {
    render(<TagBadge tag={tag("Writing", 3)} />);
    expect(screen.getByText("(3)")).toBeInTheDocument();
  });

  it("omits the count when not provided", () => {
    render(<TagBadge tag={tag("Writing")} />);
    expect(screen.queryByText(/\(\d+\)/)).toBeNull();
  });
});
