CACTUS OS — INSTALLATION

WHAT'S INCLUDED
- Responsive plant-care dashboard for your 95 mm desk cactus
- Daily checklist, soil-check log, watering log and journal
- Fortnightly check-in tracker
- Installable PWA manifest and offline service worker
- Local data storage in the browser on this device

IMPORTANT
This is a local-first web app. Your records are stored in this browser/device using localStorage.
They are not automatically synced between devices and can be lost if browser site data is cleared.
Export/backup and cross-device sync are not included in this first version.

REMINDERS
The app calculates a fortnightly check-in based on the date you complete a check-in.
Browser notifications are best-effort and only checked when the app is opened. This version does
not have a push-notification server, so it cannot guarantee an alert while the app is closed.
Use a recurring phone reminder as a reliable backup.

RUN LOCALLY
For PWA/offline features, serve this folder over HTTPS or localhost.
A simple local development server can be started with:
  python3 -m http.server 8000
Then open:
  http://localhost:8000

IPHONE INSTALLATION
1. Publish the folder to an HTTPS static host (for example GitHub Pages or Netlify).
2. Open the HTTPS site in Safari on your iPhone.
3. Tap Share, then Add to Home Screen.
4. Launch Cactus OS from the new home-screen icon.

CARE NOTE
The cactus species has not been confirmed. The app deliberately says to inspect soil and water only
when the potting mix has dried sufficiently throughout. It does not impose an automatic watering
interval.
