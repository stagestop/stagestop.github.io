# Content and Data Audit

Date: 2026-07-03

This audit was created during Phase 3 of the modernization plan. It documents stale, suspicious, or cleanup-worthy content/data findings. It intentionally does not change production content.

## Summary

Priority findings:

1. `_data/map.yml` appears to be unused template/demo data.
2. Google Maps integration is duplicated/inconsistent and includes a hardcoded API key in `_layouts/default.html`.
3. Product post public/archive policy still needs business/legal/content confirmation.
4. Map strategy and Google API key restrictions still need confirmation.

Resolved during follow-up cleanup:

- Updated global URL/footer metadata to use `https://stagestopgunshop.com/` and data-driven footer text.
- Replaced the hardcoded footer year with a generated year.
- Normalized obvious product post placeholder categories/descriptions and typo/image issues.
- Fixed contact form subject placeholder text.
- Removed unused `_includes/socialmedia.html`.
- Fixed obvious membership section typos/pluralization.

## Findings

### C001 — `_data/map.yml` appears stale/template-derived

Files:

- `_data/map.yml`

Evidence:

```yaml
latitude: 52.741865
longitude: -8.772812
title: Cozy Cottage
```

Why it matters:

The coordinates and title do not match Stage Stop Gun Shop. The file appears to be leftover template data.

Resolution:

Removed `_data/map.yml` in `T003F` after confirming the active map implementation now uses `_data/locations.yml`.

Recommendation:

No further action needed unless a future map data model is introduced.

Requires confirmation:

No.

---

### C002 — Google Maps integration is duplicated/inconsistent

Files:

- `_layouts/default.html`
- `_includes/java.html`
- `js/map.js`
- `_data/global.yml`
- `_pages/about.md`
- `_pages/contact.md`
- `_pages/vip.md`
- `_sections/atwater-location.md`
- `_sections/mariposa-location.md`

Evidence:

`_layouts/default.html` loads Google Maps with a hardcoded key:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBA40uewXP25u1A4o9u8ueBimZZwIdNLkY"></script>
<script src="/js/map.js"></script>
```

`_includes/java.html` also loads Google Maps, but uses `_data/global.yml`:

```liquid
<script async defer
src="https://maps.googleapis.com/maps/api/js?key={{ site.data.global.googleaccess }}&callback=initMap">
</script>
```

`_data/global.yml` contains:

```yaml
googleaccess: AIzaSyCPsb2iR18DXjHDRV8_O5P47UN1o3MNPY8
```

`js/map.js` targets `mapAtwater` and `mapMariposa`, while several pages use `id="map"`.

Why it matters:

- There appear to be two API keys or two map-loading approaches.
- A hardcoded key in a layout is harder to rotate/restrict.
- Some map containers may not correspond to the script currently loaded.
- Public client-side Google API keys should be domain/API restricted in Google Cloud.

Recommendation:

Decision from `T003B`:

Use Google Maps iframe embeds for visible location maps and keep the existing external Google Maps address links in `_data/locations.yml` for directions. Do not keep the Google Maps JavaScript API for ordinary store-location maps.

Resolution:

Implemented in `T003F`:

1. Replaced active JS maps with iframe embeds driven by `_data/locations.yml`.
2. Removed the global Maps JS API script and `js/map.js`.
3. Removed unused `_includes/java.html`.
4. Removed unused `_data/map.yml`.
5. Removed `_data/global.yml` `googleaccess`.
6. Removed broken empty `id="map"` containers on `/about`, `/contact`, and `/vip` without adding new visible maps.

Remaining follow-up:

Treat exposed API keys as public and rotate, revoke, or restrict them in Google Cloud if they are still active.

Requires confirmation:

Yes. Business/site owner should confirm the exposed keys have been rotated, revoked, or restricted outside the repo.

---

### C003 — Global site metadata is stale/inconsistent

Files:

- `_data/global.yml`
- `_layouts/default.html`
- `CNAME`

Evidence:

`CNAME` points to:

```text
stagestopgunshop.com
```

But `_data/global.yml` uses:

```yaml
url: 'https://stagestop.github.io/'
footer_text: '©2017 Stage Stop Gun Shop All Rights Reserved www.stagestopgunshop.com'
```

`_layouts/default.html` hardcodes a footer year separately:

```html
<p>Copyright © 2017. Stage Stop Gun Shop. All Rights Reserved.</p>
```

Why it matters:

- Share URLs or SEO/canonical links may point to the GitHub Pages URL instead of the custom domain.
- Footer copyright is stale.
- There are duplicate sources of truth for footer text.

Resolution:

- Updated `_data/global.yml` URL to `https://stagestopgunshop.com/` based on `CNAME`.
- Updated `_data/global.yml` `footer_text` to remove the stale year.
- Updated `_layouts/default.html` to render the footer year dynamically from `site.time` and use `site.data.global.footer_text`.

Remaining recommendation:

Confirm that `https://stagestopgunshop.com/` is the preferred canonical URL and that the footer wording is approved.

Requires confirmation:

Low. The code now matches the repository `CNAME`, but business approval is still recommended.

---

### C004 — Product posts contain placeholder categories/descriptions

Files:

- `_posts/2017-8-11-gun-1002.md`
- `_posts/2017-8-11-gun-1003.md`
- `_posts/2017-8-11-gun-1004.md`
- `_posts/2017-8-11-gun-1005.md`
- `_posts/2017-8-11-gun-1006.md`
- `_posts/2017-8-11-gun-1009.md`

Evidence:

Several posts use:

```yaml
categories: GUN MODEL HERE
```

One post has an imported placeholder description:

```yaml
description: 'No description present in the xl file. Need description. Send as a word doc only.'
```

Why it matters:

These posts may generate public pages with placeholder metadata and unprofessional copy.

Resolution:

- Normalized obvious `GUN MODEL HERE` categories to `gun`.
- Replaced the imported placeholder description in `_posts/2017-8-11-gun-1002.md` with a description derived from the post body.

Resolution:

Archived all legacy 2017 product posts from generated output in `T003C` by adding `published: false` to each post. Source files remain in `_posts/` for future review or restoration.

Remaining recommendation:

If these products should ever return to the public site, complete a business/legal/content review for availability, descriptions, dates, and compliance before republishing them.

Requires confirmation:

Yes. Product availability and firearm listing content may require business/legal review.

---

### C005 — Product post typos and suspicious metadata

Files:

- `_posts/2017-8-11-gun-1003.md`
- `_posts/2017-8-11-rifle-1008.md`

Evidence:

`_posts/2017-8-11-gun-1003.md` has typo `nad`:

```text
... is 6.62" in length nad has a cylinder capacity of 6.
```

`_posts/2017-8-11-rifle-1008.md` has typo `reducation` and points to a gun image path that may be wrong for a rifle post:

```yaml
image: '/images/guns/gun-1008.jpg'
```

Why it matters:

Visible typos and incorrect images reduce trust.

Resolution:

- Fixed `nad` → `and` in `_posts/2017-8-11-gun-1003.md`.
- Fixed `reducation` → `reduction` in `_posts/2017-8-11-rifle-1008.md`.
- Updated `_posts/2017-8-11-rifle-1008.md` front matter image from `gun-1008.jpg` to existing `rifle-1008.jpg`, matching the body image.
- Fixed `NRaptor` → `Raptor` in `_posts/2017-8-11-gun-1002.md`.

Resolution:

Archived the legacy product posts from generated output in `T003C`. The source files remain available for future review.

Requires confirmation:

Only if the archived product posts are republished later.

---

### C006 — Contact form subject uses placeholder domain

Files:

- `_layouts/contact.html`
- `_layouts/contact-vip.html`

Evidence:

```html
<input class="fldsz" class="hidden" type="hidden" name="_subject" value="Message via http://domain.com">
```

Why it matters:

Form submissions may have an unhelpful or placeholder subject line.

Resolution:

Changed subjects to meaningful values:

- `Message via Stage Stop Gun Shop website`
- `VIP message via Stage Stop Gun Shop website`

Remaining recommendation:

Consider changing the placeholder email input text `example@domain.com` if the business prefers friendlier placeholder copy.

Requires confirmation:

Low risk, but confirm desired wording if further edits are desired.

---

### C007 — Social sharing include has obsolete/malformed links

Files:

- `_includes/socialmedia.html`

Evidence:

- Uses Google+ sharing, which is obsolete:

```html
https://plus.google.com/share?url=...
```

- LinkedIn URL appears malformed:

```html
https://www.linkedin.com/shareArticle={{ site.url }}{{ page.url }}
```

- Pinterest uses `http://` instead of `https://`.
- Uses `site.url` and `site.twitter_username`, but these are not defined in `_config.yml`; `site.data.global.url` exists instead.

Current usage:

No direct includes of `socialmedia.html` were found during this audit, so the file may be unused.

Resolution:

Removed unused `_includes/socialmedia.html` after confirming no direct includes were present.

Remaining recommendation:

If social sharing is desired later, add a fresh maintained implementation rather than restoring the obsolete Google+/malformed share snippet.

Requires confirmation:

Only if social sharing should be reintroduced.

---

### C008 — `_includes/java.html` may be unused

Files:

- `_includes/java.html`

Evidence:

No `{% include java.html %}` references were found during this audit. The file duplicates Smartwaiver/Google Maps behavior that also appears in `_layouts/default.html`.

Why it matters:

Unused includes add confusion and can contain stale keys/scripts.

Resolution:

Removed `_includes/java.html` in `T003F` after map behavior was consolidated.

Requires confirmation:

No.

---

### C009 — Sponsor URL appears incomplete

Files:

- `_data/sponsors.yml`

Evidence:

```yaml
url: https://www.ronsmithgmc
```

Why it matters:

This URL likely does not resolve correctly as written.

Recommendation:

Confirm the correct sponsor URL and update it.

Requires confirmation:

Yes.

---

### C010 — Membership section contains typos/pluralization issues

Files:

- `_sections/membership.md`

Evidence:

```text
If you are looking to become a top-notch marksmen, look no futher.
```

```text
... your journey to become a top-notch marksmen.
```

Issues:

- `futher` → `further`
- `marksmen` should likely be `marksman` for singular usage, or sentence should be rewritten.

Resolution:

Fixed wording in `_sections/membership.md`:

```text
If you are looking to become a top-notch marksman, look no further.
```

Also updated the second sentence to use singular `marksman`.

Requires confirmation:

No further action unless different marketing copy is desired.

---

### C011 — Smartwaiver script appears in layout and unused include

Files:

- `_layouts/default.html`
- `_includes/java.html`

Evidence:

Both files reference Smartwaiver scripts, but only `_layouts/default.html` appears active.

Why it matters:

Duplicate third-party embeds can become stale or conflict if both are ever loaded.

Recommendation:

During map/script consolidation, keep Smartwaiver embed in one intentional location only.

Requires confirmation:

Yes, confirm desired Smartwaiver placement and styling.

---

### C012 — Footer and global data duplicate contact/social data

Files:

- `_layouts/default.html`
- `_data/global.yml`
- `_includes/followus.html`

Evidence:

Footer contact/social links are hardcoded in `_layouts/default.html`, while some site-wide data exists in `_data/global.yml` and social snippets exist in `_includes`.

Why it matters:

Multiple sources of truth make future updates error-prone.

Recommendation:

Eventually centralize business contact/social data in `_data/global.yml` or a dedicated `_data/contact.yml` and render from data.

Requires confirmation:

Yes, because contact data should be verified.

## Recommended Follow-Up Tasks

### T003A — Safe typo/placeholder copy fixes

Status: Complete

Completed:

- Fixed membership section typos/pluralization.
- Fixed contact form `_subject` placeholder text.

Risk: Low

Requires business confirmation: Minimal

### T003B — Map cleanup decision

Status: Complete

Decision:

- Use Google Maps iframe embeds plus existing external Google Maps address links.
- Do not keep the Google Maps JavaScript API for ordinary location maps.

Implementation:

- Completed in `T003F`.
- Removed unused `_data/map.yml` and `_includes/java.html`.
- Removed `googleaccess` from `_data/global.yml`.
- Removed the global Maps JS API script and `js/map.js`.
- Replaced visible maps with iframe embeds.

Remaining follow-up:

- Rotate, revoke, or restrict the exposed API keys outside the repo if they are still active.

Risk: Medium

Requires business confirmation: Yes, for API key remediation outside the repo.

### T003C — Product post review/archive

Status: Complete

Completed:

- Normalized obvious placeholder categories.
- Replaced one imported placeholder description.
- Fixed obvious post typos and one inconsistent image path.
- Archived all legacy 2017 product posts from generated output with `published: false`.
- Kept source files available for future business/legal/content review.

Remaining:

- If product posts are republished later, complete business/legal/content review for accuracy, availability, and compliance first.

Risk: Medium/High

Requires business/legal/content confirmation: Yes

### T003D — Global metadata/footer consolidation

Status: Mostly complete

Completed:

- Updated canonical URL in `_data/global.yml` to match `CNAME`.
- Centralized footer wording in `_data/global.yml`.
- Updated layout footer to use a generated year plus `site.data.global.footer_text`.

Remaining:

- Confirm canonical production URL and approved footer wording.
- Consider deeper consolidation of contact/social data in a future task.

Risk: Low/Medium

Requires business confirmation: Low

### T003E — Social sharing cleanup

Status: Complete

Completed:

- Confirmed `_includes/socialmedia.html` had no direct includes.
- Removed unused social sharing include instead of maintaining obsolete Google+/malformed links.

Risk: Low

Requires business confirmation: Only if social sharing should be reintroduced
