/* Public configuration only. Never put secrets, API keys, passwords or private tokens here. */
window.ATELIER_CONFIG = Object.freeze({
  SITE_URL: "", // e.g. https://www.example.com — required for production canonical/share metadata.
  ANALYTICS: {
    provider: "google-analytics", // Set to "none" to keep analytics disabled.
    measurementId: "" // e.g. G-XXXXXXXXXX; leave blank to disable.
  },
  ADS: {
    enabled: false // Enable only after inserting the official Adsterra code in the marked slots.
  }
});
