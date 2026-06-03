import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PostCard from "@/components/blog/PostCard";
import { meta } from "./fixtures";

describe("PostCard", () => {
  it("renders the title as a link to the post", () => {
    render(
      <ul>
        <PostCard post={meta()} />
      </ul>
    );
    const links = screen.getAllByRole("link", { name: "Hello World" });
    expect(links[0]).toHaveAttribute("href", "/blog/hello-world");
  });

  it("renders the excerpt, author, and formatted date", () => {
    render(
      <ul>
        <PostCard post={meta()} />
      </ul>
    );
    expect(screen.getByText("A short excerpt about the post.")).toBeInTheDocument();
    expect(screen.getByText(/By Nency/)).toBeInTheDocument();
    expect(screen.getByText("Jun 1, 2026")).toBeInTheDocument();
  });

  it("renders tag badges", () => {
    render(
      <ul>
        <PostCard post={meta()} />
      </ul>
    );
    expect(screen.getByRole("link", { name: /Writing/ })).toBeInTheDocument();
  });

  it("renders a Read more link", () => {
    render(
      <ul>
        <PostCard post={meta()} />
      </ul>
    );
    expect(screen.getByRole("link", { name: /Read more/i })).toBeInTheDocument();
  });

  it("hides an unparseable date", () => {
    render(
      <ul>
        <PostCard post={meta({ date: "not-a-date" })} />
      </ul>
    );
    expect(screen.queryByText("Invalid Date")).toBeNull();
  });
});
