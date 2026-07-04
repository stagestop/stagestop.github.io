# Modernization Plan

This file is the source of truth for modernizing the Stage Stop Gun Shop Jekyll site across multiple work sessions, including AI agent sessions.

Future sessions should read this file before making changes.

## Suggested AI Agent Prompt

Use this prompt when starting a new session:

> Read `MODERNIZATION.md`, inspect the current git status, then complete the next task marked `Ready`. Do not make unrelated changes. Keep changes small and scoped. Validate with Docker. When finished, update `MODERNIZATION.md` to reflect what changed, what validation ran, and the next task status.

## Project Context

This repository contains the static website for Stage Stop Gun Shop & Indoor Range.

The site is built with:

- Jekyll
- GitHub Pages-compatible Ruby dependencies
- Liquid templates
- Markdown content
- YAML data files
- Sass/CSS
- Older Bootstrap/jQuery-era frontend assets

Important directories:

- `_pages/` — top-level site pages
- `_layouts/` — Liquid/HTML layouts
- `_includes/` — reusable Liquid partials
- `_sections/` — reusable page sections rendered through `site.sections`
- `_training-classes/` — custom collection for training class content
- `_posts/` — older product/post entries
- `_data/` — YAML-driven navigation, memberships, locations, gallery, global settings, etc.
- `_sass/`, `css/`, `js/` — styling and frontend assets

## Current Baseline

Current dependency/runtime baseline:

- Ruby: `~> 3.3`
- Dependency management: Bundler
- GitHub Pages gem: `github-pages ~> 232`
- Jekyll: `3.10.0` via `github-pages`
- Docker development setup available through `docker-compose.yml`

Current Docker behavior:

- Source is bind-mounted into the container at `/site`.
- Host edits remain visible to Jekyll and tracked by Git.
- Generated output/cache are shadow-mounted with Docker named volumes:
  - `/site/_site`
  - `/site/.jekyll-cache`

Start development server:

```sh
docker compose up --build
```

Open:

```text
http://localhost:4000
```

Stop development server:

```sh
docker compose down
```

## Decisions

### D001 — Use GitHub Pages dependency stack first

Decision:

Use `github-pages ~> 232` as the initial modernization baseline.

Reason:

This keeps local development aligned with GitHub Pages native build behavior and avoids jumping immediately to a custom GitHub Actions deployment.

Consequence:

The site remains on Jekyll 3.x for now. Jekyll 4.x can be considered later if the project moves to GitHub Actions-based deployment.

### D002 — Use Bundler instead of manually installed gems

Decision:

Ruby dependencies are declared in `Gemfile` and locked in `Gemfile.lock`. Docker installs via `bundle install` and serves via `bundle exec jekyll serve`.

Reason:

This makes development reproducible and avoids dependency drift.

### D003 — Keep Docker bind mount plus shadow volumes

Decision:

Use a bind mount for the repository source and named Docker volumes for generated Jekyll artifacts.

Reason:

This allows live host edits while keeping generated files out of the working tree.

### D004 — Make changes incrementally

Decision:

Modernization should proceed in small phases, with validation after each phase.

Reason:

The site is old, mixes content/layout/frontend concerns, and has limited automated tests. Small validated changes reduce risk.

## Roadmap

### Phase 1 — Reproducible build

Status: Complete

Completed work:

- Added `Gemfile`.
- Added `Gemfile.lock`.
- Switched Dockerfile to Ruby `3.3-slim`.
- Switched Dockerfile from manually installed gems to Bundler.
- Docker now runs `bundle exec jekyll serve`.
- README documents Bundler-managed Docker development setup.

Validation performed:

```sh
docker compose --progress plain build
docker compose up
docker compose down
```

Result:

The Docker image builds successfully and the site serves at `http://localhost:4000`.

Known non-fatal warnings remain from legacy Jekyll config.

### Phase 2 — Jekyll config cleanup

Status: Complete

Completed work:

- Added repo/dev metadata files to `_config.yml` `exclude` so they are not published by Jekyll:
  - `README.md`
  - `MODERNIZATION.md`
  - `Dockerfile`
  - `docker-compose.yml`
  - `Gemfile`
  - `Gemfile.lock`
  - `.dockerignore`
- Consolidated duplicate `include` config into one list containing `.htaccess` and `_pages`.
- Replaced deprecated `gems:`/`whitelist:` config with `plugins: []`.
- Removed inactive `jekyll-paginate` config because `paginate` was commented out and no active pagination usage was found.
- Removed unused `rdiscount` and `redcarpet` config.
- Removed deprecated `kramdown.coderay` config while preserving basic `kramdown` options.

Validation performed:

```sh
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build"
docker compose run --rm site sh -c "find _site -maxdepth 1 \( -name 'MODERNIZATION*' -o -name 'README*' -o -name 'Dockerfile' -o -name 'docker-compose.yml' -o -name 'Gemfile*' \) -print"
docker compose up
docker compose down
```

Result:

- Site builds successfully.
- Dev server starts successfully at `http://localhost:4000`.
- Repo/dev metadata files are not emitted into `_site`.
- The `gems:` and `kramdown.coderay` deprecation warnings are gone.

Remaining known non-fatal warning:

```text
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
```

### Phase 3 — Content/data cleanup

Status: Complete

Completed work:

- Created `CONTENT_AUDIT.md`.
- Added `CONTENT_AUDIT.md` to `_config.yml` `exclude` so the audit is not published by Jekyll.
- Reviewed `_data/map.yml`, `_data/global.yml`, `_data/locations.yml`, `_data/sponsors.yml`, Google Maps usage, contact layouts, social includes, membership copy, and product posts.
- Documented stale/template data, duplicate map integrations, API key concerns, stale metadata, placeholder product content, contact form placeholder subjects, obsolete social sharing links, and typo candidates.
- No production content was changed during this audit.

Primary output:

- `CONTENT_AUDIT.md`

Recommended follow-up tasks from the audit:

- `T003A` — Safe typo/placeholder copy fixes.
- `T003B` — Map cleanup decision.
- `T003C` — Product post review/archive.
- `T003D` — Global metadata/footer consolidation.
- `T003E` — Social sharing cleanup.

### Phase 4 — Frontend dependency inventory

Status: Complete

Completed work:

- Created `FRONTEND_AUDIT.md`.
- Added `FRONTEND_AUDIT.md` to `_config.yml` `exclude` so the audit is not published by Jekyll.
- Inventoried globally loaded frontend CSS/JS assets.
- Classified dependencies as keep/remove/replace.
- Documented usage, risks, and recommended replacement paths for Bootstrap/Tether, jQuery, Owl Carousel, Magnific Popup, jQuery Shuffle, smooth scrolling/easing, contact validation, Font Awesome, Material Icons, Animate.css, Google Maps, Smartwaiver, and Sass.

Primary output:

- `FRONTEND_AUDIT.md`

Recommended follow-up tasks from the audit:

- `T004A` — Easy dependency removal audit/fixes.
- `T004B` — Smooth scroll migration.
- `T004C` — Contact validation migration.
- `T004D` — Gallery/lightbox modernization.
- `T004E` — Carousel decision/replacement.
- `T004F` — Bootstrap 5 migration.
- `T004G` — Icon consolidation.

### Phase 5 — Easy frontend removals

Status: In progress

Completed work:

- Removed confirmed-unused Owl Carousel global CSS/JS and inline initializers.
- Removed the unused Bootstrap tooltip initializer.
- Replaced jQuery Easing + `smooth-scroll.js` with native CSS `scroll-behavior: smooth`.
- Deleted unused files:
  - `css/owl.carousel.min.css`
  - `js/owl.carousel.min.js`
  - `js/jquery.easing.min.js`
  - `js/smooth-scroll.js`

Remaining candidates:

- Replace contact form validation with native HTML5 validation if sufficient.
- Decide whether the preloader is still desired.

### Phase 6 — Bootstrap modernization

Status: Complete

Completed target:

- Bootstrap `5.3.8`

Completed work:

- Switched Bootstrap CSS/JS from local Bootstrap `4.0.0-alpha.6` assets to official Bootstrap `5.3.8` CDN assets.
- Removed Tether.
- Updated Bootstrap data attributes from `data-toggle`/`data-target`/`data-ride` to `data-bs-*`.
- Updated old classes such as `.img-responsive`, `.navbar-toggleable-*`, `.navbar-toggler-right`, old offset classes, and directional spacing helpers.
- Updated navbar, carousel, age-gate modal classes, and relevant Sass selectors.
- Removed Bootstrap’s jQuery dependency.

### Phase 7 — Replace larger jQuery plugins

Status: Complete

Completed replacements:

- Owl Carousel → removed in `T004A`; no active carousel target remained
- Magnific Popup → removed in `T004D`; replaced with dependency-free modal
- jQuery Shuffle → removed in `T004D`; replaced with vanilla filtering and existing grid layout
- Font Awesome 4 → removed in `T004G`; replaced with inline SVGs
- Material Icons → removed in `T004G`; replaced with inline SVGs
- Custom jQuery scripts → converted to vanilla JavaScript in `T004H`

Goal:

Remove jQuery once all dependent plugins are gone.

Result:

jQuery is no longer globally loaded or included in the repo.

### Phase 8 — Optional Jekyll 4 / GitHub Actions deployment

Status: Not started

This is optional and should happen only after the site is stable and cleaner.

Goal:

Move beyond GitHub Pages’ built-in Jekyll version by building the site through GitHub Actions and deploying generated output.

Potential target:

```ruby
gem "jekyll", "~> 4.3"
```

Consequence:

GitHub Pages native build parity would no longer be the goal; GitHub Actions would become the source of production build behavior.

## Task Board

### Ready

#### T003F — Map iframe implementation

Scope:

- Replace the active Google Maps JS implementation with iframe embeds driven by location data.
- Remove the global `maps.googleapis.com/maps/api/js` script from `_layouts/default.html`.
- Remove `js/map.js` after no active references remain.
- Remove unused `_includes/java.html`.
- Remove unused `_data/map.yml` if a final search confirms no references.
- Remove `_data/global.yml` `googleaccess` after no active references remain.
- Keep existing external Google Maps address links for directions.

Acceptance criteria:

- Atwater and Mariposa visible maps still render.
- Contact/about/VIP pages do not include broken empty map containers.
- No generated output references `maps.googleapis.com/maps/api/js`, `js/map.js`, `_includes/java.html`, `_data/map.yml`, or `googleaccess`.
- Site builds successfully.

### Done

#### T003B — Map cleanup decision

Completed:

- Chose Google Maps iframe embeds plus existing external address links as the target map strategy.
- Decided not to keep the Google Maps JavaScript API for ordinary location maps.
- Documented that the currently exposed API keys should be rotated, revoked, or restricted outside the repo if still active.
- Added `T003F — Map iframe implementation` as the follow-up implementation task.

Decision:

Use Google Maps iframe embeds for visible location maps, backed by the existing external Google Maps address links in `_data/locations.yml`.

Reason:

The site only needs store-location maps and directions links. Iframe embeds preserve visible map panels without requiring a client-side Google Maps JavaScript API key, custom map JavaScript, or global Maps JS loading.

Key policy:

- No production Google Maps JavaScript API key should be required for the chosen map display strategy.
- The two currently exposed keys should be considered public and should be rotated, revoked, or restricted in Google Cloud if they are still active.
- If a future feature requires the Maps JS API, use a single key stored in one config/data location and restrict it by HTTP referrer and API scope before deploying it.

Validation performed:

```sh
rg -n "layout: section-map|map-id:|id=\"map\"|include java|googleaccess|maps.googleapis" . --glob '!_site/**'
git diff --check
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build"
```

Result:

- Decision is documented.
- Follow-up implementation task is defined.
- Site builds successfully.
- Existing non-fatal Faraday retry warning remains.

#### T004H — Custom script jQuery removal

Completed:

- Rewrote `js/preloader.js`, `js/hide-nav.js`, and `js/map.js` to use browser APIs instead of jQuery.
- Kept the current Google Maps JS strategy unchanged while removing the jQuery event wrapper from `js/map.js`.
- Removed the global `/js/jquery.min.js` script load from `_layouts/default.html`.
- Deleted `js/jquery.min.js` after confirming no active source still referenced jQuery.
- Added `?v=t004h` cache-busting query strings to the changed custom script URLs so browsers do not reuse stale jQuery-era script responses.

Validation performed:

```sh
node --check js/preloader.js
node --check js/hide-nav.js
node --check js/map.js
rg -n "jquery\.min\.js|jQuery|\$\(|\$\." --glob '!MODERNIZATION.md' --glob '!FRONTEND_AUDIT.md' .
git diff --check
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build"
docker compose run --rm site sh -c "test ! -e _site/js/jquery.min.js && ! grep -R -I 'jquery.min.js\|jQuery\|\$(' _site"
docker compose up
docker compose exec site ruby -ropen-uri -e "home = URI.open('http://localhost:4000/').read; about = URI.open('http://localhost:4000/about/').read; scripts = %w[/js/preloader.js /js/hide-nav.js /js/map.js].map { |p| URI.open('http://localhost:4000' + p).read }.join; raise 'jquery script still loaded' if home.include?('/js/jquery.min.js') || about.include?('/js/jquery.min.js'); raise 'jquery syntax still present' if scripts.match?(/jQuery|\$\(|\$\./); raise 'missing custom scripts' unless home.include?('/js/preloader.js') && home.include?('/js/hide-nav.js') && home.include?('/js/map.js');"
docker compose down
docker compose up
docker compose exec site ruby -ropen-uri -e "home = URI.open('http://localhost:4000/').read; raise 'missing cache-busted scripts' unless home.include?('/js/preloader.js?v=t004h') && home.include?('/js/hide-nav.js?v=t004h') && home.include?('/js/map.js?v=t004h'); scripts = %w[/js/preloader.js?v=t004h /js/hide-nav.js?v=t004h /js/map.js?v=t004h].map { |p| URI.open('http://localhost:4000' + p).read }.join; raise 'jquery syntax still present' if scripts.match?(/jQuery|\$\(|\$\./);"
docker compose down
```

Result:

- Site builds successfully.
- Dev server starts successfully at `http://0.0.0.0:4000/`.
- Remaining custom scripts parse successfully without jQuery.
- Generated and served output no longer includes or references jQuery.
- Served HTML now points to cache-busted custom script URLs for the T004H replacements.
- Existing non-fatal Faraday retry warning remains.

#### T004C — Contact validation migration

Completed:

- Removed the global `/js/contact-form-validator.min.js` script load.
- Removed `data-toggle="validator"` from active contact/VIP forms.
- Deleted `js/contact-form-validator.min.js`.
- Kept validation native with required name, email, and message fields plus `type="email"`.
- Fixed `/contact` form field types and `name` attributes so native validation and Formspree submission use the expected fields.

Validation performed:

```sh
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build"
docker compose run --rm site sh -c "test ! -e js/contact-form-validator.min.js && ! grep -R 'data-toggle=\"validator\"\|contact-form-validator.min.js' _site"
docker compose down
```

Result:

- Site builds successfully.
- Generated output no longer references the removed validator plugin or `data-toggle="validator"` hooks.
- Existing non-fatal Faraday retry warning remains.

#### T004D — Gallery/lightbox modernization

Completed:

- Removed global Magnific Popup CSS/JS loads and deleted `css/magnific-popup.css` plus `js/jquery.magnific-popup.min.js`.
- Removed jQuery Shuffle and deleted `js/jquery.shuffle.min.js` plus `js/portfolio.js`.
- Added dependency-free `js/gallery.js` for gallery filtering, image lightbox navigation, and sponsor inline modal content.
- Removed hardcoded Shuffle inline positioning and `shuffle-item` classes from gallery/sponsor templates.
- Replaced Magnific-specific Sass with the new modal styles.

Validation performed:

```sh
node --check js/gallery.js
git diff --check
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build"
docker compose run --rm site sh -c "test -f _site/js/gallery.js && ! grep -R 'jquery.shuffle.min.js\|jquery.magnific-popup.min.js\|magnific-popup.css\|mfp-hide\|shuffle-item\|data-groups=' _site"
docker compose up
docker compose exec site ruby -ropen-uri -e "gallery = URI.open('http://localhost:4000/gallery/').read; script = URI.open('http://localhost:4000/js/gallery.js').read; abort('missing gallery markup') unless gallery.include?('/js/gallery.js') && gallery.include?('gallery-grid') && gallery.include?('image-lightbox'); abort('missing gallery script') unless script.include?('initLightbox')"
docker compose down
```

Result:

- Site builds successfully.
- Dev server starts successfully at `http://0.0.0.0:4000/`.
- Generated output no longer references Magnific Popup or jQuery Shuffle assets/hooks.
- Gallery page serves the new gallery markup and script.
- Existing non-fatal Faraday retry warning remains.

#### T004F — Bootstrap 5 migration

Completed:

- Replaced local Bootstrap `4.0.0-alpha.6` CSS/JS with Bootstrap `5.3.8` CDN CSS and bundled JS.
- Removed the Tether CDN script.
- Deleted old local Bootstrap files:
  - `css/bootstrap.min.css`
  - `css/bootstrap.min.css.map`
  - `js/bootstrap.min.js`
- Updated active Bootstrap data attributes, navbar classes, hero carousel markup, image classes, offset classes, spacing helpers, age-gate modal classes, and Sass compatibility selectors.
- Bootstrap no longer requires jQuery. jQuery remains for `preloader.js`, `hide-nav.js`, and `map.js`.

Validation performed:

```sh
git diff --check
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build"
docker compose run --rm site sh -c "grep -R 'bootstrap@5.3.8' _site >/dev/null && ! grep -R 'cdnjs.cloudflare.com/ajax/libs/tether\|/js/bootstrap.min.js\|href=\"/css/bootstrap.min.css\|data-toggle=\|data-target=\|data-ride=\|navbar-toggleable\|img-responsive\|btn-default\|col-md-offset\|col-offset' _site"
docker compose up
docker compose exec site ruby -ropen-uri -e "home = URI.open('http://localhost:4000/').read; gallery = URI.open('http://localhost:4000/gallery/').read; raise 'missing bs css' unless home.include?('bootstrap@5.3.8/dist/css/bootstrap.min.css'); raise 'missing bs bundle' unless home.include?('bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js'); raise 'old collapse attrs' if home.include?('data-toggle=') || home.include?('data-target='); raise 'missing bs collapse attrs' unless home.include?('data-bs-toggle=\"collapse\"') && home.include?('data-bs-target=\"#navbar-toggle\"'); raise 'old image class' if gallery.include?('img-responsive');"
docker compose down
```

Result:

- Site builds successfully.
- Dev server starts successfully at `http://0.0.0.0:4000/`.
- Generated output uses Bootstrap `5.3.8` CDN assets and no longer references Tether or old local Bootstrap assets.
- Generated output no longer contains the checked Bootstrap 4 alpha attributes/classes.
- Existing non-fatal Faraday retry warning remains.

#### T004G — Icon consolidation

Completed:

- Added `_includes/icon.html` as a small inline SVG icon renderer for active site icons.
- Replaced active Font Awesome and Material Icons markup with inline SVG includes.
- Removed the Google Material Icons stylesheet from `_layouts/default.html`.
- Deleted Font Awesome CSS and unused local icon font files:
  - `css/font-awesome.min.css`
  - `fonts/FontAwesome.otf`
  - `fonts/fontawesome-webfont.*`
  - `fonts/glyphicons-halflings-regular.*`
- Updated Sass icon sizing and related selectors from icon-font classes to `.site-icon`.

Validation performed:

```sh
git diff --check
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build"
docker compose run --rm site sh -c "grep -R 'class=\"site-icon' _site >/dev/null && ! grep -R 'fonts.googleapis.com/icon\|font-awesome.min.css\|fa fa-\|md-icon\|fontawesome-webfont\|glyphicons-halflings' _site"
docker compose up
docker compose exec site ruby -ropen-uri -e "paths = ['/', '/gallery/', '/training/']; html = paths.map { |p| URI.open('http://localhost:4000' + p).read }.join; raise 'missing inline icons' unless html.include?('class=\"site-icon') && html.include?('<svg'); raise 'old icon font ref' if html.match?(/fonts.googleapis.com\/icon|font-awesome\.min\.css|fa fa-|md-icon|fontawesome-webfont|glyphicons-halflings/);"
docker compose down
```

Result:

- Site builds successfully.
- Dev server starts successfully at `http://0.0.0.0:4000/`.
- Generated and served pages contain inline SVG icons and no longer reference Font Awesome, Material Icons, Font Awesome fonts, or Glyphicon fonts.
- Existing non-fatal Faraday retry warning remains.

#### T004B — Smooth scroll migration

Completed:

- Removed `js/jquery.easing.min.js` and `js/smooth-scroll.js` from global script loading.
- Deleted the unused easing/smooth-scroll files.
- Added native CSS smooth scrolling in `_sass/_custom.scss`.
- Kept existing `smooth-scroll` classes as harmless semantic hooks for now.

Validation performed:

```sh
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build"
docker compose run --rm site sh -c "find _site -maxdepth 1 \( -name 'FRONTEND_AUDIT*' -o -name 'CONTENT_AUDIT*' -o -name 'MODERNIZATION*' -o -name 'README*' \) -print"
docker compose up
docker compose down
```

Result:

- Site builds successfully.
- Dev server starts successfully at `http://0.0.0.0:4000/`.
- Planning docs remain excluded from `_site`.

#### T004A — Easy dependency removal audit/fixes

Completed:

- Confirmed Owl Carousel target IDs were not present in active source.
- Removed global Owl Carousel CSS/JS loads and deleted the local Owl Carousel asset files.
- Removed inline Owl Carousel initializers for `#testimonials-carousel-2` and `#clients-carousel`.
- Removed the unused Bootstrap tooltip initializer after no active tooltip trigger attributes were found.

Remaining follow-up decisions:

- Preloader remains loaded pending a design/UX decision.
- Contact validation remains loaded and is now tracked as `T004C`.

Validation performed:

```sh
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build"
docker compose up
docker compose down
```

Result:

- Site builds successfully.
- Dev server starts successfully at `http://0.0.0.0:4000/`.

#### T004 — Audit frontend dependencies

Completed:

- Created `FRONTEND_AUDIT.md`.
- Added `FRONTEND_AUDIT.md` to Jekyll excludes.
- Inventoried frontend dependencies and classified keep/remove/replace paths.
- Documented recommended follow-up tasks.

#### T003E — Social sharing cleanup

Completed:

- Removed unused `_includes/socialmedia.html` after confirming no direct includes.
- Avoided preserving obsolete Google+/malformed share links.

#### T003D — Global metadata/footer consolidation

Completed:

- Updated `_data/global.yml` canonical URL to match `CNAME`.
- Centralized footer wording in `_data/global.yml`.
- Updated `_layouts/default.html` footer to use generated year plus `site.data.global.footer_text`.

Remaining note:

- Business should still confirm the canonical URL and approved footer wording.

#### T003C — Product post review/archive

Partially completed:

- Normalized obvious placeholder `GUN MODEL HERE` categories to `gun`.
- Replaced one imported placeholder description.
- Fixed obvious product post typos and an inconsistent image path.

Remaining decision:

- Business/legal/content review is still needed to decide whether old 2017 product posts should remain public.

#### T003A — Safe typo/placeholder copy fixes

Completed:

- Fixed membership section typos/pluralization.
- Fixed contact form `_subject` placeholder text.

#### T003 — Audit content/data staleness

Completed:

- Created `CONTENT_AUDIT.md`.
- Added `CONTENT_AUDIT.md` to Jekyll excludes.
- Listed stale/suspicious content and data findings.
- Added recommended follow-up tasks.
- No production content was changed.

#### T002 — Clean Jekyll config

Completed:

- Cleaned `_config.yml` legacy/deprecated settings.
- Preserved site build behavior.
- Verified repo/dev metadata files are excluded from `_site`.
- Validated Docker build/server startup.

#### T001 — Add reproducible Bundler setup

Completed:

- Added `Gemfile`.
- Added `Gemfile.lock`.
- Updated Dockerfile to use Bundler.
- Updated README.
- Validated Docker build and serve.

## Validation Commands

### Docker build

```sh
docker compose --progress plain build
```

### Start dev server

```sh
docker compose up
```

Expected success output includes:

```text
Server address: http://0.0.0.0:4000/
Server running... press ctrl-c to stop.
```

### Stop dev server

```sh
docker compose down
```

### Clean Docker volumes

Use this if generated output/cache volumes need to be reset:

```sh
docker compose down --volumes
```

## Known Non-Fatal Warnings

As of the end of Phase 2, the previous `gems:` and `kramdown.coderay` deprecation warnings have been removed.

There may still be a GitHub Pages dependency warning:

```text
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
```

This warning comes from the GitHub Pages dependency stack and is not currently blocking local development.

## Git Hygiene

Before starting a task, check:

```sh
git status --short
```

Do not overwrite or revert unrelated user changes.

Keep each task small enough to review independently.

## Current Next Step

The next recommended task is:

```text
T003F — Map iframe implementation
```

For frontend cleanup, the next recommended task is:

```text
None currently queued; continue with the content/map task board.
```
