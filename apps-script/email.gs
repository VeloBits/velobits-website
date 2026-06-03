/**
 * Email templates + sender (Gmail, via GmailApp).
 * Reference copy — see Code.gs header for deployment notes.
 *
 * Modeled on FixMyText's email style: a small responsive HTML shell + a plaintext
 * fallback, with all user-controlled values HTML-escaped. Sends from the script
 * owner's Gmail with a "Velobits" display name (set FROM_NAME below). For a branded
 * from-address (e.g. hello@velobits.dev) configure a Workspace send-as alias and
 * pass it via the `from` option.
 */

var FROM_NAME = "Velobits";
var SITE_URL = "https://velobits.dev";

function sendThankYouEmail_(email) {
  var subject = "Thanks for joining the Velobits early list 🎉";
  var rendered = thankYouTemplate_();
  GmailApp.sendEmail(email, subject, rendered.text, {
    name: FROM_NAME,
    htmlBody: rendered.html,
  });
}

/** Used by broadcast.gs for each update email. */
function sendUpdateEmail_(email, update) {
  var subject = "Velobits update: " + update.title;
  var rendered = updateTemplate_(update);
  GmailApp.sendEmail(email, subject, rendered.text, {
    name: FROM_NAME,
    htmlBody: rendered.html,
  });
}

/* ── Templates ─────────────────────────────────────────────────── */

function thankYouTemplate_() {
  var heading = "You're on the list!";
  var intro =
    "Thanks for subscribing to Velobits early updates. You'll be the first to hear " +
    "about new launches, features, and improvements — no spam, ever.";
  return shell_(heading, intro, "Visit Velobits", SITE_URL);
}

function updateTemplate_(update) {
  var heading = esc_(update.title);
  var intro = esc_(update.body || "");
  var cta = update.link ? "Read more" : "Visit Velobits";
  var url = update.link || SITE_URL;
  return shell_(heading, intro, cta, url);
}

/**
 * Returns { html, text }. `heading` and `intro` are already trusted/escaped by
 * callers where they contain user data.
 */
function shell_(heading, intro, ctaLabel, ctaUrl) {
  var html =
    '<div style="margin:0;padding:0;background:#0a0a0a;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 0;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#141414;border:1px solid rgba(200,241,53,0.18);border-radius:16px;overflow:hidden;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">' +
    '<tr><td style="padding:28px 32px 8px;">' +
    '<span style="color:#c8f135;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Velobits</span>' +
    "</td></tr>" +
    '<tr><td style="padding:8px 32px 0;">' +
    '<h1 style="margin:0;color:#ffffff;font-size:22px;line-height:1.3;font-weight:800;">' +
    heading +
    "</h1></td></tr>" +
    '<tr><td style="padding:14px 32px 0;">' +
    '<p style="margin:0;color:#b5b5b5;font-size:15px;line-height:1.7;">' +
    intro +
    "</p></td></tr>" +
    '<tr><td style="padding:24px 32px 32px;">' +
    '<a href="' +
    esc_(ctaUrl) +
    '" style="display:inline-block;background:#c8f135;color:#0c0c0c;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:9999px;">' +
    esc_(ctaLabel) +
    "</a></td></tr>" +
    '<tr><td style="padding:0 32px 28px;border-top:1px solid rgba(255,255,255,0.06);">' +
    '<p style="margin:16px 0 0;color:#666;font-size:12px;line-height:1.6;">' +
    "You're receiving this because you joined the Velobits early list. " +
    "Reply to this email to unsubscribe.</p>" +
    "</td></tr>" +
    "</table></td></tr></table></div>";

  var text =
    heading +
    "\n\n" +
    stripTags_(intro) +
    "\n\n" +
    ctaLabel +
    ": " +
    ctaUrl +
    "\n\n— Velobits\nYou're receiving this because you joined the Velobits early list. Reply to unsubscribe.";

  return { html: html, text: text };
}

function esc_(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripTags_(s) {
  return String(s).replace(/<[^>]*>/g, "");
}
