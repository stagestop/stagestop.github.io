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

Status: In progress

Recommended target:

- Bootstrap `5.3.x`

Expected work:

- Remove Tether.
- Update Bootstrap data attributes from `data-toggle`/`data-target` to `data-bs-toggle`/`data-bs-target`.
- Update old classes such as `.img-responsive` to `.img-fluid`.
- Update navbar and modal behavior.
- Remove Bootstrap’s jQuery dependency.

### Phase 7 — Replace larger jQuery plugins

Status: Not started

Candidate replacements:

- Owl Carousel → Splide or Swiper
- Magnific Popup → removed in `T004D`; replaced with dependency-free modal
- jQuery Shuffle → removed in `T004D`; replaced with vanilla filtering and existing grid layout
- Font Awesome 4 → Bootstrap Icons, Font Awesome 6, Lucide, or inline SVGs

Goal:

Remove jQuery once all dependent plugins are gone.

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

#### T003B — Map cleanup decision

Scope:

- Decide whether to use Google Maps JS, iframe embeds, or simple external links.
- Confirm production Google API key and restrictions.
- Do not remove active map behavior without confirmation.

Acceptance criteria:

- Chosen map strategy is documented.
- Follow-up implementation task is defined.

### Done

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
T003B — Map cleanup decision
```

For frontend cleanup, the next recommended task is:

```text
T004F — Bootstrap 5 migration
```
