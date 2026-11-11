import { render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { GET as assetlinks } from "../../app/.well-known/assetlinks.json/route";
import { GET as aasa } from "../../app/.well-known/apple-app-site-association/route";
import JoinPage from "../../app/join/[code]/page";
import { androidFingerprints, appleTeamId, normalizeRideCode, RIDE_CODE } from "@/lib/revon-links";

const PLAY =
  "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99";

afterEach(() => vi.unstubAllEnvs());

describe("assetlinks.json (Android App Links)", () => {
  it("vouches for the Revon package with the release key, as JSON", async () => {
    const res = assetlinks();
    expect(res.headers.get("content-type")).toContain("application/json");
    const [entry] = await res.json();
    expect(entry.relation).toEqual(["delegate_permission/common.handle_all_urls"]);
    expect(entry.target.namespace).toBe("android_app");
    expect(entry.target.package_name).toBe("com.velobits.Revon");
    expect(entry.target.sha256_cert_fingerprints).toContain(
      "8C:FE:85:0D:81:8D:D4:FA:21:CD:63:8A:DC:BB:B0:05:E2:E4:8B:10:CB:A1:2C:DD:D3:A3:98:47:B2:A9:22:CC"
    );
  });

  it("adds Google Play's signing key from the environment and ignores malformed values", () => {
    expect(
      androidFingerprints({ REVON_PLAY_SIGNING_SHA256: `${PLAY.toLowerCase()}, nonsense` } as never)
    ).toEqual([expect.stringMatching(/^8C:FE/), PLAY]);
    expect(androidFingerprints({} as never)).toHaveLength(1);
  });
});

describe("apple-app-site-association (iOS Universal Links)", () => {
  it("answers 503 instead of publishing a made-up Team ID when none is set", async () => {
    vi.stubEnv("REVON_APPLE_TEAM_ID", "");
    const res = aasa();
    expect(res.status).toBe(503);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("scopes the app to /join/* for the Team ID and bundle id", async () => {
    vi.stubEnv("REVON_APPLE_TEAM_ID", "ab12cd34ef");
    const res = aasa();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const body = await res.json();
    expect(body.applinks.details[0].appIDs).toEqual(["AB12CD34EF.com.velobits.Revon"]);
    expect(body.applinks.details[0].components).toEqual([
      { "/": "/join/*", comment: "Revon ride invites" },
    ]);
  });

  it("rejects a Team ID that is not 10 letters or digits", () => {
    expect(appleTeamId({ REVON_APPLE_TEAM_ID: "short" } as never)).toBeNull();
    expect(appleTeamId({ REVON_APPLE_TEAM_ID: "AB12CD34EF" } as never)).toBe("AB12CD34EF");
  });
});

describe("ride codes", () => {
  it("accepts the six-character alphabet the app generates and rejects look-alike characters", () => {
    expect(RIDE_CODE.test("K7M2QX")).toBe(true);
    expect(RIDE_CODE.test("k7m2qx")).toBe(false);
    expect(RIDE_CODE.test(normalizeRideCode(" k7m2qx "))).toBe(true);
    for (const bad of ["K7M2Q", "K7M2QXX", "K7M2Q0", "K7M2QO", "K7M2QI", "K7M2Q1", ""]) {
      expect(RIDE_CODE.test(bad)).toBe(false);
    }
  });
});

describe("join page", () => {
  const render_ = async (code: string) =>
    render(await JoinPage({ params: Promise.resolve({ code }) }));

  it("shows the code and an Open in Revon button using the app's own scheme as a fallback", async () => {
    await render_("k7m2qx");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/invited to a ride/i);
    expect(screen.getByText("K7M2QX")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open in Revon/i })).toHaveAttribute(
      "href",
      "revon://join/K7M2QX"
    );
  });

  it("offers the waitlist while the app is not in the stores", async () => {
    await render_("K7M2QX");
    expect(screen.getByRole("link", { name: /Join the waitlist/i })).toHaveAttribute(
      "href",
      "/#waitlist"
    );
    expect(screen.queryByText(/Google Play/i)).not.toBeInTheDocument();
  });

  it("explains a malformed code instead of offering a broken link", async () => {
    await render_("nope");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/looks wrong/i);
    expect(screen.queryByRole("link", { name: /Open in Revon/i })).not.toBeInTheDocument();
  });

  it("is kept out of search engines", async () => {
    const { metadata } = await import("../../app/join/[code]/page");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
