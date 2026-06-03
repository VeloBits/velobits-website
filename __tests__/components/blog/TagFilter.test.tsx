import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TagFilter from "@/components/blog/TagFilter";
import { tag } from "./fixtures";

describe("TagFilter", () => {
  it("renders nothing when there are no tags", () => {
    const { container } = render(<TagFilter tags={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an 'All' link plus one link per tag", () => {
    render(<TagFilter tags={[tag("Writing"), tag("Grammar")]} />);
    expect(screen.getByRole("link", { name: "All" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /Writing/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Grammar/ })).toBeInTheDocument();
  });

  it("exposes a labelled navigation landmark", () => {
    render(<TagFilter tags={[tag("Writing")]} />);
    expect(screen.getByRole("navigation", { name: /Filter posts by tag/i })).toBeInTheDocument();
  });
});
