import { execFileSync } from 'node:child_process';

const SESSION = 'portfolio-fix';
const URL = 'http://localhost:8000/';
const failures = [];

function browser(...args) {
  return execFileSync('agent-browser', [...args, '--session', SESSION], { encoding: 'utf8' });
}

function evaluate(expression) {
  const raw = browser('eval', expression).trim();
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return raw;
  }
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
}

function pause(ms) {
  execFileSync('sleep', [String(ms / 1000)]);
}

for (const [width, height] of [[1440, 900], [820, 1180], [390, 844]]) {
  browser('set', 'viewport', String(width), String(height));
  browser('eval', `window.location.href='${URL}?probe=cards-${width}-${Date.now()}'; 'ok'`);
  pause(600);
  evaluate("[...document.querySelectorAll('link[rel=stylesheet]')].forEach(l => { l.href = l.href.split('?')[0] + '?cb=' + Date.now(); }); 'ok'");
  pause(400);

  evaluate("document.querySelector('#projects').scrollIntoView({block:'start',behavior:'instant'}); 'ok'");
  pause(350);

  const data = evaluate(`(() => {
    const cards = [...document.querySelectorAll('.projects-grid .project-card.tcg-card')];
    const heights = [];
    const issues = [];
    for (const card of cards) {
      const inner = card.querySelector('.tcg-card__inner');
      const energy = card.querySelector('.tcg-energy');
      const tags = energy ? [...energy.querySelectorAll('.tech-tag')] : [];
      for (const tag of tags) heights.push(Math.round(tag.getBoundingClientRect().height));
      if (energy && energy.scrollHeight > energy.clientHeight + 2) {
        issues.push('clipped tags: ' + energy.scrollHeight + '>' + energy.clientHeight);
      }
      if (inner) {
        const p = getComputedStyle(inner);
        const sides = [p.paddingTop, p.paddingRight, p.paddingBottom, p.paddingLeft];
        if (new Set(sides).size !== 1) issues.push('uneven padding: ' + sides.join('/'));
      }
      if (card.scrollWidth > card.clientWidth + 1) issues.push('card overflows horizontally');
    }
    return {
      cards: cards.length,
      minTag: heights.length ? Math.min(...heights) : null,
      maxTag: heights.length ? Math.max(...heights) : null,
      issues,
      overflow: document.documentElement.scrollWidth - innerWidth
    };
  })()`);

  if (!data || data.cards === 0) {
    failures.push(`${width}px: no project cards found`);
    continue;
  }
  if (data.minTag === null) failures.push(`${width}px: no tech bubbles found`);
  else if (data.maxTag - data.minTag > 2) {
    failures.push(`${width}px: tech bubble heights vary ${data.minTag}-${data.maxTag}px`);
  }
  for (const issue of data.issues) failures.push(`${width}px: ${issue}`);
  if (data.overflow > 1) failures.push(`${width}px: horizontal overflow ${data.overflow}px`);
}

if (failures.length) {
  console.error('FAIL:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('PASS: uniform tech bubbles, even padding, no clipping or overflow at 1440/820/390');
