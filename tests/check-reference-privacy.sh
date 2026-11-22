#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")/.."

fail=0

node - <<'NODE' || fail=1
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('portfolio-config.js', 'utf8');
const sandbox = { window: {}, module: { exports: {} }, console };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const config = sandbox.module.exports;
const bad = config.references.list.filter(r => 'email' in r || 'phone' in r);
if (bad.length) {
  console.error('FAIL: contact keys remain for ' + bad.map(r => r.name).join(', '));
  process.exit(1);
}
if (config.references.title !== 'References') {
  console.error('FAIL: section title is "' + config.references.title + '", expected "References"');
  process.exit(1);
}
console.log('PASS: config has no referee contact keys and title is "References"');
NODE

agent-browser reload --session portfolio-fix >/dev/null 2>&1
agent-browser eval "document.querySelector('#references')?.scrollIntoView({behavior:'instant'}); 'ok'" --session portfolio-fix >/dev/null 2>&1
dom=$(agent-browser eval "document.querySelector('#references-grid')?.innerText || ''" --session portfolio-fix 2>/dev/null | tail -1)
if printf '%s' "$dom" | grep -Eq '[0-9]{10,}|@'; then
  echo "FAIL: rendered references still contain phone/email data: $dom"
  fail=1
else
  echo "PASS: rendered references contain no phone/email data"
fi
if ! printf '%s' "$dom" | grep -q 'References available on request'; then
  echo "FAIL: missing 'References available on request' note"
  fail=1
else
  echo "PASS: references note present"
fi

exit "$fail"
