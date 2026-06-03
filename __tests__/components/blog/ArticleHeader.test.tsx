import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ArticleHeader from "@/components/blog/ArticleHeader";
import { fullPost } from "./fixtures";

describe("ArticleHeader", () => {
  it("renders the title as an h1", () => {
    render(<ArticleHeader post={fullPost()} />);
    expect(screen.getByRole("heading", { level: 1, name: "Hello World" })).toBeInTheDocument();
  });

  it("renders the byline with author, date, and reading time", () => {
    render(<ArticleHeader post={fullPost({ readingTimeMinutes: 7 })} />);
    expect(screen.getByText(/By Nency/)).toBeInTheDocument();
    expect(screen.getByText("Jun 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("7 min read")).toBeInTheDocument();
  });

  it("renders tag badges", () => {
    render(<ArticleHeader post={fullPost()} />);
    expect(screen.getByRole("link", { name: /Writing/ })).toBeInTheDocument();
  });

  it("renders the cover image with the title as alt text", () => {
    render(<ArticleHeader post={fullPost({ coverUrl: "https://img.example.com/hero.png" })} />);
    expect(screen.getByRole("img", { name: "Hello World" })).toBeInTheDocument();
  });
});
