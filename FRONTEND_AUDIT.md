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

- `/css/bootstrap.min.css`
- `/css/orange.css`
- `/css/animate.css`
- Google Material Icons stylesheet
- `/css/font-awesome.min.css`
- Google Fonts: Nunito Sans

JS:

- `/js/jquery.min.js`
- Tether CDN `https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0//js/tether.min.js`
- `/js/bootstrap.min.js`
- `/js/preloader.js`
- `/js/gallery.js`
- `/js/hide-nav.js`
- Google Maps JS API with a hardcoded key
- `/js/map.js`
- Smartwaiver script near the end of the layout

## Dependency Inventory

### F001 — jQuery

Files:

- `js/jquery.min.js`
- `_layouts/default.html`

Current usage:

Required by:

- Bootstrap alpha JS
- Tether-backed Bootstrap tooltips/popovers
- `preloader.js`
- `hide-nav.js`
- inline scripts in `_layouts/default.html`

Classification: Keep for now, replace later.

Recommendation:

Do not remove jQuery until Bootstrap and remaining custom scripts have been migrated. Owl Carousel, smooth scrolling, contact validation, gallery filtering, and lightbox behavior no longer depend on jQuery after `T004A` through `T004D`.

Replacement path:

- Move custom scripts to vanilla JS.
- Upgrade Bootstrap to 5.x.
- Replace jQuery plugins one by one.

Risk: High if removed prematurely.

---

### F002 — Bootstrap CSS/JS

Files:

- `css/bootstrap.min.css`
- `css/bootstrap.min.css.map`
- `js/bootstrap.min.js`
- `_layouts/default.html`

Evidence:

`js/bootstrap.min.js` reports Bootstrap `4.0.0-alpha.6` internally.

Current usage:

- Grid classes throughout layouts/pages.
- Navbar collapse via `data-toggle="collapse"` and `data-target="#navbar-toggle"`.
- Carousel markup via `data-ride="carousel"`, `data-target`, and `data-slide-to` in `_includes/hero.html`.
- Scrollspy attributes on `<body>`.
- Tooltip plugin support remains in Bootstrap itself, but the unused global `$(...).tooltip()` initializer has been removed.
- General Bootstrap classes throughout the site.

Classification: Replace via dedicated migration.

Recommended target:

- Bootstrap `5.3.x`

Migration notes:

- Remove Tether; Bootstrap 5 does not use it.
- Replace `data-toggle`/`data-target` with `data-bs-toggle`/`data-bs-target`.
- Update old classes such as `navbar-toggler-right` and `.img-responsive`.
- Replace jQuery plugin initialization with Bootstrap 5 native JS APIs.
- Verify carousel markup; `_includes/hero.html` currently uses `.item`, while Bootstrap 4+ expects `.carousel-item`.

Risk: High. This should be its own phase.

---

### F003 — Tether CDN

Files:

- `_layouts/default.html`

Current usage:

Loaded from CDN before Bootstrap JS. Required by Bootstrap 4 alpha tooltips/popovers.

Classification: Remove only with Bootstrap migration.

Recommendation:

Do not remove while current Bootstrap alpha JS remains. Remove as part of Bootstrap 5 migration.

Risk: Medium if removed early because Bootstrap tooltip/popover code expects Tether.

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

Classification: Keep short-term, rewrite later.

Recommendation:

Rewrite in vanilla JS when removing jQuery custom scripts.

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

Files:

- `css/font-awesome.min.css`
- `fonts/fontawesome-*`
- `_layouts/default.html`
- `_includes/followus.html`
- `_includes/tile.html`
- `_layouts/training-class-default.html`

Current usage:

Classes like:

- `fa fa-facebook`
- `fa fa-instagram`
- `fa fa-angle-left`
- `fa fa-files-o`

Classification: Replace later.

Recommended replacements:

- Bootstrap Icons if Bootstrap 5 becomes the base.
- Font Awesome 6 if preserving icon names/visual style matters.
- Inline SVGs for the small set of icons actually used.

Risk: Medium because icons are spread across layouts/includes.

---

### F012 — Google Material Icons

Files:

- External stylesheet in `_layouts/default.html`
- Multiple layouts/pages with `md-icon` usage

Current usage:

Material icon text values such as:

- `location_on`
- `library_books`
- `album`
- `send`
- `expand_less`

Classification: Keep short-term, consolidate later.

Recommendation:

If moving to Bootstrap Icons or inline SVGs, replace Material Icons at the same time as Font Awesome to avoid multiple icon systems.

Risk: Medium.

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

Classification: Decide strategy before changing.

Recommendation:

This overlaps with `T003B`. Choose one strategy:

1. Simple external Google Maps links.
2. Static embeds/iframes.
3. One Google Maps JS API integration with a restricted key.
4. Leaflet/OpenStreetMap if avoiding Google API keys.

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

Dedicated high-risk phase:

- Update CSS/JS.
- Remove Tether.
- Update data attributes.
- Update carousel/navbar/modal/tooltip behavior.
- Remove Bootstrap jQuery dependency.

### T004G — Icon consolidation

Replace Font Awesome 4 and Material Icons with one icon strategy if desired.

## Recommended Modern Replacements

| Current | Recommended | Notes |
|---|---|---|
| Bootstrap 4 alpha + Tether | Bootstrap 5.3.x | Dedicated migration |
| jQuery custom scripts | Vanilla JS | Migrate gradually |
| Owl Carousel | Removed; Splide only if needed later | Completed in `T004A` |
| Magnific Popup | Removed in T004D | Replaced by dependency-free modal |
| jQuery Shuffle | Removed in T004D | Replaced by vanilla filtering and existing grid layout |
| jQuery Easing + smooth-scroll.js | CSS `scroll-behavior` + optional vanilla JS | Completed in `T004B` |
| Bootstrap Validator | Native HTML5 validation | Formspree still validates server-side |
| Font Awesome 4 | Bootstrap Icons / Font Awesome 6 / inline SVG | Decide with Bootstrap migration |
| Material Icons | Bootstrap Icons / inline SVG | Consolidate icon systems later |
| Google Maps JS | iframe/link/one restricted JS API key | Covered by `T003B` |

## Notes

- Most frontend assets are globally loaded on every page, which increases page weight and maintenance risk.
- Removing jQuery should be an end goal, not the next immediate step.
- The safest next implementation work is `T004C` contact validation migration, followed by gallery/lightbox/filtering modernization, then Bootstrap.
