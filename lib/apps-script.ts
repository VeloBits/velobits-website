// Server-only helper for talking to the Google Apps Script web app.
//
// The browser must NEVER import this: it reads server-only env vars (no
// NEXT_PUBLIC_ prefix, so they're not in the client bundle) and holds the shared
// token. It is imported only by route handlers (app/api/*) and the server-side
// updates fetch (lib/updates.ts). The guard below turns any accidental client
// import into a loud runtime error.

if (typeof window !== "undefined") {
  throw new Error("lib/apps-script.ts is server-only and must not be imported in the browser.");
}

export type ScriptOk<T> = { ok: true } & T;

/** Returns true when both env vars are set. Route handlers should check this
 *  before calling postToScript / getFromScript so they can return a graceful
 *  "not configured" response instead of a 502 stack trace during local dev. */
export function isConfigured(): boolean {
  return !!(process.env.APPS_SCRIPT_URL && process.env.APPS_SCRIPT_TOKEN);
}

function endpoint(): string {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) throw new Error("APPS_SCRIPT_URL is not configured");
  return url;
}

function token(): string {
  const t = process.env.APPS_SCRIPT_TOKEN;
  if (!t) throw new Error("APPS_SCRIPT_TOKEN is not configured");
  return t;
}

/**
 * POST an action to the Apps Script web app. `fetch` follows the Apps Script 302
 * redirect to googleusercontent.com automatically (do not set redirect: "manual").
 * Apps Script returns HTTP 200 even on its own errors, so we branch on the JSON
 * `ok` flag, not the status code.
 */
export async function postToScript<T = Record<string, unknown>>(
  action: string,
  payload: Record<string, unknown>
): Promise<ScriptOk<T>> {
  const res = await fetch(endpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, token: token(), ...payload }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Apps Script responded ${res.status}`);
  const data = (await res.json()) as { ok?: boolean; error?: string };
  if (!data.ok) throw new Error(`Apps Script error: ${data.error ?? "unknown"}`);
  return data as ScriptOk<T>;
}

/**
 * GET data (poll counts or updates) from the Apps Script web app. `init` lets
 * callers set Next.js cache behavior, e.g. { next: { revalidate: 300 } }.
 */
export async function getFromScript<T = Record<string, unknown>>(
  type: string,
  init?: RequestInit & { next?: { revalidate?: number } }
): Promise<ScriptOk<T>> {
  const url = `${endpoint()}?type=${encodeURIComponent(type)}&token=${encodeURIComponent(token())}`;
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Apps Script responded ${res.status}`);
  const data = (await res.json()) as { ok?: boolean; error?: string };
  if (!data.ok) throw new Error(`Apps Script error: ${data.error ?? "unknown"}`);
  return data as ScriptOk<T>;
}
