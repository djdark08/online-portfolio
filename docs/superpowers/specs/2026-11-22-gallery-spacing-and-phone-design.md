# Gallery Spacing and Phone Presentation Design

## Intent

A QA screenshot showed cards whose content stops near the middle while the footer sits at the bottom, leaving a large empty band that reads as broken padding. It also showed a lavender box-shadow radiating outside every card into the gutters. The TikTok phone tile should read as part of the same gallery rather than a foreign object.

## Root cause found

- The first grid item is the TikTok phone tile. Its mockup has a tall intrinsic height (`min(102vh, 900px)` with a 425:900 aspect ratio), so `grid-auto-rows: 1fr` sizes every row to the phone. The cards stretch to that height while their content stays near the top; `.tcg-foot` is pinned to the bottom with `margin-top: auto`, leaving roughly 200px of dead space.
- `.tcg-card[data-reveal]:hover` applies `0 0 30px -4px var(--type-glow)`, an outward colored shadow. Psychic cards use lavender, so the glow bleeds into the gutters.

## Decisions

- Cap the phone tile with `--phone-max-h: 480px` so grid rows size from card content. Cards land near 480px with a ~17px gap between the tech tags and the footer.
- Keep equal card heights and the existing 1rem inner padding; do not change card content or images.
- Replace the outward hover glow with an inset 1px accent ring so the accent never leaves the card border.
- Keep the phone tile's card-like border/background/radius, soften its heavy black drop shadow, and add a subtle accent rim so the mockup sits in the tile instead of floating over it.
- No content, config, or layout structure changes beyond the tile's CSS variables.

## Non-goals

- No push or merge; work stays on `portfolio-fixes` until the human partner approves.
- No redesign of the TCG theme, no new animations, no image cropping changes.

## Verification

A new browser test measures the gap between the tech-tag row and footer, card/tile heights, and card shadow colors at 1440x900, 820x1180 and 390x844. All nine existing checks must keep passing.
