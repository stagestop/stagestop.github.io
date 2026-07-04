# Frontend Dependency Audit

Date: 2026-07-03

This audit inventories frontend dependencies and assets loaded by the Stage Stop Jekyll site. It started as a no-change audit and is now also tracking completed frontend cleanup work.

## Summary

The frontend stack is an older Bootstrap 4 alpha/jQuery-era template with globally loaded vendor scripts and styles. Most dependencies are loaded from `_layouts/default.html` on every page, even when only needed by a few pages.

Primary recommendations:

1. Do not try to remove jQuery in one step.
2. First remove or replace easy global dependencies that are either unused or replaceable with native browser features.
3. Treat Bootstrap modernization as a dedicated project because the site appears to use Bootstrap `4.0.0-alpha.6`, Tether, old data attributes, and jQuery plugins.
4. Replace gallery/lightbox/carousel dependencies independently before removing jQuery.
5. Resolve the Google Maps strategy before touching `js/map.js`.

## Current Global Loads

Loaded in `_layouts/default.html`:

CSS:

- Bootstrap `5.3.8` CSS from jsDelivr CDN
- `/css/orange.css`
- `/css/animate.css`
- Google Fonts: Nunito Sans

JS:

- `/js/jquery.min.js`
- Bootstrap `5.3.8` bundle from jsDelivr CDN
- `/js/preloader.js`
- `/js/gallery.js`
- `/js/hide-nav.js`
- Google Maps JS API with a hardcoded key
- `/js/map.js`
- Smartwaiver script near the end of the layout

## Dependency Inventory

### F001 — jQuery

Files:

- Removed in `T004H`

Current usage:

No active usage remains.

Classification: Removed.

Recommendation:

Do not reintroduce jQuery for site behavior. Use browser APIs or a focused dependency for any future interactive feature.

Replacement path:

- `preloader.js`, `hide-nav.js`, and `map.js` were moved to vanilla JS in `T004H`.
- `/js/jquery.min.js` was removed in `T004H`.

Risk after removal: Low. Watch for old template snippets that assume `$` if imported later.

---

### F002 — Bootstrap CSS/JS

Status: Migrated in `T004F`.

Files:

- Bootstrap `5.3.8` CSS CDN in `_layouts/default.html`
- Bootstrap `5.3.8` bundle CDN in `_layouts/default.html`
- `_layouts/default.html`

Current usage:

- Grid classes throughout layouts/pages.
- Navbar collapse via `data-bs-toggle="collapse"` and `data-bs-target="#navbar-toggle"`.
- Carousel markup via Bootstrap 5 `.carousel-item` and `data-bs-*` attributes in `_includes/hero.html`.
- Scrollspy attributes on `<body>` use `data-bs-*`.
- General Bootstrap classes throughout the site.

Removed files:

- `css/bootstrap.min.css`
- `css/bootstrap.min.css.map`
- `js/bootstrap.min.js`

Migration notes completed:

- Removed Tether.
- Replaced active Bootstrap 4 alpha data attributes with Bootstrap 5 `data-bs-*` attributes.
- Updated active old classes such as `navbar-toggler-right`, `.img-responsive`, `mr-*`, `ml-auto`, and old offset classes.
- Updated custom Sass selectors for Bootstrap 5 navbar and tooltip/popover naming.
- Bootstrap no longer depends on jQuery.

Risk after migration: Medium. The site still has older custom CSS originally written around Bootstrap alpha and should be visually checked when possible.

---

### F003 — Tether CDN

Status: Removed in `T004F`.

Removed from:

- `_layouts/default.html`

Previous usage:

Loaded from CDN before Bootstrap 4 alpha JS. Bootstrap 5 does not use Tether.

Risk after removal: Low.


---

### F004 — Owl Carousel

Status: Removed in `T004A`.

Removed files:

- `js/owl.carousel.min.js`
- `css/owl.carousel.min.css`

Previous usage:

Inline initializers targeted:

- `#testimonials-carousel-2`
- `#clients-carousel`

Those target IDs were not found in active source, so the global CSS/JS loads and initializers were removed rather than replaced.

Risk after removal: Low. Reintroduce a modern no-jQuery carousel such as Splide only if a real carousel feature is needed later.

---

### F005 — Magnific Popup

Status: Removed in `T004D`.

Removed files:

- `js/jquery.magnific-popup.min.js`
- `css/magnific-popup.css`

Current behavior:

- `js/gallery.js` provides a small no-jQuery modal for gallery images and sponsor inline content.
- `_sass/_template-styles.scss` contains the modal styles.

Previous usage:

Inline initializers target:

- `.gallery-lightbox` with `a.image-lightbox`
- `.sponsor-lightbox` with `a.inline-lightbox`

Risk after removal: Low/Medium. The replacement keeps image and inline sponsor lightbox behavior but is intentionally simpler than a full gallery library.

---

### F006 — jQuery Shuffle / portfolio filtering

Status: Removed in `T004D`.

Removed files:

- `js/jquery.shuffle.min.js`
- `js/portfolio.js`

Current behavior:

- `js/gallery.js` filters gallery items by `data-group`.
- Gallery and sponsor templates use normal Bootstrap grid markup with no Shuffle inline positioning.

Previous usage:

`portfolio.js` initializes `#grid` with the Shuffle plugin and reads filters from `.portfolio-filter li`.

Risk after removal: Low/Medium. Masonry-style layout animation is gone; the site now uses the existing responsive grid.

---

### F007 — jQuery Easing and custom smooth scroll

Status: Replaced in `T004B`.

Removed files:

- `js/jquery.easing.min.js`
- `js/smooth-scroll.js`

Current behavior:

Native CSS smooth scrolling is enabled in `_sass/_custom.scss`:

```css
html {
  scroll-behavior: smooth;
}
```

Existing `smooth-scroll` classes remain in markup as harmless semantic hooks. If offset handling is needed for the fixed nav, add CSS `scroll-margin-top` or a small vanilla JS helper later.

Risk after replacement: Low.

---

### F008 — Preloader

Files:

- `js/preloader.js`
- `_layouts/default.html`

Current usage:

Fades out `#preloader` after window load.

Classification: Remove or rewrite.

Recommendation:

Consider removing the preloader entirely. If desired, rewrite in vanilla JS/CSS and avoid delaying page interaction.

Risk: Low.

---

### F009 — Hide Nav / scroll-to-top behavior

Files:

- `js/hide-nav.js`
- `_layouts/default.html`

Current usage:

Toggles `is-hidden`/`is-visible` classes on elements with `data-nav-status="toggle"` based on scroll direction.

Classification: Rewritten in `T004H`.

Recommendation:

Keep this as a small vanilla script unless the scroll-to-top behavior is redesigned.

Risk: Low/Medium.

---

### F010 — Contact form validator

Status: Removed in `T004C`.

Removed files:

- `js/contact-form-validator.min.js`

Current behavior:

Contact and VIP forms rely on native HTML5 validation (`required`, `type="email"`) plus Formspree/server-side validation.

Previous usage:

- Active forms used `data-toggle="validator"`, which auto-initialized the Bootstrap Validator plugin.
- The deleted library identified itself as Validator `v0.10.2`, a Bootstrap 3-era plugin from 2016.

Risk after removal: Low.

Follow-up:

Add a small vanilla JS enhancement only if custom inline validation messages are needed later.

---

### F011 — Font Awesome 4-era icon font

Status: Removed in `T004G`.

Removed files:

- `css/font-awesome.min.css`
- `fonts/FontAwesome.otf`
- `fonts/fontawesome-webfont.*`
- `fonts/glyphicons-halflings-regular.*`

Current behavior:

- Active Font Awesome icons were replaced with inline SVGs rendered through `_includes/icon.html`.

Previous usage:

- Social links, training class metadata, and post tiles used classes such as `fa fa-facebook`, `fa fa-instagram`, `fa fa-files-o`, and `fa fa-angle-right`.

Risk after removal: Low/Medium. The replacement covers active source usage; visually inspect icons after future design changes.

---

### F012 — Google Material Icons

Status: Removed in `T004G`.

Removed from:

- `_layouts/default.html`

Current behavior:

- Active Material Icons were replaced with inline SVGs rendered through `_includes/icon.html`.

Previous usage:

- Material icon text values included `location_on`, `library_books`, `album`, `send`, and `expand_less`.

Risk after removal: Low/Medium. The site now uses one inline SVG icon strategy.

---

### F013 — Animate.css

Files:

- `css/animate.css`
- `_includes/title-group.html`
- contact layouts/buttons
- Owl Carousel animation options

Current usage:

Classes like:

- `animated`
- `fadeInDown`
- `slideInRight`
- `slideOutLeft`

Classification: Remove or replace later.

Recommendation:

For minimal motion, replace with small custom CSS transitions. If keeping Animate.css, upgrade carefully because modern Animate.css uses `animate__*` class names.

Risk: Low/Medium.

---

### F014 — Google Maps JS API and `js/map.js`

Files:

- `_layouts/default.html`
- `js/map.js`
- `_includes/java.html`
- `_data/global.yml`
- section/page map containers

Current usage:

Loaded globally with a hardcoded key in `_layouts/default.html`; `js/map.js` initializes `mapAtwater` and `mapMariposa`.

Classification: Replace in `T003F`.

Recommendation:

`T003B` chose Google Maps iframe embeds plus existing external address links. Replace the global Maps JS API load and `js/map.js` with location-data-driven iframes, then remove unused map-key/config/include artifacts.

Risk: Medium.

---

### F015 — Smartwaiver embed

Files:

- `_layouts/default.html`
- `_includes/java.html` may also contain a stale/unused Smartwaiver embed

Current usage:

Smartwaiver script is globally loaded in `_layouts/default.html`.

Classification: Keep pending business confirmation.

Recommendation:

Confirm it is still needed and whether it should load globally or only on relevant pages.

Risk: Low/Medium.

---

### F016 — `orange.scss` and Sass structure

Files:

- `css/orange.scss`
- `_sass/*`
- generated `/css/orange.css` output via Jekyll Sass pipeline

Current usage:

`orange.scss` imports `_sass/template-styles` and sets the primary color.

Classification: Keep for now.

Recommendation:

Do not modernize Sass until after Bootstrap/frontend dependency choices are settled. The GitHub Pages stack still uses Ruby Sass via Jekyll 3, so Dart Sass migration would likely pair better with a future Jekyll 4/GitHub Actions move.

Risk: Medium if changed early.

## Likely Unused or Questionable Assets

### `_includes/java.html`

No direct `{% include java.html %}` references were found. It duplicates Google Maps and Smartwaiver behavior.

Recommendation:

Remove after `T003B` map strategy is decided.

### Owl Carousel targets

Resolved in `T004A`: no active `#testimonials-carousel-2` or `#clients-carousel` targets were found, so Owl Carousel was removed without replacement.

### Tooltip initializer

Resolved in `T004A`: no active tooltip trigger attributes were found, so the global `$(...).tooltip()` initializer was removed. Tooltip behavior should be reassessed during the Bootstrap 5 migration only if tooltips are reintroduced.

## Recommended Execution Order

### T004A — Easy dependency removal audit/fixes

Status: Complete for confirmed-unused Owl Carousel and tooltip initializer work.

Completed:

- Removed Owl Carousel global CSS/JS and deleted its local asset files.
- Removed unused Owl Carousel inline initializers.
- Removed unused Bootstrap tooltip initializer.

Deferred:

- Preloader decision remains open.
- Contact validation migration is tracked separately as `T004C`.

### T004B — Smooth scroll migration

Status: Complete.

Completed:

- Replaced jQuery Easing + `smooth-scroll.js` with native CSS `scroll-behavior: smooth`.
- Deleted the old easing and smooth-scroll files.

### T004C — Contact validation migration

Status: Complete.

- Removed Bootstrap Validator and rely on native validation/Formspree.

### T004D — Gallery/lightbox modernization

Status: Complete.

- Replaced Magnific Popup and jQuery Shuffle with dependency-free `js/gallery.js`.
- Gallery filtering now uses vanilla JS and normal Bootstrap grid layout.

### T004E — Carousel decision/replacement

Status: Complete for current site behavior.

Owl Carousel was unused and removed in `T004A`. Add a modern carousel such as Splide only if a new carousel requirement appears.

### T004F — Bootstrap 5 migration

Status: Complete.

- Switched Bootstrap CSS/JS to official Bootstrap `5.3.8` CDN assets.
- Removed Tether and local Bootstrap alpha files.
- Updated active navbar, carousel, image, offset, spacing, modal, and Sass compatibility points.
- Bootstrap no longer depends on jQuery.

### T004G — Icon consolidation

Status: Complete.

- Replaced active Font Awesome 4 and Material Icons with inline SVGs through `_includes/icon.html`.
- Removed Font Awesome CSS, Font Awesome fonts, Glyphicon fonts, and the Google Material Icons stylesheet.

### T004H — Custom script jQuery removal

Completed. Remaining custom scripts use vanilla JavaScript, and `/js/jquery.min.js` has been removed.

## Recommended Modern Replacements

| Current | Recommended | Notes |
|---|---|---|
| Bootstrap 4 alpha + Tether | Bootstrap 5.3.8 CDN | Completed in `T004F` |
| jQuery custom scripts | Vanilla JS | Completed in `T004H` |
| Owl Carousel | Removed; Splide only if needed later | Completed in `T004A` |
| Magnific Popup | Removed in T004D | Replaced by dependency-free modal |
| jQuery Shuffle | Removed in T004D | Replaced by vanilla filtering and existing grid layout |
| jQuery Easing + smooth-scroll.js | CSS `scroll-behavior` + optional vanilla JS | Completed in `T004B` |
| Bootstrap Validator | Native HTML5 validation | Formspree still validates server-side |
| Font Awesome 4 | Inline SVG | Completed in `T004G` |
| Material Icons | Inline SVG | Completed in `T004G` |
| Google Maps JS | iframe/link/one restricted JS API key | Covered by `T003B` |

## Notes

- Most frontend assets are globally loaded on every page, which increases page weight and maintenance risk.
- jQuery has been removed from active source and generated output after `T004H`.
