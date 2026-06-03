/**
 * Velobits website backend — Google Apps Script (bound to the submissions Sheet).
 *
 * This file is a REFERENCE COPY kept in the repo for versioning. It does NOT run
 * in the Next.js build. To use it: open the Sheet → Extensions → Apps Script,
 * paste Code.gs / email.gs / broadcast.gs, set the Script Property SHARED_TOKEN
 * (Project Settings → Script Properties), then Deploy → New deployment → Web app
 * (Execute as: Me, Who has access: Anyone). Copy the /exec URL into APPS_SCRIPT_URL.
 *
 * Tabs (frozen header row 1):
 *   Subscribers : timestamp | email | source | status | user_agent
 *   Ideas       : timestamp | idea  | email  | user_agent
 *   Votes       : timestamp | poll_id | option_id | voter_id
 *   Polls       : poll_id | option_id | option_label | count        (seed rows at 0)
 *   Updates     : id | date | type | title | body | published | broadcast_sent | link
 */

var TABS = {
  subscribers: "Subscribers",
  ideas: "Ideas",
  votes: "Votes",
  polls: "Polls",
  updates: "Updates",
};

var LIMITS = { idea: 2000, email: 254 };

/* ── HTTP entry points ─────────────────────────────────────────── */

function doGet(e) {
  try {
    if (!tokenOk_(e && e.parameter && e.parameter.token)) {
      return json_({ ok: false, error: "unauthorized" });
    }
    var type = (e && e.parameter && e.parameter.type) || "";
    if (type === "poll") return json_({ ok: true, counts: readPolls_() });
    if (type === "updates") return json_({ ok: true, updates: readUpdates_() });
    return json_({ ok: false, error: "unknown_type" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!tokenOk_(body.token)) return json_({ ok: false, error: "unauthorized" });

    switch (body.action) {
      case "subscribe":
        return json_(handleSubscribe_(body));
      case "idea":
        return json_(handleIdea_(body));
      case "vote":
        return json_(handleVote_(body));
      default:
        return json_({ ok: false, error: "unknown_action" });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ── Action handlers ───────────────────────────────────────────── */

function handleSubscribe_(body) {
  var email = String(body.email || "")
    .trim()
    .toLowerCase();
  if (!isEmail_(email) || email.length > LIMITS.email) {
    return { ok: false, error: "invalid_email" };
  }
  var sheet = sheet_(TABS.subscribers);
  if (emailExists_(sheet, email)) {
    return { ok: true, already: true }; // idempotent: don't resend / duplicate
  }
  sheet.appendRow([
    new Date().toISOString(),
    email,
    String(body.source || "waitlist"),
    "active",
    String(body.user_agent || ""),
  ]);
  try {
    sendThankYouEmail_(email); // defined in email.gs
  } catch (err) {
    // Never fail the signup because the email hiccupped; the row is already saved.
    console.warn("thank-you email failed: " + err);
  }
  return { ok: true };
}

function handleIdea_(body) {
  var idea = String(body.idea || "").trim();
  if (!idea) return { ok: false, error: "empty" };
  if (idea.length > LIMITS.idea) idea = idea.slice(0, LIMITS.idea);
  sheet_(TABS.ideas).appendRow([
    new Date().toISOString(),
    idea,
    String(body.email || "")
      .trim()
      .toLowerCase(),
    String(body.user_agent || ""),
  ]);
  return { ok: true };
}

function handleVote_(body) {
  var pollId = String(body.poll_id || "").trim();
  var optionId = String(body.option_id || "").trim();
  var voterId = String(body.voter_id || "").trim();

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var polls = sheet_(TABS.polls);
    var rows = polls.getDataRange().getValues(); // incl. header
    var rowIndex = -1;
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === pollId && String(rows[i][1]) === optionId) {
        rowIndex = i;
        break;
      }
    }
    if (rowIndex === -1) return { ok: false, error: "unknown_option" };

    // Soft dedupe: ignore the increment if this voter already voted in this poll,
    // but still return current counts so the UI shows results.
    if (voterId && voterHasVoted_(pollId, voterId)) {
      return { ok: true, already: true, counts: readPolls_() };
    }

    sheet_(TABS.votes).appendRow([new Date().toISOString(), pollId, optionId, voterId]);
    var countCol = 4; // 1-based: poll_id|option_id|option_label|count
    var current = Number(rows[rowIndex][3]) || 0;
    polls.getRange(rowIndex + 1, countCol).setValue(current + 1);
    SpreadsheetApp.flush();
    return { ok: true, counts: readPolls_() };
  } finally {
    lock.releaseLock();
  }
}

/* ── Readers ───────────────────────────────────────────────────── */

function readPolls_() {
  var rows = sheet_(TABS.polls).getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    out.push({
      poll_id: String(rows[i][0]),
      option_id: String(rows[i][1]),
      option_label: String(rows[i][2]),
      count: Number(rows[i][3]) || 0,
    });
  }
  return out;
}

function readUpdates_() {
  var rows = sheet_(TABS.updates).getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    if (rows[i][5] !== true) continue; // published checkbox
    var d = rows[i][1];
    out.push({
      id: String(rows[i][0]),
      date: d instanceof Date ? d.toISOString() : String(d),
      type: String(rows[i][2] || "update"),
      title: String(rows[i][3] || ""),
      body: String(rows[i][4] || ""),
      link: String(rows[i][7] || ""),
    });
  }
  out.sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; // newest first
  });
  return out;
}

/* ── Helpers ───────────────────────────────────────────────────── */

function sheet_(name) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error("missing tab: " + name);
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function tokenOk_(token) {
  var expected = PropertiesService.getScriptProperties().getProperty("SHARED_TOKEN");
  return !!expected && token === expected;
}

function isEmail_(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function emailExists_(sheet, email) {
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][1]).trim().toLowerCase() === email) return true;
  }
  return false;
}

function voterHasVoted_(pollId, voterId) {
  var values = sheet_(TABS.votes).getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][1]) === pollId && String(values[i][3]) === voterId) return true;
  }
  return false;
}
