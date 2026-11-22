# Card Padding and Phone Size Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every project card use the full card width, and present the TikTok phone as a full-size, two-row-spanning mockup separate from the cards.

**Architecture:** CSS-only changes in `styles.css`: give the card inner an explicit width so flex shrinking cannot narrow it, and decouple grid rows from the phone so the tile can span two rows at a real-phone 425:900 aspect. Two new browser tests pin the geometry before any preview is shown.

**Tech Stack:** static HTML/CSS/JS portfolio, `agent-browser` CLI for browser assertions, Node `.mjs` test scripts.

**Spec:** `docs/superpowers/specs/2026-11-22-card-padding-and-phone-size-design.md`

## Global Constraints

- Reference capture is 3440×2310 = 1720×1155 viewport at 2×; reproduce measurements at 1720×1155.
- Card frame is 3px; `.tcg-card__inner` padding stays 1rem; art aspect ratio stays 16/9.
- Phone mockup aspect ratio 425/900, maximum height 900px, never wider than its grid column.
- Empty band between tech tags and footer must stay at most 80px.
- No markup, config, content, image, animation, or theme changes. Keep the inset hover ring.
- No push or merge; work stays on `portfolio-fixes`.
- All ten existing checks in `tests/` must keep passing.

## Review Focus

1. Narrow single-column viewport (390px): card inner still fills, phone stays inside the column, no horizontal overflow — pinned in Tasks 1 and 2.
2. Tablet breakpoint (820px): two-column grid with a two-row phone span must not stretch cards — pinned in Tasks 1 and 2.
3. Long titles/descriptions on "Teaching Robotics with VEX" and "Network Monitoring Systems": their inner and art widths must equal every other card — pinned in Task 1.
4. Mixed source image sizes (690×388 landscape and 690×920 portrait): art width must not follow the natural image dimensions — pinned in Task 1 by comparing all six art widths.
5. Hover state: no outward colored glow may return when the grid rules change — pinned in Task 2 by re-running `tests/check-gallery-spacing.mjs`.

---

### Task 1: Make card content fill the card width

**Files:**
- Modify: `styles.css:4412-4414` (existing `.project-card .tcg-card__inner { height: 100%; }` rule)
- Test: `tests/check-card-padding.mjs` (new)

**Interfaces:**
- Consumes: `.projects-grid .tcg-card`, `.tcg-card__inner`, `.tcg-art` (existing DOM from `populateProjectsWithTikTok`).
- Produces: uniform `.tcg-card__inner` offset width equal to card offset width minus 6px; uniform `.tcg-art` offset width. Task 2 relies on these widths to measure card height independently of the phone.

- [ ] **Step 1: Write the failing test**

Create `tests/check-card-padding.mjs` following the pattern in `tests/check-gallery-spacing.mjs` (own `agent-browser` session, `set viewport`, navigate to `http://localhost:8000/`, wait for gallery cards, `eval` returning JSON). At viewports 1720×1155, 1440×900, 820×1180 and 390×844, assert for every `.projects-grid .tcg-card`:

```js
const innerW = card.querySelector('.tcg-card__inner').offsetWidth;
const artW = card.querySelector('.tcg-art').offsetWidth;
// expected: innerW === card.offsetWidth - 6 (±1px)
// expected: every artW equal to the first artW (±1px)
// expected: no horizontal overflow (documentElement.scrollWidth - innerWidth <= 1)
```

Fail with the per-card name, card width, inner width and art width in the message. Include the named cards "Teaching Robotics with VEX" and "Network Monitoring Systems" in the failure output so the original report is traceable.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tests/check-card-padding.mjs`
Expected: FAIL at 1720×1155 with inner widths 407 and 441 instead of 463, and art widths 374 and 408 instead of 430.

- [ ] **Step 3: Implement the width rule**

In `styles.css`, extend the existing `.project-card .tcg-card__inner` rule with `width: 100%; min-width: 0; box-sizing: border-box;`. Do not change `.tcg-art`, the card padding, or the JS equalisation.

- [ ] **Step 4: Run the test and the full suite**

Run: `node tests/check-card-padding.mjs` → PASS.
Run: all files in `tests/` (`*.mjs` with `node`, `*.sh` with `bash`) → all PASS.

- [ ] **Step 5: Commit**

```bash
git add styles.css tests/check-card-padding.mjs
git commit -m "fix: make project card content fill card width"
```

### Task 2: Let the phone span two rows at real-phone size

**Files:**
- Modify: `styles.css:4402-4405` (`.projects-grid` row rules), `styles.css:4538-4557` (`.gallery-phone-tile`), `styles.css:4559-4572` (`.projects-grid .gallery-tiktok-phone .iphone-container`)
- Test: `tests/check-phone-two-rows.mjs` (new)

**Interfaces:**
- Consumes: `.projects-grid`, `.gallery-phone-tile`, `.iphone-container` from `populateProjectsWithTikTok`; uniform card widths from Task 1.
- Produces: phone tile spanning two grid rows with no card chrome; phone height > 1.5× card height at desktop, aspect ratio 425:900 capped at 900px. Task 3 measures this geometry.

- [ ] **Step 1: Write the failing test**

Create `tests/check-phone-two-rows.mjs` using the same browser harness. At 1720×1155 and 1440×900 assert:

```js
// computed style on .gallery-phone-tile
getComputedStyle(tile).gridRowEnd.includes('span 2') === true
getComputedStyle(tile).borderTopWidth === '0px'
getComputedStyle(grid).gridAutoRows === 'auto'
getComputedStyle(grid).alignItems === 'start'
// geometry
phoneH / cardH > 1.5
Math.abs(phoneW / phoneH - 425 / 900) < 0.03
phoneH <= 900
documentElement.scrollWidth - innerWidth <= 1
```

At 820×1180 and 390×844 assert only the span, no chrome, aspect ratio, no overflow, and `phoneH > cardH` (single-column fallback may be shorter than 1.5×).

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tests/check-phone-two-rows.mjs`
Expected: FAIL — `gridRowEnd` is `auto`, tile border is `1px`, `gridAutoRows` is `1fr`, and phone height 466px is not more than 1.5× card height.

- [ ] **Step 3: Implement the grid and phone rules**

In `styles.css`:
- change `.projects-grid` from `grid-auto-rows: 1fr; align-items: stretch` to `grid-auto-rows: auto; align-items: start`;
- on `.projects-grid .gallery-phone-tile`, set `grid-row: span 2`, remove `max-height`, set `padding: 0; border: 0; background: none` while keeping the centred flex layout;
- on `.projects-grid .gallery-tiktok-phone .iphone-container`, keep `aspect-ratio: 425/900`, `max-width: 100%`, `max-height: 900px`, `height: 100%`, and the existing softened shadow.

Do not change the JavaScript card-height equalisation or the markup.

- [ ] **Step 4: Run the tests**

Run: `node tests/check-phone-two-rows.mjs` → PASS.
Run: `node tests/check-card-padding.mjs`, `node tests/check-gallery-spacing.mjs`, then the full suite → all PASS.

- [ ] **Step 5: Commit**

```bash
git add styles.css tests/check-phone-two-rows.mjs
git commit -m "fix: size the TikTok phone as a two-row mockup"
```

### Task 3: QA gate before preview

**Files:**
- No source changes; screenshots are written to `~/Downloads/gallery-final-1720.png` and `~/Downloads/gallery-final-1440.png`.

**Interfaces:**
- Consumes: the passing tests from Tasks 1 and 2.

- [ ] **Step 1: Run every check from a clean browser**

Run: `agent-browser close --all`, then every file in `tests/` as in Task 1 Step 4.
Expected: all twelve checks PASS with no failures.

- [ ] **Step 2: Capture screenshots and inspect pixels**

Using an isolated `agent-browser` session at 1720×1155 and 1440×900, scroll to `.projects-grid` and capture the two screenshots. Inspect with `magick ... -format '%[pixel:p{x,y}]' info:` at card and phone edges to confirm no colored bleed outside borders and that the phone frame is present. If a vision-capable agent is available, compare against `qa2.png`; otherwise report that direct image reading was unavailable and rely on the DOM assertions plus pixel sampling.

- [ ] **Step 3: Hand off for preview**

Only after Step 1 and Step 2 pass, report the commit list, the QA results, and the screenshot paths. Do not show a preview before this point.

## Self-Review

Spec coverage: intent and root cause → Task 1; explicit inner width → Task 1 Step 3; row decoupling and two-row span → Task 2 Step 3; real-phone aspect/cap → Task 2 test; no markup/config changes → Global Constraints; QA gate and no preview before QA → Task 3. No gaps found. Steps each name one file, one rule or one assertion set; no undecided placeholders. Names and selectors match the existing DOM and CSS. Review Focus items 1–5 are pinned in Tasks 1, 2 and the re-run of `check-gallery-spacing.mjs`. Plan length is proportionate to the four CSS rules and two tests it describes.
