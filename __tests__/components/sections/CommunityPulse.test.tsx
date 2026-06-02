import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import CommunityPulse from "@/components/sections/CommunityPulse";

describe("CommunityPulse", () => {
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

  it("renders the 'Active Poll' section", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/Active Poll/i)).toBeInTheDocument();
    expect(screen.getByText(/What should we build next for FixMyText?/i)).toBeInTheDocument();
  });

  it("renders the 'Live' pill in the poll section", () => {
    render(<CommunityPulse />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders all poll options with vote percentages", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/Browser & editor plugins/i)).toBeInTheDocument();
    expect(screen.getByText(/Team workspaces/i)).toBeInTheDocument();
    expect(screen.getByText(/Leaderboard & profiles/i)).toBeInTheDocument();
    expect(screen.getByText(/Offline mode/i)).toBeInTheDocument();
  });

  it("displays vote counts and days left", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/1,247 votes/i)).toBeInTheDocument();
    expect(screen.getByText(/14 days left/i)).toBeInTheDocument();
  });

  it("renders the 'Got an Idea?' section", () => {
    render(<CommunityPulse />);
    expect(screen.getByText(/Got an Idea?/i)).toBeInTheDocument();
    expect(screen.getByText(/Describe a problem you'd love us to solve/)).toBeInTheDocument();
  });

  it("renders the idea textarea with placeholder", () => {
    render(<CommunityPulse />);
    const textarea = screen.getByPlaceholderText(/e.g. I wish there was/i);
    expect(textarea).toBeInTheDocument();
  });

  it("renders all category buttons", () => {
    render(<CommunityPulse />);
    expect(screen.getByRole("button", { name: /Productivity/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Writing/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Dev Tools/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Design/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Other/i })).toBeInTheDocument();
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

  it("updates selected category when clicked", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const writingButton = screen.getByRole("button", { name: /Writing/i });

    await user.click(writingButton);
    expect(writingButton).toHaveClass("text-accent");
  });

  it("does not submit empty idea", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const submitButton = screen.getByRole("button", { name: /Submit Idea/i });

    await user.click(submitButton);
    expect(screen.getByText(/Describe a problem you'd love us to solve/i)).toBeInTheDocument();
  });

  it("shows success message on idea submission", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const textarea = screen.getByPlaceholderText(/e.g. I wish there was/i);
    const submitButton = screen.getByRole("button", { name: /Submit Idea/i });

    await user.type(textarea, "A great idea");
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText("Done")).toBeInTheDocument();
        expect(screen.getByText(/Idea submitted!/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("clears textarea after successful submission", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const textarea = screen.getByPlaceholderText(/e.g. I wish there was/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole("button", { name: /Submit Idea/i });

    await user.type(textarea, "A great idea");
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(textarea.value).toBe("");
      },
      { timeout: 5000 }
    );
  });

  it("displays 'Cast Vote' button when no vote selected", () => {
    render(<CommunityPulse />);
    const voteButton = screen.getByRole("button", { name: /Cast Vote/i });
    expect(voteButton).toBeInTheDocument();
  });

  it("updates vote when poll option is clicked", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const firstOptionButton = screen.getByRole("button", {
      name: /Browser & editor plugins/i,
    });

    await user.click(firstOptionButton);

    // The button's opacity should change to indicate selection
    expect(firstOptionButton).toHaveClass("opacity-100");
  });

  it("shows 'Voted' button after selecting an option", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const firstOptionButton = screen.getByRole("button", {
      name: /Browser & editor plugins/i,
    });

    await user.click(firstOptionButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Voted/i })).toBeInTheDocument();
    });
  });

  it("handles category selection", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);

    const devToolsButton = screen.getByRole("button", { name: /Dev Tools/i });
    await user.click(devToolsButton);

    expect(devToolsButton).toHaveClass("text-accent");
  });

  it("defaults to 'Productivity' category", () => {
    render(<CommunityPulse />);
    const productivityButton = screen.getByRole("button", { name: /^Productivity$/i });
    expect(productivityButton).toHaveClass("text-accent");
  });

  it("renders the success message with confirmation text", async () => {
    const user = userEvent.setup();
    render(<CommunityPulse />);
    const textarea = screen.getByPlaceholderText(/e.g. I wish there was/i);
    const submitButton = screen.getByRole("button", { name: /Submit Idea/i });

    await user.type(textarea, "An amazing idea");
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText(/We read every single one. Thank you!/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
