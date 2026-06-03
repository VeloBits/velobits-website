import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { meta } from "./fixtures";

describe("RelatedPosts", () => {
  it("renders nothing when there are no related posts", () => {
    const { container } = render(<RelatedPosts posts={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a heading and one card per related post", () => {
    render(
      <RelatedPosts
        posts={[
          meta({ id: "a", slug: "a", title: "Related One" }),
          meta({ id: "b", slug: "b", title: "Related Two" }),
        ]}
      />
    );
    expect(screen.getByRole("heading", { name: /Related posts/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Related One" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Related Two" })).toBeInTheDocument();
  });
});
