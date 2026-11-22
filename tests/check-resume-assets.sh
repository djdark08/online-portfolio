#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")/.."

fail=0

for asset in LloydAgonia_Resume.pdf favicon.svg favicon.ico; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:8000/$asset")
  if [ "$code" != "200" ]; then
    echo "FAIL: /$asset returned $code"
    fail=1
  else
    echo "PASS: /$asset returned 200"
  fi
done

agent-browser open http://localhost:8000/ --session portfolio-fix >/dev/null 2>&1
sleep 1
links=$(agent-browser eval "[...document.querySelectorAll('.resume-download')].map(a => a.getAttribute('href'))" --session portfolio-fix 2>/dev/null)
count=$(agent-browser eval "document.querySelectorAll('.resume-download').length" --session portfolio-fix 2>/dev/null | tail -1)
if [ "$count" != "2" ]; then
  echo "FAIL: expected 2 resume links, got $count"
  fail=1
elif ! printf '%s' "$links" | grep -q '/LloydAgonia_Resume.pdf'; then
  echo "FAIL: resume links do not point at the PDF: $links"
  fail=1
else
  echo "PASS: two resume links point at /LloydAgonia_Resume.pdf"
fi

exit "$fail"
