# Portfolio Fix and Shareability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the live portfolio's functional defects, remove referees' published contact details, and add the metadata/assets that make it look professional when shared.

**Architecture:** Static GitHub Pages site: `portfolio-config.js` holds all content, `script.js` renders most sections into empty containers in `index.html`, `styles.css` holds all presentation. Changes therefore split between config data, DOM generation, and a small amount of static head/asset work. No build step is introduced.

**Tech Stack:** Vanilla HTML/CSS/JS, GitHub Pages, `agent-browser` for browser verification, `sips` for image downscaling, `sips`/inline SVG for favicon fallback.

**Spec:** `/private/var/folders/bc/y54m3l0s4blgfmqvht67zrx00000gn/T/opencode/portfolio-improvement-design.md`

## Global Constraints

- Source of truth is `origin/main` (what is deployed). Never edit the stale clone at `~/Documents/GitHub/online-portfolio` or its uncommitted `styles.css`.
- Domain is exactly `https://lloydagonia.is-a.dev/`; canonical and og:url must use it.
- Referees keep name, title, relationship and portrait; **no email, no phone** anywhere in rendered output.
- Résumé file is `~/Documents/LloydAgonia_Resume.pdf`, copied as-is to site root as `LloydAgonia_Resume.pdf`.
- No visual redesign. Keep the TCG theme, dark/light themes, motion toggle and existing copy intact.
- Section title must read "References", not "Character References".
- All verification uses `agent-browser` with session `portfolio-fix`, plus `curl` against the local static server.

## Review Focus

- **Narrow viewport (390px) with the TikTok tile present:** gallery must not overflow horizontally or leave a 400px+ hole; test in Task 3 at 390×844.
- **Sticky-nav scroll offset on every section:** the highlighted nav item must name the section currently in view, including the last section and after resize; test in Task 3 with `scrollIntoView` per section at 1440px and 390px.
- **No-JS / link-preview bots:** the static HTML alone must contain a factual name/role summary and contact link; test in Task 6 by fetching raw HTML with `curl` and asserting content.
- **Referee data leaking through other paths:** config, rendered cards, JSON-LD and static fallback must all be free of phone/email; test in Task 2 with a regex over `portfolio-config.js` and a browser DOM text check.
- **Dead link regression:** no `.tcg-foot__link` may resolve to `#projects`; test in Task 4 by asserting every project action has a working click handler or an external http(s) href.

---

### Task 1: Isolated worktree and baseline

**Files:**
- Create: git worktree at a path under the repo's parent (via `superpowers:using-git-worktrees`)
- Copy: design doc and this plan into `docs/superpowers/` in the worktree (documentation only)

**Interfaces:**
- Consumes: `origin/main` of `https://github.com/djdark08/online-portfolio.git`
- Produces: a clean working directory whose HEAD equals `origin/main`, with a branch named `portfolio-fixes`; verified local server at `http://localhost:8000`

- [ ] **Step 1: Load the worktree skill and create the worktree**

Use `superpowers:using-git-worktrees`. Base the worktree on `origin/main` (fetch first). Branch name: `portfolio-fixes`. Do not reuse the stale clone.

- [ ] **Step 2: Confirm baseline matches the live site**

Run: `cd <worktree> && git rev-parse HEAD && git rev-parse origin/main && git status --short`
Expected: identical hashes, clean status.

- [ ] **Step 3: Start a local static server and take a baseline snapshot**

Run: `cd <worktree> && python3 -m http.server 8000` (background)
Then with `agent-browser --session portfolio-fix`, open `http://localhost:8000/`, set viewport 1440×900, screenshot `/tmp/pf-before.png` (full page after scrolling through all sections). Record the axe count with `agent-browser a11y`.

- [ ] **Step 4: Commit the plan documents**

```bash
git add docs/superpowers/
git commit -m "docs: portfolio fix design and implementation plan"
```

---

### Task 2: Remove referees' published contact details

**Files:**
- Modify: `portfolio-config.js` (`references` block, ~lines 400–435)
- Modify: `script.js` (`populateReferences`, ~lines 1661–1710)

**Interfaces:**
- Consumes: `config.references.list` with fields `name`, `title`, `relationship`, `image`
- Produces: `populateReferences()` renders only name/title/relationship/image plus a static note "References available on request."; no function signature changes

- [ ] **Step 1: Write the failing check as a small script**

Create `tests/check-reference-privacy.sh` that fails if either condition holds:
- `grep -E '(email|phone)[[:space:]]*:' portfolio-config.js` matches inside the `references:` block (use `sed -n '/references:/,/^[[:space:]]*},/p'` to scope it);
- the browser DOM text of `#references-grid` matches `[0-9]{10,}` or `@`.

- [ ] **Step 2: Run it and confirm it fails on the current code**

Run: `bash tests/check-reference-privacy.sh`
Expected: FAIL, citing the four email/phone pairs.

- [ ] **Step 3: Edit `portfolio-config.js`**

Delete the `email` and `phone` properties from all four reference objects. Change `title: "Character References"` to `title: "References"`. Leave every other key and value unchanged.

- [ ] **Step 4: Edit `populateReferences()` in `script.js`**

Remove the two `.tcg-move` rows that render `reference.email` and `reference.phone`. After the moves block, append one element:
`<p class="references-note">References available on request.</p>`
Use `escapeHtml()` on any config-derived string that remains, as the surrounding code already does.

- [ ] **Step 5: Add minimal styling for `.references-note` in `styles.css`**

Reuse existing muted-text variables (e.g. `var(--text-muted)`) and spacing already used by `.about-description`; do not add a new design token.

- [ ] **Step 6: Run the check and browser verification**

Run: `bash tests/check-reference-privacy.sh` — expected PASS.
Then in `agent-browser`: reload, scroll to `#references`, `agent-browser read` the section text; confirm four names and titles appear, no digits-only phone strings and no `@` addresses.

- [ ] **Step 7: Commit**

```bash
git add portfolio-config.js script.js styles.css tests/check-reference-privacy.sh
git commit -m "fix: remove referees' published contact details"
```

---

### Task 3: Fix gallery tile height and scroll-spy

**Files:**
- Modify: `script.js` (`initSmoothScrolling`, ~lines 1360–1390; `populateProjectsWithTikTok`, ~lines 883–905)
- Modify: `styles.css` (`.gallery-tiktok-phone` rules at ~4328, ~4427, ~4533)

**Interfaces:**
- Consumes: `.projects-grid .gallery-tiktok-phone` and `section[id]` elements
- Produces: grid tile height aligned with `.tcg-card` siblings; active nav link matches the section at the top of the viewport

- [ ] **Step 1: Write the failing browser check**

Create `tests/check-layout.mjs` using `agent-browser` CLI calls (via `child_process.execFileSync`) that asserts, at 1440×900, 820×1180 and 390×844:
- after `document.querySelector('#projects').scrollIntoView({behavior:'instant'})`, `Math.abs(phoneCard.height - firstTcgCard.height) <= 24`;
- `document.documentElement.scrollWidth <= innerWidth + 1`;
- after `document.querySelector('#<id>').scrollIntoView({behavior:'instant'})` for each of `home, about, technical-skills, experience, projects, references, contacts`, the element `document.querySelector('.nav-link.active')?.getAttribute('href')` equals `#<id>`.

- [ ] **Step 2: Run it and confirm it fails**

Run: `node tests/check-layout.mjs`
Expected: FAIL on the phone-card height (892 vs ~430) and on at least one nav id.

- [ ] **Step 3: Fix the gallery tile CSS**

In `styles.css`, keep one authoritative rule for `.projects-grid .gallery-tiktok-phone`: `grid-row: span 2` removed, `height: 100%`, `align-self: stretch`, `display:flex`, `align-items:center`, `justify-content:center`. Constrain `.iphone-container` with `height:100%`, `aspect-ratio:425/900`, `max-height:100%`, `width:auto` so the phone scales down to the row height rather than forcing it. Remove the earlier conflicting block. Keep the responsive `@media` overrides working.

- [ ] **Step 4: Fix scroll-spy positioning**

In `initSmoothScrolling()`'s `syncActiveSection`, replace `section.offsetTop` with `section.getBoundingClientRect().top + window.scrollY`. Set the probe to `window.scrollY + (navbar.getBoundingClientRect().height + 24)`. Recompute the section list on `resize` (or recompute positions inside the handler, which is simpler). Keep `updateActiveNavLink(link)` as the single writer of `.active`/`aria-current`.

- [ ] **Step 5: Run the layout check at all three viewports**

Run: `node tests/check-layout.mjs`
Expected: PASS for every viewport and section.

- [ ] **Step 6: Commit**

```bash
git add script.js styles.css tests/check-layout.mjs
git commit -m "fix: align gallery tile and correct active navigation"
```

---

### Task 4: Replace dead project links with a working detail view

**Files:**
- Modify: `script.js` (`populateProjectsWithTikTok`, ~lines 909–938; new `openProjectDetail(index)` near the existing video modal code at ~2282)
- Modify: `styles.css` (reuse `.video-modal*` visual language; add only selectors needed for image/text layout)

**Interfaces:**
- Consumes: `config.projects.list[index]` fields `name`, `description`, `image`, `technologies`, `featured`
- Produces: global `openProjectDetail(index)`; every project footer button calls it; modal element `#project-detail-modal` with close button `#project-detail-close`, backdrop `#project-detail-backdrop`; modal closes on backdrop click and Escape

- [ ] **Step 1: Write the failing browser check**

Create `tests/check-project-links.mjs` asserting:
- no `.tcg-foot__link` has `href="#projects"` or no href;
- clicking the first `.tcg-foot__link` produces a visible `#project-detail-modal` containing the exact first project name from `config.projects.list[0].name`, its description, an `<img>` whose `src` equals its `image`, and each technology string;
- pressing Escape closes the modal (`!classList.contains('active')`).

- [ ] **Step 2: Run it and confirm it fails**

Run: `node tests/check-project-links.mjs`
Expected: FAIL on the first assertion (all six hrefs are `#projects`).

- [ ] **Step 3: Generate working project actions**

In `populateProjectsWithTikTok()`, replace the `<a class="tcg-foot__link" href="${project.link}" target="_blank" ...>` with a `<button type="button" class="tcg-foot__link" data-project-index="${index}">Open ↗</button>`. Keep the visible label and card styling. Ignore the now-unused `link` config value rather than deleting it.

- [ ] **Step 4: Implement the detail modal**

Add `initProjectDetailModal()` following the existing `createVideoModal()` pattern: build modal HTML once, delegate clicks on `.tcg-foot__link[data-project-index]`, call `openProjectDetail(index)`, close on backdrop/Escape, restore focus to the invoking button. `openProjectDetail(index)` reads from `config.projects.list`, uses `escapeHtml()` for all text and the image src, and sets an accessible `aria-label`/heading. Call `initProjectDetailModal()` from the same init path that calls `createVideoModal()`.

- [ ] **Step 5: Add focused CSS**

Reuse `.video-modal`, `.video-modal-backdrop`, `.video-modal-content`, `.video-modal-close` rules for the new ids via a shared selector list; add only an image sizing rule (`max-height:60vh; object-fit:contain`) and a wrapping rule for tech tags.

- [ ] **Step 6: Run the check and confirm no new axe violations**

Run: `node tests/check-project-links.mjs` — expected PASS.
Open the modal and run `agent-browser a11y`; compare count with the Task 1 baseline and confirm no new serious/critical violations.

- [ ] **Step 7: Commit**

```bash
git add script.js styles.css tests/check-project-links.mjs
git commit -m "feat: open project details instead of dead links"
```

---

### Task 5: Résumé and favicon assets

**Files:**
- Create: `LloydAgonia_Resume.pdf`, `favicon.svg`, `favicon.ico`
- Modify: `index.html` (hero and contacts static markup), `script.js` (`populateContact()` generated markup, ~lines 968–1010)

**Interfaces:**
- Consumes: existing local PDF and site identity
- Produces: `/LloydAgonia_Resume.pdf`, `/favicon.svg`, `/favicon.ico`, and a `.resume-download` link present in both hero and contact card

- [ ] **Step 1: Copy the résumé**

Run: `cp ~/Documents/LloydAgonia_Resume.pdf <worktree>/LloydAgonia_Resume.pdf`
Verify: `file` reports PDF and `ls -lh` size is plausible (non-zero).

- [ ] **Step 2: Create the favicon assets**

Write `favicon.svg`: a 64×64 SVG using the site's existing accent colour and the letters "LA" (no external assets, no new portrait). Generate `favicon.ico` from it with `sips -s format ico` where supported, or use a tiny hand-written ICO containing the same mark. Both must be valid files that return 200 from the static server.

- [ ] **Step 3: Add the hero download button**

In `index.html`, add inside `.hero-text` after the title:
`<a class="resume-download" href="/LloydAgonia_Resume.pdf" download>Download résumé</a>`
Style it with existing button/card variables in `styles.css`, matching the theme.

- [ ] **Step 4: Add the contact-section link**

In `index.html`'s static `.contact-simple` block and in `populateContact()`'s generated `.contact-moves`, add the same résumé link with `download`. Use `href="/LloydAgonia_Resume.pdf"` in both.

- [ ] **Step 5: Verify asset responses and link presence**

Run for each asset: `curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:8000/<asset>`
Expected: `200` for `LloydAgonia_Resume.pdf`, `favicon.svg`, `favicon.ico`.
In the browser, assert two elements with `.resume-download` exist and both hrefs resolve to the PDF.

- [ ] **Step 6: Commit**

```bash
git add LloydAgonia_Resume.pdf favicon.svg favicon.ico index.html script.js styles.css
git commit -m "feat: publish resume and add favicon"
```

---

### Task 6: Share metadata, fallbacks and corrected heading

**Files:**
- Create: `robots.txt`, `sitemap.xml`, `og-image.jpg`
- Modify: `index.html` (head, hero heading tags, noscript block), `styles.css` (heading class preservation, noscript styling)

**Interfaces:**
- Consumes: final title/description copy from the spec; existing `images/profile.jpg`
- Produces: complete head metadata; `<h1>` contains the name/role; a `<noscript>` block with factual fallback content; `robots.txt`/`sitemap.xml`/`og-image.jpg` served at root

- [ ] **Step 1: Write the failing metadata check**

Create `tests/check-seo.sh` that fetches `http://localhost:8000/` and asserts the presence of:
`<meta name="description"`, `property="og:title"`, `property="og:description"`, `property="og:image"`, `property="og:url" content="https://lloydagonia.is-a.dev/"`, `name="twitter:card"`, `rel="canonical"`, `rel="icon"`, `application/ld+json`, `<h1` containing `Lloyd`, `<noscript>`, and `Download résumé`.
Also assert `curl` returns 200 for `/robots.txt`, `/sitemap.xml`, `/og-image.jpg`, and that `robots.txt` contains `Sitemap: https://lloydagonia.is-a.dev/sitemap.xml`.

- [ ] **Step 2: Run it and confirm it fails**

Run: `bash tests/check-seo.sh`
Expected: FAIL on the first missing meta tag.

- [ ] **Step 3: Add head metadata**

In `index.html` `<head>`, add: meta description (one sentence covering robotics/automation and software/networking, aimed at recruiters and clients); og:title, og:description, og:type=`website`, og:url, og:image=`https://lloydagonia.is-a.dev/og-image.jpg`; twitter:card=`summary_large_image`, twitter:title, twitter:description, twitter:image; canonical; theme-color matching the site accent; `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` and PNG/ICO fallback; JSON-LD `Person` with `name`, `jobTitle`, `url`, `email` (from config) and `sameAs` for GitHub/LinkedIn. Do not include any referee data.

- [ ] **Step 4: Generate the OG image and discovery files**

Run: `sips -Z 1200 <worktree>/images/profile.jpg --out <worktree>/og-image.jpg` (adjust with `-s format jpeg -s formatOptions 80` if needed; target under 300 KB).
Write `robots.txt` allowing all and pointing to the sitemap. Write `sitemap.xml` with a single `https://lloydagonia.is-a.dev/` URL and today's `lastmod`.

- [ ] **Step 5: Correct the heading and add the fallback**

Change `<h1 class="hero-greeting">Hello.</h1>` to `<p class="hero-greeting">Hello.</p>` and promote the existing name/role heading to `<h1>`, preserving its classes. Update `styles.css` only if a tag selector depended on the old tag (prefer class selectors; add `.hero-title` styling if needed). Add a `<noscript>` block containing a short factual summary: name, role, 3–4 skill areas, 2–3 experience highlights, project names, and a mailto link. Add a comment in the HTML that this block must stay in sync with `portfolio-config.js`.

- [ ] **Step 6: Run the metadata check and a no-JS sanity check**

Run: `bash tests/check-seo.sh` — expected PASS.
Fetch raw HTML with `curl` and confirm the noscript text includes the name and at least one project name.

- [ ] **Step 7: Commit**

```bash
git add index.html styles.css robots.txt sitemap.xml og-image.jpg tests/check-seo.sh
git commit -m "feat: add share metadata and static fallbacks"
```

---

### Task 7: Full verification and hand-off

**Files:**
- No source changes expected; fix-forward commits only if verification finds a defect

**Interfaces:**
- Consumes: all prior tasks
- Produces: a verified branch `portfolio-fixes` with a reviewable commit history

- [ ] **Step 1: Run every automated check**

Run:
```bash
bash tests/check-reference-privacy.sh
node tests/check-layout.mjs
node tests/check-project-links.mjs
bash tests/check-seo.sh
```
Expected: all PASS.

- [ ] **Step 2: Browser pass at three viewports**

For 1440×900, 820×1180, 390×844: reload, scroll through every section, screenshot full page, check no horizontal overflow, no console errors (`agent-browser errors`), nav highlight correct, gallery aligned, modal works, résumé link works.

- [ ] **Step 3: Accessibility regression check**

Run `agent-browser a11y` on the final page. Compare with Task 1 baseline: no new serious or critical violations. Document any remaining ones as scope C.

- [ ] **Step 4: Diff review and status**

Run: `git log --oneline origin/main..HEAD`, `git diff --stat origin/main..HEAD`, `git status --short`.
Expected: seven clean commits, no unexpected files, clean working tree.

- [ ] **Step 5: Hand off**

Report: what changed, what was deliberately left for scope C/D, the branch name, and that deployment is a user decision (do not push to `origin/main` without explicit approval).
