# The Wedding Atelier — Wedding & Mehndi Design Studio

A static, framework-free HTML/CSS/JavaScript wedding inspiration library, prompt-writing studio, and set of 30 browser-based tools.

## Files

- `index.html` — semantic page structure, navigation, Free Tools directory mount point, workspaces, footer and dialog.
- `style.css` — ivory, blush, plum and antique-gold design system, responsive layouts, focus states and reduced-motion rules.
- `script.js` — original catalogue interactions and Prompt Studio, plus hash routing and tool implementations.
- `data.js` — curated category seeds and generated design catalogue.
- `README.md` — this documentation.

## Run locally

Keep all four application files in the same folder. Open `index.html` in a current browser, or serve the folder using VS Code Live Server or another local static server. There is no build step, package manager, backend, account, or API key. Clipboard access is most reliable on HTTPS or localhost.

## Design library and Prompt Studio

The library supports category and subcategory navigation, search, sorting, saved favourites, progressive loading, detail dialogs, and copying design prompts. Favourites use `localStorage` on the current browser/device. Prompt Studio produces editable text prompts only. It does not call an AI model or generate AI images.

The original catalogue data has been preserved. Its records are generated from structured category seeds and should be understood as prompt-bearing concepts, not a set of individually photographed designs. Check `data.js` for the actual seed and generation logic if changing counts.

## Free Tools

The directory contains exactly 30 tools across three groups:

### Mehndi Design Tools
1. Mehndi Prompt Generator
2. Bridal Mehndi Prompt Maker
3. Arabic Mehndi Designer
4. Pakistani Mehndi Prompt Maker
5. Indian Mehndi Designer
6. Feet Mehndi Prompt Generator
7. Mandala Mehndi Maker
8. Finger Mehndi Designer
9. Back Hand Mehndi Generator
10. Mehndi Style Mixer

These tools produce editable text prompts with placement, style, detail, composition, and optional motif controls. Regional presets use distinct descriptive directions. Results are templates assembled locally, not model-generated output.

### Image Editing Tools
11. Pinterest Pin Maker — 1000 × 1500 (2:3) canvas export.
12. Mehndi Image Resizer — dimensions and optional aspect-ratio preservation.
13. Mehndi Collage Maker — multi-image grid composition.
14. Mehndi Photo Editor — brightness, contrast, and saturation preview.
15. Mehndi Text Overlay Tool — text, position, size, and colour.
16. Mehndi Color Palette Generator — curated coordinated hex palettes.
17. Mehndi Pattern Creator — original SVG motif generation, copy and download.
18. Mehndi Image Cropper — percentage crop and rotation.
19. Wedding Mood Board Maker — image grid with a title/notes.
20. Wedding Invitation Card Maker — local canvas invitation composition.

Image tools use browser file inputs, `Image`, `URL.createObjectURL`, canvas, and PNG/SVG export. Image files are processed locally by this frontend; each upload is limited to 8 MB, and multiple-image tools accept up to 12 images. Very large canvas dimensions are limited to reduce memory pressure. Browser support and available memory vary. Review the exported result before publishing. This implementation is a practical lightweight editor, not a full-featured image editor; crop controls use a centered percentage crop, and the mood board uses a simple grid.

### Wedding Utility Tools
21. Wedding Countdown Calculator
22. Mehndi Artist Cost Calculator
23. Wedding Budget Calculator
24. Mehndi Ceremony Planner
25. Bridal Preparation Checklist
26. Wedding Invitation Text Generator
27. Wedding Hashtag Generator
28. Mehndi Caption Generator
29. Mehndi SEO Title Generator
30. Mehndi Negative Prompt Generator

Calculators validate basic numeric/date inputs and produce estimates or summaries. Checklist progress is session-only. Generated text is editable and can be copied. The Urdu invitation text is a local template; review spelling, names, dates, and cultural details before use.

## Tool routing

The directory uses stable hash routes such as `#tools`, `#tool/pinterest-pin-maker`, and `#tool/wedding-countdown-calculator`. Legal sections use `#legal/privacy-policy`, `#legal/terms-conditions`, `#legal/disclaimer`, `#legal/acceptable-use`, `#legal/storage-notice`, `#legal/about-us`, and `#legal/contact-us`. Hash changes support direct links, refresh, and browser back/forward navigation. Use **Back to Free Tools** to return to the directory.

## Privacy and security

- No account, database, server-side storage, analytics, or AI API is implemented.
- Design favourites are saved in browser `localStorage`. Clearing site data removes them.
- Tool inputs and uploaded images are handled by browser-side code. The tools do not upload selected images to a server.
- The page loads Google Fonts from `fonts.googleapis.com` and `fonts.gstatic.com`; those requests disclose ordinary connection metadata to the font provider. For a fully offline/no-third-party request experience, remove the font `<link>` elements and use the CSS fallback fonts.
- The previous HTML included several unverified third-party script/ad integrations. Those scripts and the related ad configuration have been removed because their purpose and trustworthiness could not be established from the supplied files. If they were providing monetisation, that functionality is no longer present.
- User text displayed in tool output uses text controls or `textContent`; file names and text inputs are not evaluated as code. SVG generated by the pattern tool is assembled from fixed shapes and validated colour/size values.
- Frontend file type/size checks improve usability but cannot guarantee that all malicious or malformed files are safe. A static site cannot enforce server-side validation, authentication, rate limiting, monitoring, or abuse prevention.
- Do not enter sensitive personal information. Emailing the contact address sends data through your chosen email provider.
- If a backend or AI service is added later, implement server-side input validation, access controls, rate limiting, logging policies, secure secret management, and a clear privacy notice. Keep API keys out of client-side files.

## Legal information

About, Contact, Privacy Policy, Terms & Conditions, Disclaimer, Acceptable Use Policy, and Cookie/Local Storage Notice are available from the footer. The legal text describes this version's actual frontend behaviour, but is general information, not legal advice or a guarantee of legal compliance. Re-review it if hosting, analytics, cookies, external services, or data handling changes.

## Dependencies and compatibility

No JavaScript library or framework is required. Google Fonts is the only external resource referenced by the page. The app uses modern browser APIs such as canvas, `HTMLCanvasElement.toBlob`, object URLs, `localStorage`, hash navigation, and optionally the Clipboard API. If clipboard permission is unavailable, users can manually select the result text. Use a recent Chrome, Edge, Firefox, or Safari release for the best experience.

## Verification notes

Code-level checks performed for this delivery: source review of all five uploaded files; removal of the unverified remote ad/script integrations; preservation of the supplied `data.js` and original library controller; source generation for the 30-tool directory and tool-specific interfaces; and JavaScript syntax checks where the local runtime is available.

Not claimed as fully browser-tested: all 30 interactive flows, every image codec/export path, every screen width, screen-reader behaviour, and browser back/forward operation. Manually verify at 320, 375, 430, 768, 1024, and 1440 CSS pixels. Test representative PNG/JPEG/WebP images, denied clipboard permissions, invalid dates, and budget edge cases before production use.

## Known limitations

- This is a static frontend. It does not include AI image generation, backend APIs, authentication, cloud storage, database persistence, or server-side security controls.
- Tool-generated text is template-based, not generated by a connected language model.
- Image editing features intentionally use simple canvas compositions and are not a replacement for a professional editor.
- The existing library's catalogue is generated from curated seeds rather than a manually art-directed photographic collection.
