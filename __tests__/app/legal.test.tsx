import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PrivacyPage, { metadata as privacyMeta } from "../../app/app/revon/privacy/page";
import TermsPage, { metadata as termsMeta } from "../../app/app/revon/terms/page";

describe("Revon privacy policy", () => {
  it("has a title and a canonical URL on the public domain", () => {
    expect(privacyMeta.title).toMatch(/Revon Privacy Policy/);
    expect(privacyMeta.alternates?.canonical).toBe("https://velobits.dev/app/revon/privacy");
  });

  it("renders a single h1, a date and a table of contents", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/Last updated/i)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /On this page/i })).toBeInTheDocument();
  });

  it("discloses the data types, third parties and deletion that store reviewers look for", () => {
    const { container } = render(<PrivacyPage />);
    const text = container.textContent ?? "";
    for (const needle of [
      "Precise location",
      "Mobile number",
      "emergency contacts",
      "Google Maps Platform",
      "OpenStreetMap",
      "Firebase",
      "Delete my account",
      "do not sell",
      "13",
    ]) {
      expect(text).toContain(needle);
    }
  });

  it("has anchors for the website section and for account deletion", () => {
    const { container } = render(<PrivacyPage />);
    expect(container.querySelector("#website")).not.toBeNull();
    expect(container.querySelector("#delete-account")).not.toBeNull();
  });

  it("gives a way to reach us", () => {
    render(<PrivacyPage />);
    expect(screen.getAllByRole("link", { name: "support@velobits.dev" })[0]).toHaveAttribute(
      "href",
      "mailto:support@velobits.dev"
    );
  });
});

describe("Revon terms of service", () => {
  it("has a title and a canonical URL on the public domain", () => {
    expect(termsMeta.title).toMatch(/Revon Terms of Service/);
    expect(termsMeta.alternates?.canonical).toBe("https://velobits.dev/app/revon/terms");
  });

  it("renders a single h1", () => {
    render(<TermsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Terms of Service/i })
    ).toBeInTheDocument();
  });

  it("states that SOS is not an emergency service", () => {
    const { container } = render(<TermsPage />);
    expect(container.textContent).toMatch(/SOS is not an emergency service/i);
  });

  it("links to the privacy policy", () => {
    render(<TermsPage />);
    expect(screen.getAllByRole("link", { name: /Privacy Policy/i })[0]).toHaveAttribute(
      "href",
      "/app/revon/privacy"
    );
  });
});
