import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UpdatesList from "@/components/sections/UpdatesList";
import type { Update } from "@/lib/site-content";

const sample: Update = {
  id: "u1",
  date: "2026-06-01",
  type: "launch",
  title: "FixMyText is live",
  body: "All 254 tools are now public.",
  link: "https://fixmytext.velobits.dev",
};

describe("UpdatesList", () => {
  it("renders an empty state when there are no updates", () => {
    render(<UpdatesList updates={[]} />);
    expect(screen.getByText(/No updates yet/i)).toBeInTheDocument();
  });

  it("renders an update's title, body, and date", () => {
    render(<UpdatesList updates={[sample]} />);
    expect(screen.getByText("FixMyText is live")).toBeInTheDocument();
    expect(screen.getByText("All 254 tools are now public.")).toBeInTheDocument();
    expect(screen.getByText("Jun 1, 2026")).toBeInTheDocument();
  });

  it("renders a 'Read more' link when a link is provided", () => {
    render(<UpdatesList updates={[sample]} />);
    const link = screen.getByRole("link", { name: /Read more/i });
    expect(link).toHaveAttribute("href", "https://fixmytext.velobits.dev");
  });

  it("omits the link when none is provided", () => {
    render(<UpdatesList updates={[{ ...sample, link: undefined }]} />);
    expect(screen.queryByRole("link", { name: /Read more/i })).toBeNull();
  });

  it("renders the correct badge label for each update type", () => {
    const updates: Update[] = [
      { ...sample, id: "a", type: "launch", title: "L" },
      { ...sample, id: "b", type: "feature", title: "F" },
      { ...sample, id: "c", type: "update", title: "U" },
      { ...sample, id: "d", type: "fix", title: "X" },
    ];
    render(<UpdatesList updates={updates} />);
    expect(screen.getByText("Launch")).toBeInTheDocument();
    expect(screen.getByText("New Feature")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Bug Fix")).toBeInTheDocument();
  });

  it("hides the date for an unparseable value", () => {
    render(<UpdatesList updates={[{ ...sample, date: "not-a-date", link: undefined }]} />);
    expect(screen.getByText("FixMyText is live")).toBeInTheDocument();
    expect(screen.queryByText("Invalid Date")).toBeNull();
  });

  it("uses single-column grid for 1 update", () => {
    const { container } = render(<UpdatesList updates={[sample]} />);
    expect(container.querySelector("ol")?.className).toContain("grid-cols-1");
    expect(container.querySelector("ol")?.className).not.toContain("grid-cols-2");
  });

  it("uses 2-column grid for 2 updates", () => {
    const updates = [sample, { ...sample, id: "u2", title: "Second" }];
    const { container } = render(<UpdatesList updates={updates} />);
    expect(container.querySelector("ol")?.className).toContain("sm:grid-cols-2");
    expect(container.querySelector("ol")?.className).not.toContain("lg:grid-cols-3");
  });

  it("uses 3-column grid for 3+ updates", () => {
    const updates = [
      sample,
      { ...sample, id: "u2", title: "Second" },
      { ...sample, id: "u3", title: "Third" },
    ];
    const { container } = render(<UpdatesList updates={updates} />);
    expect(container.querySelector("ol")?.className).toContain("lg:grid-cols-3");
  });

  it("uses 3-column grid for 4 updates", () => {
    const updates = Array.from({ length: 4 }, (_, i) => ({
      ...sample,
      id: `u${i + 1}`,
      title: `Update ${i + 1}`,
    }));
    const { container } = render(<UpdatesList updates={updates} />);
    expect(container.querySelector("ol")?.className).toContain("lg:grid-cols-3");
  });
});
