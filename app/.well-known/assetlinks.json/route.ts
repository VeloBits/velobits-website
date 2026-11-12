import { ANDROID_PACKAGE, androidFingerprints } from "@/lib/revon-links";

/**
 * Android App Links: tells Android that this site's /join links belong to the Revon app,
 * so tapping https://revon.velobits.dev/join/CODE opens the app instead of a browser.
 * Must be served as JSON with no redirect.
 */
export function GET() {
  const body = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE,
        sha256_cert_fingerprints: androidFingerprints(),
      },
    },
  ];
  return Response.json(body, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
  });
}
