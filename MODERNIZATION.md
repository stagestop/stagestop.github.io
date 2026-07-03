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

Status: In progress

Completed so far:

- Added repo/dev metadata files to `_config.yml` `exclude` so they are not published by Jekyll:
  - `README.md`
  - `MODERNIZATION.md`
  - `Dockerfile`
  - `docker-compose.yml`
  - `Gemfile`
  - `Gemfile.lock`
  - `.dockerignore`

Remaining goals:

- Replace deprecated `gems:` config with `plugins:`.
- Review whether `jekyll-paginate` is needed since `paginate` is currently commented out.
- Remove likely-unused `rdiscount` and `redcarpet` config.
- Clean or remove deprecated `kramdown.coderay` config.
- Review duplicate/conflicting `include` config.

Expected result:

- Site still builds and serves.
- `gems:` deprecation warning is gone.
- Fewer legacy config warnings.

### Phase 3 — Content/data cleanup

Status: Not started

Goals:

- Review `_data/map.yml`, which appears stale/template-derived and references “Cozy Cottage”.
- Review Google Maps API key usage and consolidate/remove duplicate map integrations.
- Check whether the Google API key is restricted to expected domains/APIs.
- Update stale global metadata where appropriate, such as footer year and canonical URL.
- Audit `_posts/` for placeholder content such as `GUN MODEL HERE`.
- Fix obvious content typos discovered during the audit.

### Phase 4 — Frontend dependency inventory

Status: Not started

Goals:

Audit frontend assets and classify each as `keep`, `remove`, or `replace`.

Assets to review include:

- `jquery.min.js`
- `bootstrap.min.js`
- Tether CDN usage
- `jquery.easing.min.js`
- `smooth-scroll.js`
- `jquery.magnific-popup.min.js`
- `jquery.shuffle.min.js`
- `owl.carousel.min.js`
- `contact-form-validator.min.js`
- `font-awesome.min.css`
- `animate.css`
- Google Maps JS usage

Expected result:

A documented inventory of where each dependency is used and a recommended action for each.

### Phase 5 — Easy frontend removals

Status: Not started

Potential candidates:

- Replace jQuery smooth scrolling/easing with native CSS `scroll-behavior: smooth` if behavior allows.
- Replace contact form validation with native HTML5 validation if sufficient.
- Remove unused frontend files identified in Phase 4.

### Phase 6 — Bootstrap modernization

Status: Not started

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
- Magnific Popup → GLightbox or PhotoSwipe
- jQuery Shuffle → vanilla JS filtering/CSS Grid or modern Shuffle.js
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

#### T002 — Clean Jekyll config

Scope:

- `_config.yml`
- `README.md` only if validation/development instructions need to change
- `MODERNIZATION.md` to record outcome

Do:

- Replace deprecated `gems:` with `plugins:`.
- Decide whether to keep or remove `jekyll-paginate`.
- Remove unused `rdiscount` and `redcarpet` config if safe.
- Clean deprecated `kramdown.coderay` config if safe.
- Run Docker validation.

Do not:

- Change frontend dependencies.
- Change content pages/posts.
- Change layouts.
- Start Bootstrap migration.

Acceptance criteria:

- Docker build succeeds.
- Jekyll server starts successfully.
- No behavior-impacting content/layout changes are made.
- Repo/dev metadata files are not emitted into `_site`.
- `gems:` deprecation warning is eliminated.
- Any remaining warnings are documented here.

Validation:

```sh
docker compose --progress plain build
docker compose up
docker compose down
```

### Not started

#### T003 — Audit content/data staleness

Scope:

- No code changes unless explicitly requested.
- Produce an audit list in this file or a separate `CONTENT_AUDIT.md`.

Acceptance criteria:

- List stale or suspicious content/data.
- Note recommended fix for each item.
- Identify any items requiring business/user confirmation.

#### T004 — Audit frontend dependencies

Scope:

- No code changes unless explicitly requested.
- Inspect frontend asset usage.

Acceptance criteria:

- Inventory each frontend dependency.
- Classify as keep/remove/replace.
- Identify replacement candidate and migration risk.

### Done

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

As of the end of Phase 1, the site serves but prints warnings including:

```text
Deprecation: The 'gems' configuration option has been renamed to 'plugins'.
```

And deprecated `kramdown.coderay` warnings such as:

```text
Deprecation: You are using 'kramdown.coderay' in your configuration, please use 'syntax_highlighter_opts' instead.
```

There may also be a GitHub Pages dependency warning:

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

Continue:

```text
T002 — Clean Jekyll config
```

Recent validation for the exclude safety fix:

```sh
docker compose run --rm site sh -c "rm -rf _site/* && bundle exec jekyll build && find _site -maxdepth 1 -type f | sort"
```

Result:

- Build succeeded.
- `_site` no longer contains `MODERNIZATION.md`, `MODERNIZATION.html`, `README.md`, `Dockerfile`, `docker-compose.yml`, `Gemfile`, or `Gemfile.lock`.
