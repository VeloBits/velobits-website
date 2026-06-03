/**
 * Update broadcasts — admin-triggered from a custom Sheet menu.
 * Reference copy — see Code.gs header for deployment notes.
 *
 * Admin workflow:
 *   1. Add a row to the "Updates" tab and tick `published`.
 *   2. Menu: Velobits → "Send pending update emails".
 * Each published row that hasn't been broadcast is emailed to every active
 * subscriber, then its `broadcast_sent` cell is ticked so it never re-sends.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Velobits")
    .addItem("Send pending update emails", "sendPendingBroadcasts")
    .addToUi();
}

function sendPendingBroadcasts() {
  var ui = SpreadsheetApp.getUi();
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    ui.alert("A broadcast is already running. Try again in a moment.");
    return;
  }
  try {
    var updates = sheet_(TABS.updates);
    var rows = updates.getDataRange().getValues(); // incl. header
    var subscribers = activeSubscribers_();
    var publishedCol = 6; // 1-based: ...|published(6)|broadcast_sent(7)
    var sentCol = 7;

    var remaining = MailApp.getRemainingDailyQuota();
    var sentUpdates = 0;
    var skipped = false;

    for (var i = 1; i < rows.length; i++) {
      var published = rows[i][5] === true;
      var alreadySent = rows[i][6] === true;
      if (!published || alreadySent) continue;

      if (subscribers.length > remaining) {
        skipped = true; // not enough Gmail quota left today
        break;
      }

      var update = {
        id: String(rows[i][0]),
        title: String(rows[i][3] || ""),
        body: String(rows[i][4] || ""),
        link: String(rows[i][7] || ""),
      };

      for (var s = 0; s < subscribers.length; s++) {
        sendUpdateEmail_(subscribers[s], update); // defined in email.gs
      }
      remaining -= subscribers.length;

      // Mark THIS row sent immediately, so a later failure can't re-send it.
      updates.getRange(i + 1, sentCol).setValue(true);
      SpreadsheetApp.flush();
      sentUpdates++;
    }

    if (sentUpdates === 0 && !skipped) {
      ui.alert("No pending updates to send.");
    } else if (skipped) {
      ui.alert(
        "Sent " +
          sentUpdates +
          " update(s). Stopped early — not enough Gmail quota left today for " +
          subscribers.length +
          " subscribers. Run again tomorrow to send the rest."
      );
    } else {
      ui.alert("Sent " + sentUpdates + " update(s) to " + subscribers.length + " subscriber(s).");
    }
  } finally {
    lock.releaseLock();
  }
}

function activeSubscribers_() {
  var values = sheet_(TABS.subscribers).getDataRange().getValues();
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var email = String(values[i][1]).trim();
    var status = String(values[i][3]).trim().toLowerCase();
    if (email && status !== "unsubscribed") out.push(email);
  }
  return out;
}
