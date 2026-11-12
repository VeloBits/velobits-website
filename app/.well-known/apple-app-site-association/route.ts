import { IOS_BUNDLE_ID, appleTeamId } from "@/lib/revon-links";

/**
 * iOS Universal Links: tells iOS that /join links on this site belong to the Revon app.
 * Must be served as JSON (the file has no extension), with no redirect.
 *
 * It needs the Apple Team ID, which only the account holder knows. Until
 * REVON_APPLE_TEAM_ID is set this answers 503 rather than publishing a file with a
 * made-up ID, so a missing setting is obvious instead of silently breaking links.
 */
export function GET() {
  const team = appleTeamId();
  if (!team) {
    return Response.json(
      { error: "REVON_APPLE_TEAM_ID is not set" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  const body = {
    applinks: {
      details: [
        {
          appIDs: [`${team}.${IOS_BUNDLE_ID}`],
          components: [{ "/": "/join/*", comment: "Revon ride invites" }],
        },
      ],
    },
  };
  return Response.json(body, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
  });
}
