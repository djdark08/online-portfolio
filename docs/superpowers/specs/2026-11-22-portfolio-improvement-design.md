# Portfolio improvement — design (scope B)

Date: 2026-11-22
Site: https://lloydagonia.is-a.dev/
Repo: https://github.com/djdark08/online-portfolio (GitHub Pages)

## Intent and why

The portfolio is for **both job applications and freelance clients**. Right now it has a
distinctive look but several defects that cost credibility: dead project links, a broken
gallery grid, a nav highlight that lags one section behind, no favicon, no résumé download,
no share preview, and four referees' personal contact details published publicly.

Goal of this pass: make the site work correctly, protect third-party privacy, and make it
look professional when a recruiter or client pastes the link into LinkedIn, Messenger, or
an email. Deliberately **out of scope**: rewriting the visual theme or the career narrative
(that is the later D pass).

## Goals

1. Fix the six functional defects found in the live browser audit.
2. Remove referees' phone numbers and email addresses; keep their names, titles and portraits.
3. Give the site a proper share card and basic structured metadata.
4. Give visitors a working path to the résumé and to a real contact action.
5. Make the page degrade gracefully when JS does not run (crawlers, link preview bots).

## Non-goals

- No redesign of the Pokémon/TCG card theme.
- No image compression pass or axe-contrast remediation (scope C).
- No rewriting of About/Experience/Projects copy (scope D).
- No changes to the theme switcher or motion toggle beyond what the fixes require.

## Constraints and decisions already made

- **Source of truth:** the deployed site matches `origin/main`, not the local working
  tree. The local clone is ~2,845 lines behind and has an uncommitted `styles.css`
  change. Implementation will happen in a **new git worktree from `origin/main`**; the
  existing clone and its uncommitted change are left untouched.
- **Referees:** keep name, title, relationship and portrait; remove email and phone from
  `portfolio-config.js` and stop rendering those rows. Add a short "References available
  on request" note. Note: three of the four published emails are placeholder
  (`@university.edu`) anyway, so nothing of value is lost.
- **Résumé:** publish the existing `~/Documents/LloydAgonia_Resume.pdf` as
  `LloydAgonia_Resume.pdf` in the site root, with a download button in the hero and a
  link in Contacts. (Assumption: this PDF is current and approved for public download —
  flag before publishing if not.)
- **Project links:** no public repo/demo URLs were supplied. Default call: replace the
  dead `OPEN ↗` anchors with a working **in-page detail view** (full image, description,
  tech stack) so the click does something honest. If real GitHub/demo URLs are provided
  before implementation, use those instead and link directly.
- **Favicon / share image:** generate a small SVG favicon from the existing site identity
  and downscale the existing `images/profile.jpg` into `og-image.jpg` with `sips`.
  No new portrait or AI-generated imagery.
- Deployment remains GitHub Pages from `origin/main`; changes are committed to a branch
  and the user decides when to push/deploy.

## Approaches considered

**1. Patch the live files in place (rejected).** The local clone is stale and dirty;
editing it would either overwrite the user's uncommitted CSS or deploy old code.

**2. Fresh worktree from `origin/main` (chosen).** Clean base matching what is live,
reviewable diff, zero risk to existing work.

**3. Full pre-render/build step (deferred to a later pass).** Would solve the
JS-dependency problem completely but adds a build pipeline to a static Pages site.
For this pass a small static fallback is sufficient and much cheaper.

## Specific changes

### `index.html`
- Add `<meta name="description">` with a concrete one-sentence pitch covering both
  robotics and freelance-facing skills.
- Add Open Graph + Twitter card tags (`og:title`, `og:description`, `og:type`,
  `og:url`, `og:image`, `twitter:card`, `twitter:image`), a canonical link, and a
  theme-color meta.
- Add `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` and a PNG fallback.
- Add a compact static fallback: a `<noscript>` block with name, role, summary,
  skills, experience highlights, project names and contact links, plus a short
  visually-hidden crawlable summary for JS-enabled crawlers. Keep it factual and brief;
  add a comment that it must stay in sync with `portfolio-config.js`.
- Promote the name/role line to `<h1>`; demote "Hello." to a styled `<p>` so the visual
  design is unchanged. Keep the existing class-based CSS working.
- Ensure the og:url matches the live domain: `https://lloydagonia.is-a.dev/`.

### `script.js`
- `initSmoothScrolling`: compute section positions from
  `getBoundingClientRect().top + window.scrollY` instead of `offsetTop`, and use a probe
  just below the sticky navbar. Fixes the one-section-behind highlight. Re-run on resize.
- Gallery: remove the conflicting `grid-row: span 2` / `height: auto` vs `height: 100%`
  rules for `.gallery-tiktok-phone` so the phone tile matches the equalized card height
  instead of forcing 892px. Verify at 1440px, 820px and 390px.
- `populateReferences`: stop rendering the email and phone rows; render only the
  relationship/title already present. Add a "References available on request" line.
- Replace the six `href="#projects"` project links with working detail actions.
- Make the iframe titles / names on the TikTok embeds non-empty (cheap part of the a11y
  fix; the rest stays in scope C).
- Keep all existing animation/motion behaviour.

### `portfolio-config.js`
- Remove `email` and `phone` fields from all four reference entries.
- Rename section title "Character References" → "References".
- Add résumé URL and a detail-link flag for projects if needed by the implementation.

### `styles.css`
- Minimal edits only: gallery phone tile height/span, `<h1>`/`.hero-greeting` tag swap,
  résumé button, reference note, noscript fallback styling. No theme changes.

### New files
- `favicon.svg` (+ `favicon.ico` fallback), `robots.txt`, `sitemap.xml`, `og-image.jpg`,
  and the résumé PDF copy.

## Verification before hand-off

- Browser at 1440×900, 820×1180, 390×844: gallery grid aligned, nav highlight matches
  visible section, no console errors, résumé and project detail actions work.
- `curl` the live-equivalent local server: meta/OG tags present, favicon/robots/sitemap
  and PDF return 200.
- axe re-run to confirm no new violations were introduced.
- `git diff --stat` in the worktree reviewed; no changes to the user's original clone.

## What is left to the builder

- Exact copy for the meta description and the fallback summary (keep it factual).
- Choice of SVG favicon design from existing identity assets.
- Whether real project repo URLs exist; use them if supplied, otherwise the detail view.
