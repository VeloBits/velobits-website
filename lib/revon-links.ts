/**
 * Facts the Revon app's https invite links depend on: https://revon.velobits.dev/join/CODE.
 *
 * Android App Links and iOS Universal Links only work when the website vouches for the
 * app, through /.well-known/assetlinks.json and /.well-known/apple-app-site-association.
 * Everything those two files need lives here. All values are public (they are served to
 * anyone who asks), but two of them are only known to the people who run the store
 * accounts, so they come from environment variables:
 *
 *   REVON_APPLE_TEAM_ID           the 10-character Apple Developer Team ID
 *   REVON_PLAY_SIGNING_SHA256     the SHA-256 of Google Play's app signing key (Play Console →
 *                                 Test and release → App signing), comma separated if several
 */
export const REVON_HOST = "revon.velobits.dev";

export const ANDROID_PACKAGE = "com.velobits.Revon";
export const IOS_BUNDLE_ID = "com.velobits.Revon";

/** SHA-256 of the release keystore that signs every EAS and local Android build. */
const RELEASE_KEYSTORE_SHA256 =
  "8C:FE:85:0D:81:8D:D4:FA:21:CD:63:8A:DC:BB:B0:05:E2:E4:8B:10:CB:A1:2C:DD:D3:A3:98:47:B2:A9:22:CC";

const FINGERPRINT = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;

function listFrom(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => FINGERPRINT.test(s));
}

/** Every certificate an installed Revon can be signed with. Play re-signs installs from the store. */
export function androidFingerprints(env: NodeJS.ProcessEnv = process.env): string[] {
  return [...new Set([RELEASE_KEYSTORE_SHA256, ...listFrom(env.REVON_PLAY_SIGNING_SHA256)])];
}

export function appleTeamId(env: NodeJS.ProcessEnv = process.env): string | null {
  const id = (env.REVON_APPLE_TEAM_ID ?? "").trim().toUpperCase();
  return /^[A-Z0-9]{10}$/.test(id) ? id : null;
}

/**
 * Where to get Revon. Play is the app's listing (it only resolves once the app is published,
 * so merge and deploy after the Play release). The App Store link is not known yet: set it
 * here when the iOS app has a listing, and the join page shows the button on its own.
 */
export const revonStores: { android: string | null; ios: string | null } = {
  android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
  ios: null, // TODO: App Store link, e.g. https://apps.apple.com/app/revon/id<ascAppId>
};

/** The characters a ride code can contain (see app/src/lib/rides.ts in the Revon repo). */
export const RIDE_CODE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/;

export function normalizeRideCode(raw: string): string {
  return raw.trim().toUpperCase();
}
