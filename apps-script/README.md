# Velobits website backend (Google Apps Script)

This folder is a **reference copy** of the Apps Script that backs the website's
community poll, idea form, early-access signup, and update broadcasts. It is **not
part of the Next.js build** — it runs inside Google, bound to a Google Sheet.

The website never touches the Sheet or Gmail directly. It calls these scripts
server-side only (from `app/api/*` route handlers), so the script URL and shared
token never reach the browser and there is no CORS.

## One-time setup

1. **Create the Sheet** with five tabs, each with a frozen header row (row 1):

   | Tab           | Columns (in order)                                                    |
   | ------------- | --------------------------------------------------------------------- |
   | `Subscribers` | `timestamp` `email` `source` `status` `user_agent`                    |
   | `Ideas`       | `timestamp` `idea` `email` `user_agent`                               |
   | `Votes`       | `timestamp` `poll_id` `option_id` `voter_id`                          |
   | `Polls`       | `poll_id` `option_id` `option_label` `count`                          |
   | `Updates`     | `id` `date` `type` `title` `body` `published` `broadcast_sent` `link` |
   - Seed **Polls** with the starting options at `count = 0`:
     - `next-app` `fixmytext` `FixMyText` `0`
     - `next-app` `note-sharing` `Note-sharing app` `0`
   - In **Updates**, make `published` and `broadcast_sent` **checkbox** columns
     (Insert → Checkbox) so they store real booleans.

2. **Extensions → Apps Script.** Create three script files and paste in
   `Code.gs`, `email.gs`, `broadcast.gs` from this folder.

3. **Project Settings → Script Properties** → add `SHARED_TOKEN` = a long random
   string. Use the same value for the website's `APPS_SCRIPT_TOKEN`.

4. **Deploy → New deployment → Web app:**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Authorize the Gmail + Sheets scopes on first run.
   - Copy the `/exec` URL → website's `APPS_SCRIPT_URL`.

5. Reload the Sheet once so the **Velobits** menu appears (from `onOpen`).

## Sending updates

1. Add a row to **Updates** (`id`, `date`, `type` = launch/feature/update/fix,
   `title`, `body`, optional `link`) and tick **published**.
2. The on-site "Latest Updates" section picks it up within ~5 minutes (ISR).
3. To email subscribers: menu **Velobits → Send pending update emails**. Each
   published-but-not-yet-sent row is emailed, then its `broadcast_sent` is ticked.

## Notes

- Gmail send quota: ~100 recipients/day (consumer) or ~1,500/day (Workspace).
  The broadcast guards against exceeding the daily quota and resumes next day.
- `Code.gs` returns `{ ok: true|false }` JSON; the website branches on `ok`
  because Apps Script returns HTTP 200 even on internal errors.
