import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import CommunityPulse from "@/components/sections/CommunityPulse";

function jsonOk(body: unknown) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  }) as unknown as Promise<Response>;
}

const VOTE_COUNTS = [
  { poll_id: "next-app", option_id: "fixmytext", option_label: "FixMyText", count: 1 },
  { poll_id: "next-app", option_id: "note-sharing", option_label: "Note-sharing app", count: 0 },
];

describe("CommunityPulse", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("/api/poll")) return jsonOk({ ok: true, counts: [] });
      if (url.includes("/api/vote")) return jsonOk({ ok: true, counts: VOTE_COUNTS });
      if (url.includes("/api/ideas")) return jsonOk({ ok: true });
      return jsonOk({ ok: false });
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the community section with id", () => {
    render(<CommunityPulse />);
    expect(document.getElementById("community")).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/You decide what we/i)).toBeInTheDocument();
    expect(screen.getByText(/build next\./i)).toBeInTheDocument();
  });

  it("renders the eyebrow text 'Community Pulse'", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/Community Pulse/i)).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/Drop a product idea, vote on existing ones/i)).toBeInTheDocument();
  });

  it("renders the 'Active Poll' section with the new question", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/Active Poll/i)).toBeInTheDocument();
    expect(screen.getByText(/Which app should we build next\?/i)).toBeInTheDocument();
  });

  it("renders the 'Live' pill in the poll section", () => {
    render(<CommunityPulse />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders the real poll options (FixMyText + Note-sharing app)", () => {
    render(<CommunityPulse />);
    expect(screen.getByRole("button", { name: /FixMyText/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Note-sharing app/i })).toBeInTheDocument();
  });

  it("shows the zero-vote state with no dummy data", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/Be the first to vote/i)).toBeInTheDocument();
    // no hardcoded vote counts / days-left copy
    expect(screen.queryByText(/1,247 votes/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/days left/i)).not.toBeInTheDocument();
  });

  it("does not render any category buttons", () => {
    render(<CommunityPulse />);
    expect(screen.queryByRole("button", { name: /^Productivity$/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /^Dev Tools$/i })).toBeNull();
    expect(screen.queryByText(/^Category$/i)).toBeNull();
  });

  it("renders the 'Got an Idea?' section", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/Got an Idea?/i)).toBeInTheDocument();
    expect(screen.getByText(/Describe a problem you'd love us to solve/)).toBeInTheDocument();
  });

  it("renders the idea textarea with placeholder", () => {
    render(<CommunityPulse />);
    expect(screen.getByPlaceholderText(/e.g. I wish there was/i)).toBeInTheDocument();
  });

  it("renders the Submit Idea button", () => {
    render(<CommunityPulse />);
    expect(screen.getByRole("button", { name: /Submit Idea/i })).toBeInTheDocument();
  });

  it("renders the disclaimer text", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/No login required. We read every single one/i)).toBeInTheDocument();
  });

  it("updates idea state when user types", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const textarea = screen.getByPlaceholderText(/e.g. I wish there was/i) as HTMLTextAreaElement;
    await user.type(textarea, "A tool for managing projects");
    expect(textarea.value).toBe("A tool for managing projects");
  });

  it("does not submit an empty idea", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    await user.click(screen.getByRole("button", { name: /Submit Idea/i }));
    expect(screen.getByText(/Describe a problem you'd love us to solve/i)).toBeInTheDocument();
    // /api/ideas should never have been called for an empty idea
    expect(global.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining("/api/ideas"),
      expect.anything()
    );
  });

  it("shows success message on idea submission", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const textarea = screen.getByPlaceholderText(/e.g. I wish there was/i);
    await user.type(textarea, "A great idea");
    await user.click(screen.getByRole("button", { name: /Submit Idea/i }));

    await waitFor(() => {
      expect(screen.getByText("Done")).toBeInTheDocument();
      expect(screen.getByText(/Idea submitted!/i)).toBeInTheDocument();
      expect(screen.getByText(/We read every single one. Thank you!/i)).toBeInTheDocument();
    });
  });

  it("clears the textarea after a successful submission", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const textarea = screen.getByPlaceholderText(/e.g. I wish there was/i) as HTMLTextAreaElement;
    await user.type(textarea, "A great idea");
    await user.click(screen.getByRole("button", { name: /Submit Idea/i }));

    await waitFor(() => expect(textarea.value).toBe(""), { timeout: 5000 });
  });

  it("displays 'Cast Vote' when no vote has been cast", () => {
    render(<CommunityPulse />);
    expect(screen.getByRole("button", { name: /Cast Vote/i })).toBeInTheDocument();
  });

  it("casts a vote, shows 'Voted', and persists it", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    await user.click(screen.getByRole("button", { name: /FixMyText/i }));
    await user.click(screen.getByRole("button", { name: /Cast Vote/i }));

    await waitFor(() => expect(screen.getByRole("button", { name: /Voted/i })).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith("/api/vote", expect.anything());
    expect(localStorage.getItem("vb_voted_next-app")).toBe("fixmytext");
  });

  it("restores a prior vote from localStorage", async () => {
    localStorage.setItem("vb_voted_next-app", "note-sharing");
    render(<CommunityPulse />);
    await waitFor(() => expect(screen.getByRole("button", { name: /Voted/i })).toBeInTheDocument());
  });
});
