# Gallery Cards, Phone Tile and Video Modal Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make gallery card spacing and tech bubbles uniform, separate the TikTok phone tile into its own gallery element, and scale Videos-tab modals to the viewport.

**Architecture:** CSS owns all presentation. `script.js` changes only the phone tile's emitted classes. Browser checks in `tests/` use the existing `agent-browser` session `portfolio-fix` against `http://localhost:8000/`.

**Tech Stack:** Static HTML/CSS/vanilla JS, Python `http.server` preview, `agent-browser` CLI.

**Spec:** `docs/superpowers/specs/2026-11-22-gallery-and-video-modal-design.md`

## Global Constraints

- No dependencies or build step.
- All six existing verification scripts must continue to pass.
- Viewports under test: 1440×900, 820×1180, 390×844.
- Browser navigation uses `window.location.href=...` eval, not `agent-browser open`, to avoid third-party load timeouts.
- Remote `origin/main` is `https://github.com/djdark08/online-portfolio.git`; no push or merge in this plan.

## Review Focus

- Cards with one tech bubble vs seven: every bubble must be the same height and every bubble fully visible — Task 1 test.
- Narrow viewport with long bubble names: bubbles wrap without horizontal overflow or clipped rows — Task 1 test.
- Phone tile after class separation: TikTok scrolling must still work and the tile must stay in the gallery grid with no hole — Task 2 test.
- YouTube modal at desktop and mobile widths: iframe must fill a 16:9 area that fits the viewport — Task 3 test.
- Portrait TikTok modal on both desktop and mobile: iframe must be 9:16 and fit the viewport — Task 3 test.

---

### Task 1: Uniform tech bubbles and card padding

**Files:**
- Modify: `styles.css` (`.tcg-card__inner`, `.project-card .tcg-energy`, `.tcg-energy .tech-tag`)
- Create: `tests/check-gallery-cards.mjs`

**Interfaces:**
- Consumes: `.project-card.tcg-card`, `.tcg-card__inner`, `.tcg-energy .tech-tag` rendered by `populateProjects()`.
- Produces: stable bubble geometry asserted again by Task 2.

- [ ] **Step 1: Write `tests/check-gallery-cards.mjs`**

At each viewport, navigate with a cache-busted `location.href`, scroll `#projects` into view, wait for reveal transforms to settle, then assert for every `.project-card.tcg-card`: all `.tech-tag` heights differ by at most 2px; `energy.scrollHeight <= energy.clientHeight + 2`; computed `paddingTop === paddingBottom === paddingLeft === paddingRight`; card content does not overflow (`scrollWidth <= clientWidth + 1`); document has no horizontal overflow. Print one PASS line on success.

- [ ] **Step 2: Run the new test and confirm it fails**

Run: `node tests/check-gallery-cards.mjs`
Expected: FAIL showing stretched (54px) bubbles and clipped energy rows.

- [ ] **Step 3: Fix the card CSS in `styles.css`**

Set `.tcg-card__inner` padding to `1rem` on all sides. Change `.project-card .tcg-energy` from fixed `height: 3.4rem; max-height: 3.4rem; overflow: hidden` to `min-height: 3.4rem; align-items: flex-start; align-content: flex-start`, and add `align-self: flex-start` to `.tcg-energy .tech-tag`.

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node tests/check-gallery-cards.mjs`
Expected: PASS at 1440/820/390.

- [ ] **Step 5: Commit**

`git add styles.css tests/check-gallery-cards.mjs && git commit -m "fix: normalize gallery card spacing and tech bubbles"`

### Task 2: Dedicated TikTok phone tile

**Files:**
- Modify: `script.js:893` (phone tile markup)
- Modify: `styles.css` (`.projects-grid .gallery-tiktok-phone` rules)
- Create: `tests/check-phone-tile.mjs`

**Interfaces:**
- Consumes: `tiktokHTML` in `populateProjects()`, `.gallery-tiktok-phone` selector used by `initTikTokPhoneScroll()`.
- Produces: `.gallery-phone-tile.gallery-tiktok-phone` as first child of `.projects-grid`.

- [ ] **Step 1: Write `tests/check-phone-tile.mjs`**

At each viewport, assert: `.gallery-tiktok-phone` is the first child of `.projects-grid`; it has class `gallery-phone-tile`; it does not have class `project-card`; it still contains `.tiktok-video` elements; its computed padding differs from the card inner padding; its height differs from the first card by at most 24px; document has no horizontal overflow. Print one PASS line.

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node tests/check-phone-tile.mjs`
Expected: FAIL on the `project-card` class and padding assertions.

- [ ] **Step 3: Change the emitted markup in `script.js`**

Replace `class="project-card gallery-tiktok-phone" style="background: transparent;"` with `class="gallery-phone-tile gallery-tiktok-phone"`.

- [ ] **Step 4: Give the tile its own parameters in `styles.css`**

Define `--phone-pad` and `--phone-radius` on `.projects-grid .gallery-phone-tile`, use them for padding and border-radius, keep `height: 100%`, `align-self: stretch`, flex centring, and keep the existing `.iphone-container` aspect-ratio sizing. Do not add `grid-row: span 2`.

- [ ] **Step 5: Run both gallery tests and confirm they pass**

Run: `node tests/check-gallery-cards.mjs && node tests/check-phone-tile.mjs`
Expected: PASS at all three viewports.

- [ ] **Step 6: Commit**

`git add script.js styles.css tests/check-phone-tile.mjs && git commit -m "refactor: give TikTok gallery tile its own sizing"`

### Task 3: Responsive video modals

**Files:**
- Modify: `styles.css` (`.youtube-only-modal`, `.portrait-video.portrait-mobile`)
- Create: `tests/check-video-modals.mjs`

**Interfaces:**
- Consumes: `openYouTubeModal()` producing `#youtube-modal.youtube-only-modal`, `openVideoModal(video)` producing `#video-modal.portrait-video.portrait-mobile`.
- Produces: viewport-fitting iframe geometry.

- [ ] **Step 1: Write `tests/check-video-modals.mjs`**

At 1440×900 and 390×844: trigger `openYouTubeModal` via the first `.video-overlay` click, assert the iframe is at least 60% of viewport width, within viewport bounds, and its width/height ratio is 16:9 ±0.02; close it. Then call `openVideoModal` with the first `videoLinks.videos` entry where `platform === 'tiktok'`, assert the iframe fits the viewport and its width/height ratio is 9:16 ±0.02; close it. Print one PASS line.

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node tests/check-video-modals.mjs`
Expected: FAIL with 300×150 YouTube iframe and a 16:9 portrait iframe.

- [ ] **Step 3: Add YouTube modal sizing to `styles.css`**

For `.youtube-only-modal .video-modal-content`, set `width: min(92vw, 1200px)` and a rounded border. For its `.video-modal-iframe-container`, set `width: 100%` and `aspect-ratio: 16 / 9`. For its `.video-modal-iframe`, absolutely fill the container.

- [ ] **Step 4: Correct the portrait modal formula in `styles.css`**

In `.video-modal.portrait-video.portrait-mobile .video-modal-iframe`, replace the 16:9 `height: 56.25vw` with `height: min(100vh, 177.7778vw)`, `width: auto`, `aspect-ratio: 9 / 16`, `max-width: 100vw`, `max-height: 100vh`.

- [ ] **Step 5: Run the modal test and the whole suite**

Run: `node tests/check-video-modals.mjs` then all nine verification scripts.
Expected: PASS for modal geometry and no regressions.

- [ ] **Step 6: Commit**

`git add styles.css tests/check-video-modals.mjs && git commit -m "fix: scale video modals to viewport"`

### Task 4: Live preview hand-off

**Files:** none

**Interfaces:**
- Consumes: all committed work on `portfolio-fixes`.
- Produces: a localhost URL for the human partner to open.

- [ ] **Step 1: Verify the preview server serves the worktree**

Run `curl -s http://localhost:8000/portfolio-config.js | grep -m1 pageTitle` and confirm the new title is returned.

- [ ] **Step 2: Confirm all nine checks pass**

Run every script in `tests/`. Expected: all PASS.

- [ ] **Step 3: Report the URL**

Report `http://localhost:8000/` and the branch/commit as the live preview.
