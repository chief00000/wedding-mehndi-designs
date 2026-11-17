# Wedding & Mehndi Designs — Static Website

A framework-free, static wedding inspiration and browser-tools website. The project runs with plain HTML, CSS and JavaScript; it does not require Node.js, a build step, a database, or an API key.

## Project files

Keep these files together in the same directory:

- `index.html` — page structure, navigation, SEO metadata and tool mount points.
- `style.css` — responsive design system, layout, focus styles and reduced-motion support.
- `data.js` — structured design catalogue source.
- `script.js` — design library, prompt studio, 30 browser tools, routing and legal pages.
- `README.md` — setup, deployment and verification notes.
- `verify.js` — optional dependency-free source/data checks (requires Node.js only when running the check).

## Features

### Design library

The catalogue contains 30 categories with 250 generated prompt concepts per category (7,500 total). It supports category and subcategory filters, search, sorting, saved favourites, progressive loading, detail dialogs and prompt copying. The concepts are text-based creative directions; they are not 7,500 photographs or finished henna designs. Favourites are stored locally in the visitor's browser and are not synced between devices.

### Prompt Studio

Builds editable text prompts from the visitor's subject, category, style, palette, orientation, composition and optional details. It does not connect to an AI model and does not generate images.

### 30 free browser tools

- 10 mehndi prompt-writing tools.
- 10 image tools (local image processing, canvas previews and PNG/SVG export).
- 10 wedding utilities (calculators, checklist and text generators).

Image uploads are processed in the visitor's browser and are not sent to this website's server by this code. Image tools accept PNG, JPEG, WebP and GIF files up to 8 MB each; multi-image tools support up to 12 images. Canvas output is capped to reduce browser memory pressure. Very large images or limited device memory can still cause browser-specific failures. GIF uploads are processed as a still image (the browser's decoded image frame), not as an animated GIF editor.

### Hash navigation

Tool and legal routes use URL fragments, for example:

- `#tools`
- `#tool/mehndi-prompt-generator`
- `#tool/pinterest-pin-maker`
- `#legal/privacy-policy`

These routes are client-side hash routes; they do not require server rewrite rules.

## Run locally

1. Put all five files in one folder.
2. Open `index.html` in a current browser, or serve the folder through a local static web server (recommended).
3. For the most reliable clipboard experience, use HTTPS or `localhost`.

No `npm install`, build command, or environment variables are required.

## Deploy to Cloudflare

Upload the six files together into the same project/root directory. Do not upload only `index.html`: the page depends on `style.css`, `data.js` and `script.js` being present at the exact relative paths shown in the HTML. After deployment, open the production URL in a private/incognito window and hard-refresh it to avoid stale cached assets.

If using Cloudflare Pages, set the project output directory to the directory containing `index.html`; the build command can be left blank because this is a static site. If using a Workers static-assets project, configure the assets directory to the folder containing these files according to the deployment workflow in your Cloudflare dashboard. This source package intentionally does not include a guessed `wrangler.toml` or `wrangler.jsonc`, because the exact deployment mode and existing project configuration were not supplied.

## Privacy and security notes

- No login, database, analytics, AI API, server-side storage or server-side form submission is implemented.
- Saved favourites use browser `localStorage` on the current device.
- User-entered text is written to text controls or `textContent`; it is not evaluated as JavaScript.
- Image files are decoded and processed in the browser. Frontend file checks improve usability but are not a substitute for server-side security if a backend is added later.
- The unverified third-party advertising scripts previously present in the supplied HTML have been removed. No ad/monetisation integration is included in this version.
- Google Fonts is loaded from Google Fonts. If that external request is blocked, CSS fallback fonts are used and the core site should remain usable.
- Do not place API keys, passwords, private tokens or `.env` secrets in public frontend files.

## Verification performed for this package

- JavaScript syntax validation (`node --check`) for `data.js` and `script.js`.
- A reusable local check is included: run `node verify.js` from this folder.
- Catalogue data validation: 30 categories, 250 entries per category, 7,500 total entries, unique IDs, and required prompt/palette fields present.
- HTML source checks: unique IDs, local stylesheet/script references, and removal of remote advertising script tags.
- Source review and fixes for browser-storage validation, checklist event handling, malformed hash handling, image dimension validation, upload-count validation, and preventing downloads before an image has been processed.

## Important limitations — no false guarantees

This is a static frontend, not a hosted SaaS application. It does not provide accounts, cross-device syncing, cloud image storage, AI image generation, server-side validation, rate limiting, uptime monitoring or a backend. The site cannot guarantee zero errors on every device, browser extension, network, image file or future Cloudflare configuration. Browser testing of every interaction and real production deployment verification must still be completed after uploading these files. See the deployment checklist below.

## Production smoke-test checklist

After deployment, test at least the following in Chrome, Edge, Firefox and Safari where available:

1. Homepage and all local assets load without 404/5xx responses.
2. Design Library shows 250 concepts in each category; search, subcategories, sorting, favourites, details, copy and Load more work.
3. Prompt Studio generates, regenerates, copies and resets prompts.
4. Open each of the 30 tools from the directory; test representative prompt, calculator, checklist, image, canvas and download actions.
5. Test image upload with valid PNG/JPEG/WebP/GIF, an unsupported file, a file over 8 MB, and more than 12 images in a multi-image tool.
6. Test mobile widths around 320, 375, 430, 768, 1024 and 1440 CSS pixels.
7. Test direct hash links, browser refresh, Back/Forward, denied clipboard permission, disabled localStorage and reduced-motion settings.
8. Check Cloudflare Metrics and browser DevTools Network/Console after the site has received real traffic.

A successful syntax check is not proof that every browser interaction or Cloudflare deployment is error-free. Re-run these checks after any future code or configuration change.
