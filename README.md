# Wedding & Mehndi Designs — The Wedding Atelier

A responsive HTML/CSS/JavaScript design library and AI image-prompt writing studio. Created by Chief.

## Features

- 30 wedding-related categories, each with **250 distinct catalogue entries** generated from category-specific design directions, styles, and viewpoints (7,500 concepts total).
- Category navigation, category-specific subcategory filters, text search, A–Z/Z–A sorting, saved designs, and progressive loading.
- Design detail dialog with a complete English prompt and working copy controls.
- Prompt Studio with idea, category, style, palette, orientation, visual treatment, composition, details, and extra instructions.
- Alternative prompt generation, reset, examples in the interface, responsive navigation, toast feedback, and browser-local favorites.
- Original CSS-generated artwork thumbnails. These are illustrative motifs, not photographic previews.
- No AI image-generation API is connected. The app creates text prompts only and tells users to paste prompts into a compatible image service.

## Run in Visual Studio Code

1. Extract the project ZIP.
2. Open the `wedding-mehndi-designs` folder in VS Code.
3. Open `index.html` directly in a browser, or use the VS Code **Live Server** extension and choose **Open with Live Server**.
4. No build step, package manager, backend, or API key is required. Google Fonts are loaded from Google Fonts when internet access is available; system fallbacks are defined.

## Files

- `index.html` — page structure, accessible controls, prompt form, library, and dialog.
- `style.css` — visual identity, layout, generated art treatment, responsive breakpoints, and reduced-motion support.
- `data.js` — curated category-specific seed directions and deterministic generation of 150 prompt-bearing concepts per category.
- `script.js` — search, filters, sorting, favorites, detail modal, clipboard support, and prompt generator.

## Catalogue methodology

Each category uses ten category-specific creative directions × five visual styles × five viewpoints to produce 250 entries. Names, descriptions, prompts, palettes, compositions, and subcategory tags are assembled from those structured inputs. This is a scalable concept library, not a collection of 4,500 manually art-directed photographs. The thumbnails are original CSS motif illustrations; no stock images are bundled.

## Security and limitations

- User text is inserted as text in generated output; dynamic HTML labels are escaped before rendering.
- Input fields have length limits and no user text is executed as code.
- Favorites are stored in browser `localStorage` on the current device. There is no account sync or backend.
- Clipboard writes use the Clipboard API where available and a legacy copy fallback otherwise. Some browsers require HTTPS or localhost for clipboard access.
- No API keys or private credentials are included. If you later integrate an image API, keep secret keys on a server, add request validation/rate limits, and do not expose credentials in `script.js`.
- This static front-end does not provide server-side security, authentication, cloud storage, or actual image generation.
- The catalogue is generated locally at runtime and works offline after the files and fonts are available.

## Extending the catalogue

Edit `CATEGORY_SEEDS` and `CATEGORY_META` in `data.js`. Keep ten distinct directions, five distinct styles, and five viewpoints for each category to maintain 250 combinations. For a more curated commercial library, replace generated combinations with individually reviewed records and licensed preview images.
