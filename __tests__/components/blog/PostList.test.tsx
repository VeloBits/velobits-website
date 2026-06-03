import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PostList from "@/components/blog/PostList";
import { meta } from "./fixtures";

describe("PostList", () => {
  it("renders an empty state when there are no posts", () => {
    render(<PostList posts={[]} />);
    expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
  });

  it("renders one card per post", () => {
    const posts = [
      meta({ id: "a", slug: "a", title: "First" }),
      meta({ id: "b", slug: "b", title: "Second" }),
      meta({ id: "c", slug: "c", title: "Third" }),
    ];
    render(<PostList posts={posts} />);
    // Each card has two "First" links (title + Read more aria fallback); getAll avoids ambiguity
    expect(screen.getAllByRole("link", { name: "First" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Second" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Third" }).length).toBeGreaterThan(0);
  });

  it("uses a single-column grid for one post", () => {
    const { container } = render(<PostList posts={[meta()]} />);
    expect(container.querySelector("ol")?.className).toContain("grid-cols-1");
    expect(container.querySelector("ol")?.className).not.toContain("sm:grid-cols-2");
  });

  it("uses a 3-column grid for 3+ posts", () => {
    const posts = [meta({ id: "a" }), meta({ id: "b" }), meta({ id: "c" })];
    const { container } = render(<PostList posts={posts} />);
    expect(container.querySelector("ol")?.className).toContain("lg:grid-cols-3");
  });
});
