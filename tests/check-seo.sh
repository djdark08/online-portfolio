#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")/.."

html=$(curl -s http://localhost:8000/)
fail=0

for needle in \
  '<meta name="description"' \
  'property="og:title"' \
  'property="og:description"' \
  'property="og:image"' \
  'property="og:url" content="https://lloydagonia.is-a.dev/"' \
  'name="twitter:card"' \
  'rel="canonical"' \
  'rel="icon"' \
  'application/ld+json' \
  '<noscript>' \
  'Download résumé'; do
  if printf '%s' "$html" | grep -qF "$needle"; then
    echo "PASS: found $needle"
  else
    echo "FAIL: missing $needle"
    fail=1
  fi
done

if printf '%s' "$html" | grep -A3 -F '<h1 class="hero-title">' | grep -qF 'Lloyd'; then
  echo "PASS: h1 contains the name"
else
  echo "FAIL: h1 does not contain the name"
  fail=1
fi

for asset in robots.txt sitemap.xml og-image.jpg; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:8000/$asset")
  if [ "$code" = "200" ]; then
    echo "PASS: /$asset returned 200"
  else
    echo "FAIL: /$asset returned $code"
    fail=1
  fi
done

if curl -s http://localhost:8000/robots.txt | grep -qF 'Sitemap: https://lloydagonia.is-a.dev/sitemap.xml'; then
  echo "PASS: robots.txt declares the sitemap"
else
  echo "FAIL: robots.txt missing sitemap directive"
  fail=1
fi

if printf '%s' "$html" | grep -qF 'Lloyd Enterina Agonia' && printf '%s' "$html" | grep -qF 'VoIP PBX and Network Server Setup'; then
  echo "PASS: static fallback has name and a project"
else
  echo "FAIL: static fallback lacks name or project"
  fail=1
fi

exit "$fail"
