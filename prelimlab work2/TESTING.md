Manual Test Checklist for Prelim Lab Work 2

1) Open the app
   - Open `index.html` in a browser (double-click the file or use a local server).

2) Successful login
   - Enter username: `admin` and password: `1234` then click LOG IN.
   - Expected: Message "✅ Login successful" appears, timestamp updates, attendance entry appears in the list, inputs clear and focus returns to Username.
   - Expected: "Download CSV" and "Clear" buttons become enabled.

3) Failed login
   - Enter invalid credentials and submit.
   - Expected: Message "❌ Invalid username or password." appears and a short beep plays (if the browser supports Web Audio).

4) Download CSV
   - After at least one successful login, click "Download CSV".
   - Expected: A file named `attendance_summary.csv` downloads containing recorded entries with proper CSV quoting.

5) Clear records
   - Click "Clear" and confirm.
   - Expected: Attendance list clears, buttons become disabled, message shows "⚪ Attendance cleared."

6) Edge cases
   - Try downloading with no records: an alert should indicate no records.
   - Try clearing when no records: button should be disabled.

7) Accessibility & UI
   - Ensure keyboard navigation works (tab through inputs and buttons).
   - Check that live status message is provided (`aria-live` present).

Notes & Troubleshooting
- If the beep does not play, your browser may not support autoplay or Web Audio; this is non-critical.
- If the CSV does not trigger a download, verify that popups or downloads aren't blocked by the browser.

If you want, I can add automated UI tests (Playwright) or a small README update with more details.