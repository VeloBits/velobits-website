import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DeleteAccountPage, { metadata as deleteMeta } from "../../app/app/revon/delete-account/page";
import CookiesPage, { metadata as cookiesMeta } from "../../app/legal/cookies/page";
import PaymentsPage, { metadata as paymentsMeta } from "../../app/legal/payments/page";
import { EMBED_SCRIPT } from "../../components/legal/LegalChrome";

describe("Revon account deletion page", () => {
  it("has the canonical URL the app and Play Console point at", () => {
    expect(deleteMeta.alternates?.canonical).toBe("https://velobits.dev/app/revon/delete-account");
  });

  it("names the app and the 14-day deletion promise", () => {
    const { container } = render(<DeleteAccountPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Delete your account/i);
    expect(container.textContent).toContain("Revon");
    expect(container.textContent).toMatch(/within (the next )?14 days/i);
  });

  it("tells the reader which email and subject to use", () => {
    const { container } = render(<DeleteAccountPage />);
    expect(container.textContent).toContain("Delete my Revon account");
    expect(container.textContent).toContain("Cancel my Revon account deletion");
    const links = screen.getAllByRole("link", { name: "support@velobits.dev" });
    expect(links[0]).toHaveAttribute("href", "mailto:support@velobits.dev");
  });

  it("includes both sample emails with prefilled mailto links", () => {
    render(<DeleteAccountPage />);
    const open = screen.getAllByRole("link", { name: /Open in your mail app/i });
    expect(open).toHaveLength(2);
    expect(open[0].getAttribute("href")).toContain(
      `subject=${encodeURIComponent("Delete my Revon account")}`
    );
    expect(open[1].getAttribute("href")).toContain(
      `subject=${encodeURIComponent("Cancel my Revon account deletion")}`
    );
  });

  it("no longer claims ride recordings stay only on the phone", () => {
    const { container } = render(<DeleteAccountPage />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/never on our servers|stored only on your phone/i);
    expect(text).toMatch(/ride history is stored on your account/i);
  });

  it("explains how the account is identified, what is deleted and what is kept", () => {
    const { container } = render(<DeleteAccountPage />);
    const text = container.textContent ?? "";
    for (const needle of [
      "sign-in email",
      "verified mobile number",
      "What is deleted",
      "What is kept",
      "emergency contacts",
      "keeps a record of its riders",
      "Medical ID",
      "Your bikes",
      "ride history",
    ]) {
      expect(text.toLowerCase()).toContain(needle.toLowerCase());
    }
  });
});

describe("Cookie policy", () => {
  it("is a Velobits-wide page at /legal/cookies", () => {
    expect(cookiesMeta.alternates?.canonical).toBe("https://velobits.dev/legal/cookies");
    const { container } = render(<CookiesPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Cookie Policy/i);
    const text = container.textContent ?? "";
    for (const needle of [
      "Velobits website",
      "FixMyText",
      "Revon",
      "fixmytext_session",
      "vb-theme",
    ]) {
      expect(text).toContain(needle);
    }
  });
});

describe("Payment policy", () => {
  it("is a Velobits-wide page at /legal/payments", () => {
    expect(paymentsMeta.alternates?.canonical).toBe("https://velobits.dev/legal/payments");
    render(<PaymentsPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Payment Policy/i);
  });

  it("covers billing, cancellation and refunds, and says Revon is free", () => {
    const { container } = render(<PaymentsPage />);
    const text = container.textContent ?? "";
    for (const needle of [
      "Revon is free",
      "Razorpay",
      "Prices and billing",
      "Cancellation",
      "No refunds",
      "5 to 7 business days",
    ]) {
      expect(text).toContain(needle);
    }
  });

  it("makes every purchase final, covers future Revon payments and requires verified payments", () => {
    const { container } = render(<PaymentsPage />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/final and non-refundable/);
    expect(text).toMatch(
      /If paid\s+features are added to Revon|If paid features are added to Revon/
    );
    expect(text).toMatch(/verified with our payment provider/);
    expect(text).toMatch(/FixMyText can be used by anyone/);
    expect(text).not.toMatch(/we will refund the extra payment/i);
  });
});

describe("embed mode script", () => {
  it("only reacts to ?embed=1, never redirects the page load and keeps embed on internal links", () => {
    expect(EMBED_SCRIPT).toContain('"embed"');
    expect(EMBED_SCRIPT).toContain('setAttribute("data-embed"');
    // The only navigation is the click handler's, so there is no redirect on load.
    expect(EMBED_SCRIPT.match(/location\.assign/g)).toHaveLength(1);
    expect(EMBED_SCRIPT).toContain('addEventListener("click"');
  });
});

describe("Velobits privacy policy", () => {
  it("is the company website policy at /legal/privacy, separate from Revon and FixMyText", async () => {
    const { default: VelobitsPrivacyPage, metadata } = await import("../../app/legal/privacy/page");
    expect(metadata.alternates?.canonical).toBe("https://velobits.dev/legal/privacy");
    const { container } = render(<VelobitsPrivacyPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Privacy Policy/i);
    const text = container.textContent ?? "";
    for (const needle of [
      "Velobits website",
      "waitlist",
      "Google Sheet",
      "Vercel",
      "no cookies",
      "Revon Privacy Policy",
      "FixMyText",
      "support@velobits.dev",
    ]) {
      expect(text).toContain(needle);
    }
    expect(text).not.toContain("precise location");
    expect(text).not.toContain("emergency contacts");
  });
});

describe("Revon privacy policy: account-stored data", () => {
  it("covers settings, ride history, bikes, Medical ID and emergency contacts", async () => {
    const { default: Privacy } = await import("../../app/app/revon/privacy/page");
    const { container } = render(<Privacy />);
    const text = container.textContent ?? "";
    for (const needle of [
      "App settings",
      "Ride history",
      "Bikes",
      "hidden registration number",
      "Medical ID",
      "insurance policy number",
      "organ donor",
      "Emergency contacts",
      "https://revon.velobits.dev/join/CODE",
      "QR code",
      "Summary for app store listings",
      "Bike model suggestions",
      "Saved places",
      "not shared",
      "brand and model name",
      "asks before changing it",
      "account ID and the time you sent it",
    ]) {
      expect(text).toContain(needle);
    }
  });

  it("says who sees the Medical ID, and drops the claims that are no longer true", async () => {
    const { default: Privacy } = await import("../../app/app/revon/privacy/page");
    const { container } = render(<Privacy />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/only while an SOS from you is active/);
    expect(text).toMatch(/only when you choose to share that card/);
    expect(text).toMatch(/Your ride history, your saved places, your bikes/);
    expect(text).toMatch(/Nothing else about the bike is sent/);
    expect(text).toMatch(/insurance policy number/);
    expect(text).not.toMatch(/Emergency details stay private/);
    expect(text).not.toMatch(/Emergency details are not shown to the group/);
    expect(text).not.toMatch(/They are not uploaded/);
    expect(text).toMatch(/do not sell/);
  });

  it("keeps the section numbers its own cross references use", async () => {
    const { default: Privacy } = await import("../../app/app/revon/privacy/page");
    const { container } = render(<Privacy />);
    const heading = (id: string) =>
      container.querySelector(`#${id} h2`)?.textContent?.slice(0, 2) ?? "";
    expect(heading("who-sees-what")).toBe("04");
    expect(heading("sharing")).toBe("05");
    expect(heading("retention")).toBe("07");
    expect(heading("delete-account")).toBe("09");
    expect(heading("other-policies")).toBe("11");
  });
});
