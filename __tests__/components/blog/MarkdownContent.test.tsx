import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MarkdownContent from "@/components/blog/MarkdownContent";

const markdown = `## Heading Two

A paragraph with an [external](https://example.com) and an [internal](/about) link, plus \`inline code\`.

\`\`\`js
const x = 1;
\`\`\`

> A pull quote.

- item one
- item two

| Col A | Col B |
| ----- | ----- |
| 1     | 2     |

![alt text](https://img.example.com/p.png)
`;

describe("MarkdownContent", () => {
  it("renders headings, paragraphs, and inline code", () => {
    render(<MarkdownContent markdown={markdown} />);
    expect(screen.getByRole("heading", { level: 2, name: "Heading Two" })).toBeInTheDocument();
    expect(screen.getByText("inline code")).toBeInTheDocument();
  });

  it("opens external links in a new tab but leaves internal links untouched", () => {
    render(<MarkdownContent markdown={markdown} />);
    const external = screen.getByRole("link", { name: "external" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", expect.stringContaining("noopener"));

    const internal = screen.getByRole("link", { name: "internal" });
    expect(internal).not.toHaveAttribute("target");
  });

  it("renders fenced code blocks, blockquotes, and lists", () => {
    const { container } = render(<MarkdownContent markdown={markdown} />);
    expect(container.querySelector("pre")).not.toBeNull();
    expect(container.querySelector("blockquote")).not.toBeNull();
    expect(screen.getByText("item one")).toBeInTheDocument();
    expect(screen.getByText("item two")).toBeInTheDocument();
  });

  it("renders GFM tables via remark-gfm", () => {
    render(<MarkdownContent markdown={markdown} />);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(screen.getByText("Col A")).toBeInTheDocument();
  });

  it("renders inline images with their alt text", () => {
    render(<MarkdownContent markdown={markdown} />);
    expect(screen.getByRole("img", { name: "alt text" })).toBeInTheDocument();
  });

  it("renders a YouTube link as an embedded iframe", () => {
    const yt = `[Watch this](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`;
    render(<MarkdownContent markdown={yt} />);
    const iframe = document.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.src).toContain("youtube.com/embed/dQw4w9WgXcQ");
  });
});
