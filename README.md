# The Wedding Atelier — Static Creative Platform

A framework-free, browser-first wedding and mehndi creative platform built with plain HTML, CSS and JavaScript. The core experience requires no Node.js build, database, account, AI API or paid SaaS service.

## Architecture

- `index.html` — semantic page shell, SEO/social metadata, navigation, library/generator/tool/legal mount points, ad placeholders and language selector.
- `style.css` — design system, responsive layouts, accessibility focus states, RTL support, reduced-motion support and tool styling.
- `data.js` — structured catalogue source: 30 categories × 250 concepts = 7,500 concepts.
- `script.js` — original library controller, Prompt Studio, 30 tool registry/implementations, hash routing and legal content.
- `site-config.js` — public, non-secret owner configuration for production URL, optional analytics ID and advertising enablement.
- `analytics.js` — provider-neutral event boundary with optional, consent-gated Google Analytics loading.
- `i18n.js` — language dictionary and RTL direction management. Catalogue/prompt source data is not destructively translated.
- `app-enhancements.js` — local personalization, retention features, tool favourites, sharing, PWA registration, consent UI and ad-slot behaviour.
- `manifest.webmanifest` — install metadata.
- `service-worker.js` — versioned same-origin shell/offline cache with stale-cache cleanup.
- `og-cover.svg` — lightweight social/PWA artwork; replace with brand artwork if desired.
- `robots.txt` — basic crawler policy.
- `_headers` — practical static-host security headers for Cloudflare Pages-style deployments.
- `verify.js` — dependency-free source/catalogue/security/architecture checks.

## Existing functionality preserved

- 30 design categories.
- 7,500 catalogue concepts.
- Category/subcategory filtering, search, sorting, favourites, details, copy and Load More.
- Prompt Studio generation, regeneration, copying and reset.
- 30 browser tools: 10 mehndi prompt tools, 10 image/design tools, 10 wedding utilities.
- Browser-local image processing with existing file limits and canvas safeguards.
- Hash routes such as `#tools`, `#tool/mehndi-prompt-generator`, and `#legal/privacy-policy`.
- Legal pages, responsive layout and reduced-motion support.

The catalogue records remain creative concepts/prompts; they are not presented as photographs or finished physical designs.

## New free-first features

- Recently viewed design history.
- Daily locally selected inspiration.
- Surprise Me/random inspiration.
- Recent tools and saved tool favourites.
- Recent searches and copied-prompt history stored locally.
- Continue-exploring surface in the Design Library.
- Tool search and saved-tool filtering.
- Web Share API with clipboard fallback.
- English, Urdu, Hindi, Arabic, Spanish, French and Turkish UI dictionary architecture.
- Automatic RTL document direction for Urdu/Arabic.
- Consent-gated optional analytics architecture.
- Reserved, clearly labelled Adsterra placement containers.
- Installable PWA shell and offline fallback for same-origin core assets.
- Versioned local workspace schema with migration from the original `wmd-favorites` key.

## Local storage

The enhancement layer uses `weddingAtelier:v2`. It stores only lightweight local preferences/history and never requires an account. Reads/writes are guarded with `try/catch`; quota failure falls back to a smaller history footprint. The original `wmd-favorites` favourites are imported when the new workspace is first created.

If localStorage is disabled, the original site features that do not depend on persistence continue to work. Do not put sensitive information into the site.

## Multilingual behaviour

The language selector is visible in the top navigation. UI resources are separated into `i18n.js`; application/data logic remains independent. English is the fallback. Urdu and Arabic set `dir="rtl"` on the document. Catalogue prompts and user-entered text are not machine-translated or overwritten.

To add a language, add a new language object to the dictionary in `i18n.js` and add its selector option in `index.html`. Expand dynamic tool strings there as the translated vocabulary grows.

## Analytics

Analytics is disabled until the owner configures a real measurement ID and optional consent is granted.

Edit `site-config.js`:

```js
ANALYTICS: {
  provider: "google-analytics",
  measurementId: "G-XXXXXXXXXX"
}
```

The rest of the application calls `trackEvent(name, params)` rather than a provider-specific API. Events include useful non-sensitive actions such as design opened, favourite changes, tool opened, tool search, language changes and prompt generation/copy actions. Prompt text, uploaded image contents, passwords and similar sensitive values are intentionally filtered from event parameters.

If you want analytics completely disabled, leave `measurementId` empty or set the provider to `none`.

## Adsterra integration

No Adsterra publisher ID, zone ID or third-party script has been invented. The HTML contains clearly labelled placeholders:

```html
<!-- ADSTERRA PLACEMENT: INSERT OFFICIAL CODE HERE -->
```

Placements exist at the tools area and footer. They have reserved dimensions so an eventual ad can be inserted without covering navigation or tool controls.

To enable ads:

1. Obtain the official Adsterra publisher/zone code from the site owner's Adsterra account.
2. Insert the exact official code only inside the matching placeholder slot(s) in `index.html`.
3. Set `ADS.enabled` to `true` in `site-config.js`.
4. If the official code requires external domains, review the security-header/CSP configuration before enabling it.
5. Re-run `node verify.js` and perform mobile ad-layout tests.

Never invent or modify the provider's official advertising code. Do not encourage ad clicks or disguise advertisements as site content.

## Security model

This is a static frontend, so there is no honest way to guarantee immunity from hacking. The project is instead hardened for practical browser-side risks:

- Escaped catalogue/tool strings before dynamic HTML interpolation.
- No `eval()` or `new Function()`.
- Safe URL/hash route handling with invalid-route fallback.
- Defensive localStorage reads and quota handling.
- Local image type/size/count/dimension checks.
- Object URL cleanup after image decoding.
- Canvas output limits.
- No frontend API secrets.
- Same-origin PWA cache only; third-party requests are not placed into the service-worker cache.
- Security headers in `_headers` for compatible static hosting.

Important limitation: frontend file checks are not a substitute for server-side validation if a backend is added later. Uploaded SVG is not offered as a direct HTML surface by the current image pipeline.

## SEO

The page includes title/description/robots metadata, Open Graph/Twitter metadata, application metadata, semantic headings and a manifest. A production canonical URL is intentionally not guessed because the real domain was not supplied. Set `SITE_URL` in `site-config.js` before launch.

A future SEO expansion can add real, domain-specific `sitemap.xml`, Search Console verification and richer structured data. Do not add fake reviews, ratings or business claims.

## PWA / caching

The service worker caches a small versioned same-origin shell. The cache name is `atelier-shell-v1`; bump it when the shell contract changes. Old cache versions are removed on activation. Network is preferred for fetched assets, with cached fallback for offline use. Third-party advertising and analytics scripts are not cached by the service worker.

PWA registration is skipped for `file://` because service workers require an appropriate origin.

## Deployment — free static hosting

### Cloudflare Pages

1. Create a Pages project connected to your repository or upload the static project directory.
2. Use the directory containing `index.html` as the output/root directory.
3. Leave the build command empty.
4. Deploy all project files together.
5. Set `SITE_URL` to the final HTTPS origin in `site-config.js`.
6. If using analytics, insert the real measurement ID.
7. If using Adsterra, insert the official code into the marked slots and enable ads only after consent/security review.
8. Open the production site in an incognito window and run the smoke tests below.

### GitHub Pages

1. Put the project in a repository root (or the configured Pages publishing directory).
2. Enable Pages from the repository's Pages settings.
3. No build command is required.
4. Confirm the deployed URL and update `SITE_URL`.
5. Because `_headers` is a Cloudflare-style configuration file, GitHub Pages will not apply those headers automatically; configure equivalent headers at a proxy/hosting layer if required.

## Verification

From the project directory:

```bash
node verify.js
```

The check validates JavaScript syntax, catalogue size/fields/IDs, HTML IDs and assets, tool registry integrity, manifest/SEO metadata, dynamic-code-execution patterns, public configuration, Adsterra markers, focus styling and reduced motion.

A passing static verification is not proof of every browser interaction.

## Browser smoke test

Test at least:

- Chrome, Edge, Firefox and Safari where available.
- Direct `#tools`, `#tool/...` and `#legal/...` links.
- Back/Forward navigation and refresh.
- Clipboard permission denied/fallback.
- localStorage disabled/corrupted/quota failure.
- Prompt generation/regeneration/copy/reset.
- All 30 tools, including representative image/canvas/download actions.
- PNG/JPEG/WebP/GIF valid files, unsupported file, >8 MB file and >12-image selection.
- Search, filters, sorting, favourites, details and Load More across categories.
- Language switching and Urdu/Arabic RTL.
- Reduced-motion preference.
- Share API unavailable fallback.
- Service-worker install/update/offline fallback.

## Mobile checklist

Test 320, 360, 375, 390, 430, 768, 1024, 1280 and 1440 CSS-pixel widths. Check for horizontal overflow, reachable controls, dialog overflow, tool forms, canvas previews, sticky header behaviour, safe-area spacing and ad placeholders. Verify that any real ad code cannot cover controls or create accidental click zones.

## Security checklist

- Inspect DevTools Console for unexpected errors.
- Inspect Network for unexpected third-party requests.
- Search source for API keys/secrets before deployment.
- Test malformed hash fragments.
- Test hostile strings in prompt fields and tool inputs; they must remain text, not HTML/script.
- Test large/invalid image files.
- Confirm downloads occur only after successful processing.
- Confirm uploaded images are not sent to a server by this frontend.
- Review any future Adsterra code against its official source and required domains.
- Review CSP only after all intended third-party domains are known; do not deploy a CSP that silently breaks ads, analytics or required fonts.

## Owner configuration checklist

Required before production SEO/analytics/ads:

- `site-config.js` → `SITE_URL`.
- `site-config.js` → optional analytics measurement ID.
- `index.html` → exact official Adsterra code in the marked placeholders, if monetisation is enabled.
- Official social URLs only if the owner actually has those accounts.
- Real brand/domain assets if replacing the included generated Open Graph artwork.

Never place API keys, private tokens, passwords, database credentials or `.env` secrets in frontend files.

## Remaining frontend-only limitations

A static frontend cannot provide accounts, cross-device sync, server-side validation, rate limiting, private cloud storage, guaranteed uptime, guaranteed SEO rankings, guaranteed Adsterra approval/revenue, or guaranteed zero security risk. Those capabilities require infrastructure outside this free browser-first architecture.
