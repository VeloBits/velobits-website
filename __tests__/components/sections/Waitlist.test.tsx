import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Waitlist from "@/components/sections/Waitlist";

function res(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as unknown as Response;
}

describe("Waitlist", () => {
  beforeEach(() => {
    // default: successful subscribe
    global.fetch = vi.fn(async () => res({ ok: true })) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the waitlist section with id", () => {
    render(<Waitlist />);
    expect(document.getElementById("waitlist")).toBeInTheDocument();
  });

  it("renders the heading 'Don't miss what's next.'", () => {
    render(<Waitlist />);
    expect(screen.getByText(/Don't miss/i)).toBeInTheDocument();
    expect(screen.getByText(/what's next/i)).toBeInTheDocument();
  });

  it("renders the eyebrow / heading", () => {
    render(<Waitlist />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toMatch(/Don't miss/i);
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
    expect(screen.getByRole("button", { name: /Get Early Access/i })).toBeInTheDocument();
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

  it("does not submit when email is empty", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    await user.click(screen.getByRole("button", { name: /Get Early Access/i }));
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not submit when email has no @ symbol", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    await user.type(screen.getByPlaceholderText("your@email.com"), "invalidemail");
    await user.click(screen.getByRole("button", { name: /Get Early Access/i }));
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("posts to /api/subscribe and shows success on a valid submission", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    await user.type(screen.getByPlaceholderText("your@email.com"), "test@example.com");
    await user.click(screen.getByRole("button", { name: /Get Early Access/i }));

    await waitFor(() => {
      expect(screen.getByText(/You're in!/i)).toBeInTheDocument();
      expect(screen.getByText(/We'll be in touch with first-access details/i)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledWith("/api/subscribe", expect.anything());
  });

  it("disables the button while the request is in flight", async () => {
    global.fetch = vi.fn(
      () => new Promise((resolve) => setTimeout(() => resolve(res({ ok: true })), 40))
    ) as unknown as typeof fetch;
    const user = userEvent.setup();
    render(<Waitlist />);
    await user.type(screen.getByPlaceholderText("your@email.com"), "test@example.com");
    const button = screen.getByRole("button", { name: /Get Early Access/i });
    await user.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => expect(screen.getByText(/You're in!/i)).toBeInTheDocument());
  });

  it("shows an error message when the request fails", async () => {
    global.fetch = vi.fn(async () => res({ ok: false }, true)) as unknown as typeof fetch;
    const user = userEvent.setup();
    render(<Waitlist />);
    await user.type(screen.getByPlaceholderText("your@email.com"), "test@example.com");
    await user.click(screen.getByRole("button", { name: /Get Early Access/i }));

    await waitFor(() =>
      expect(screen.getByText(/Something went wrong. Please try again/i)).toBeInTheDocument()
    );
    expect(screen.queryByText(/You're in!/i)).not.toBeInTheDocument();
  });

  it("displays 'Done' on success", async () => {
    const user = userEvent.setup();
    render(<Waitlist />);
    await user.type(screen.getByPlaceholderText("your@email.com"), "test@example.com");
    await user.click(screen.getByRole("button", { name: /Get Early Access/i }));
    await waitFor(() => expect(screen.getByText("Done")).toBeInTheDocument());
  });
});
