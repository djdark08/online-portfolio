# Gallery Cards, Phone Tile and Video Modal Design

## Intent

The gallery's project cards have uneven internal spacing: their tech "bubble" tags stretch to the full height of a fixed-height container on cards with few tags, while cards with many tags keep short bubbles and have their last row clipped. The TikTok phone tile borrows the project-card class and therefore inherits card sizing without any card padding, so it looks inconsistent. The Videos tab modal shows YouTube at the browser's default 300×150 iframe size and shows portrait TikTok videos in a landscape 16:9 frame.

## Goals

- Every tech bubble in a project card has the same height, wraps naturally, and is never clipped.
- Inner padding on all project cards is identical and content does not overflow the card.
- The TikTok phone is a dedicated tile inside the same `.projects-grid`, with its own class and sizing parameters, while remaining aligned with the card row.
- The YouTube modal video scales with the viewport at 16:9; the TikTok portrait modal scales with the viewport at 9:16.

## Non-goals

- No project, video or résumé content changes.
- No TCG theme redesign, new animation, or third-party embed behaviour changes.
- No deployment or branch merge/push; this work continues on `portfolio-fixes`.

## Constraints

- Static site: `index.html`, `styles.css`, `script.js`, `portfolio-config.js`, no build step or dependencies.
- Existing browser checks in `tests/` must keep passing.
- Local preview continues to be served from the worktree on `http://localhost:8000/`.

## Decisions

- Phone tile: keep the `gallery-tiktok-phone` class used by `initTikTokPhoneScroll()`, remove `project-card`, add `gallery-phone-tile`, and give it its own `--phone-pad` / `--phone-radius` parameters. It keeps the same row height as the cards so the gallery has no empty holes; its frame, padding and aspect ratio are its own.
- Card spacing: replace the fixed `.tcg-energy` height with a minimum height, stop flex stretching the bubbles, and stop clipping overflow. Keep the existing equal card heights from `grid-auto-rows: 1fr`.
- Video modals: CSS-only sizing. YouTube uses a 16:9 aspect-ratio container; portrait TikTok uses a true 9:16 iframe sized to fit the viewport.
