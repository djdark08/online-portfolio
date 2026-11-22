# Card Padding and Phone Size Design

## Intent

QA reported that "Teaching Robotics with VEX" and "Network Monitoring Systems" still have a padding problem, and that the TikTok phone should be visibly separate from the cards in size so it reads as a real phone. The prior fix removed the row-height-driven blank band and outward glow, but did not address either of these points.

## What the screenshot and DOM show

- The reference capture is 3440×2310, i.e. a 1720×1155 viewport at 2×. Measuring the live page at that exact viewport reproduces the report on exactly the two named cards: `.tcg-card__inner` is 407px and 441px wide, while the other four cards are 463px; `.tcg-art` follows at 374px/408px versus 430px.
- Cause: `.project-card.tcg-card` is a flex row, so `.tcg-card__inner` is a flex item with auto width. Its height is fixed (card equalisation) and its art has `aspect-ratio: 16/9`; when text wraps, flex shrinking reduces the art's height *and* width, and the shrink-to-fit inner box follows it. That leaves the two cards with 28px/11px extra inset on each side.
- A live DOM probe adding `width: 100%; min-width: 0; box-sizing: border-box` to `.tcg-card__inner` made all six cards identical (463px inner, 430px art).
- The phone is currently capped at a 480px tile, giving a 220×466px mockup — too short to read as a phone. `.projects-grid { grid-auto-rows: 1fr }` also couples every row to the tallest item.

## Approaches considered

1. **Span two rows (chosen).** Make the phone tile span two card rows, drop the 480px cap and card-like tile chrome, and let rows size from content. A DOM probe at 1720px produced a 469×1058px tile holding a 425×900px phone, with 462×505px cards in the other two columns of those rows. Real-phone proportions, no card forced to phone height, and no new markup.
2. **Own showcase section.** Pull the phone out of the grid into a dedicated panel. Cleanest separation but a larger markup/JS restructure than the bug warrants.
3. **Tall single cell.** Keep one grid cell at ~660px. Simplest, but the phone still shares a row with cards and leaves empty space beside it; weak separation.

## Design

- Add an explicit width rule for `.project-card.tcg-card .tcg-card__inner` so it always fills the card's content box; keep the existing 1rem inner padding.
- Change `.projects-grid` to `grid-auto-rows: auto; align-items: start` so rows size from card content instead of the phone. Keep the existing JS card-height equalisation.
- Give `.gallery-phone-tile` `grid-row: span 2`, remove its height cap and card border/background/padding. Keep `.iphone-container` at `aspect-ratio: 425/900`, height filling the tile, capped at 900px and at the column width.
- No config, content, image, or markup changes. Keep the inset hover ring and the existing responsive breakpoints.

## Non-goals

- No push or merge; stay on `portfolio-fixes`.
- No new animations, no redesign of the card theme, no change to project data.

## QA gate

Before any preview, a new browser test must pass at 1720×1155, 1440×900, 820×1180 and 390×844:

- every project card has the same inner and art widths, and the inner fills the card (outer width minus its 3px frame);
- no card has more than 80px of empty space between its tech tags and footer;
- the phone is taller than 1.5× a card, keeps the 425:900 proportion, and its tile spans two rows;
- no horizontal overflow, and no outward colored card glow (hover included).

All ten existing checks must still pass. A screenshot will be captured and inspected by pixel sampling or a vision agent before it is shown.
