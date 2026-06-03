import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ReadingTime from "@/components/blog/ReadingTime";

describe("ReadingTime", () => {
  it("renders the minutes as a 'min read' label", () => {
    render(<ReadingTime minutes={5} />);
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });
});
