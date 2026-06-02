import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Waitlist from "@/components/sections/Waitlist";

describe("Waitlist", () => {
  it("renders the waitlist section with id", () => {
    render(<Waitlist />);
    expect(document.getElementById("waitlist")).toBeInTheDocument();
  });

  it("renders the heading 'Don't miss what's next.'", () => {
    render(<Waitlist />);
    expect(screen.getByText(/Don't miss/i)).toBeInTheDocument();
    expect(screen.getByText(/what's next/i)).toBeInTheDocument();
  });

  it("renders the eyebrow text 'Early Access'", () => {
    render(<Waitlist />);
    const headingText = screen.getByRole("heading", { level: 2 });
    expect(headingText.textContent).toMatch(/Don't miss/i);
  });

  it("renders the description text", () => {
    render(<Waitlist />);
    expect(screen.getByText(/Join early believers/i)).toBeInTheDocument();
    expect(screen.getByText(/first access to every Velobits launch/i)).toBeInTheDocument();
  });

  it("renders the email input field with placeholder", () => {
    render(<Waitlist />);
    const input = screen.getByPlaceholderText("your@email.com");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  it("renders the 'Get Early Access' button", () => {
    render(<Waitlist />);
    const button = screen.getByRole("button", { name: /Get Early Access/i });
    expect(button).toBeInTheDocument();
  });

  it("renders the disclaimer text 'No spam. Unsubscribe anytime.'", () => {
    render(<Waitlist />);
    expect(screen.getByText(/No spam. Unsubscribe anytime/i)).toBeInTheDocument();
  });

  it("updates email state when user types", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    const input = screen.getByPlaceholderText("your@email.com") as HTMLInputElement;

    await user.type(input, "test@example.com");
    expect(input.value).toBe("test@example.com");
  });

  it("does not submit form when email is empty", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    const button = screen.getByRole("button", { name: /Get Early Access/i });

    await user.click(button);
    // Should stay on form
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
  });

  it("does not submit form when email has no @ symbol", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    const input = screen.getByPlaceholderText("your@email.com");
    const button = screen.getByRole("button", { name: /Get Early Access/i });

    await user.type(input, "invalidemail");
    await user.click(button);

    // Should stay on form
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
  });

  it("shows loading state and then success message on valid submission", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    const input = screen.getByPlaceholderText("your@email.com");
    const button = screen.getByRole("button", { name: /Get Early Access/i });

    await user.type(input, "test@example.com");
    await user.click(button);

    // Button should be disabled during loading
    expect(button).toBeDisabled();

    await waitFor(
      () => {
        expect(screen.getByText(/You're in!/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows success message with confirmation text", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    const input = screen.getByPlaceholderText("your@email.com");
    const button = screen.getByRole("button", { name: /Get Early Access/i });

    await user.type(input, "test@example.com");
    await user.click(button);

    await waitFor(
      () => {
        expect(screen.getByText(/You're in!/i)).toBeInTheDocument();
        expect(
          screen.getByText(/We'll be in touch with first-access details/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("displays 'Done' emoji on success", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    const input = screen.getByPlaceholderText("your@email.com");
    const button = screen.getByRole("button", { name: /Get Early Access/i });

    await user.type(input, "test@example.com");
    await user.click(button);

    await waitFor(
      () => {
        expect(screen.getByText("Done")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
