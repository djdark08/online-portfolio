import { execFileSync } from 'node:child_process';

const SESSION = 'portfolio-fix';
const URL = 'http://localhost:8000/';
const failures = [];

// Start from a clean browser profile so stale CSS/JS cannot hide a regression.
execFileSync('agent-browser', ['close', '--all'], { stdio: 'ignore' });

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

function coloredShadows() {
  return evaluate(`(() => {
    const cards = [...document.querySelectorAll('.projects-grid .tcg-card')];
    const bad = [];
    cards.forEach((card, i) => {
      const shadows = getComputedStyle(card).boxShadow;
      for (const m of shadows.matchAll(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/g)) {
        const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
        if (r !== g || g !== b) {
          bad.push('card ' + i + ': ' + shadows.slice(0, 110));
          break;
        }
      }
    });
    return bad;
  })()`);
}

for (const [width, height] of [[1440, 900], [820, 1180], [390, 844]]) {
  browser('set', 'viewport', String(width), String(height));
  browser('eval', `window.location.href='${URL}?probe=spacing-${width}-${Date.now()}'; 'ok'`);
  pause(600);
  evaluate("document.querySelector('#projects').scrollIntoView({block:'start',behavior:'instant'}); 'ok'");
  pause(350);

  const data = evaluate(`(() => {
    const cards = [...document.querySelectorAll('.projects-grid .tcg-card')];
    const tile = document.querySelector('.gallery-phone-tile');
    const gaps = cards.map(card => {
      const e = card.querySelector('.tcg-energy');
      const f = card.querySelector('.tcg-foot');
      return Math.round(f.getBoundingClientRect().top - e.getBoundingClientRect().bottom);
    });
    return {
      cards: cards.length,
      maxGap: Math.max(...gaps),
      minGap: Math.min(...gaps),
      cardH: Math.round(cards[0].getBoundingClientRect().height),
      tileH: tile ? Math.round(tile.getBoundingClientRect().height) : null,
      overflow: document.documentElement.scrollWidth - innerWidth
    };
  })()`);

  if (!data || data.cards === 0) {
    failures.push(`${width}px: no gallery cards found`);
    continue;
  }
  if (data.maxGap > 40) failures.push(`${width}px: empty band ${data.maxGap}px between tags and footer`);
  if (data.cardH > 560) failures.push(`${width}px: card height ${data.cardH}px`);
  if (data.tileH === null || data.tileH > 520) failures.push(`${width}px: phone tile height ${data.tileH}px`);
  if (data.overflow > 1) failures.push(`${width}px: horizontal overflow ${data.overflow}px`);

  for (const bad of coloredShadows()) failures.push(`${width}px: colored glow ${bad}`);
  browser('hover', '.projects-grid .tcg-card');
  pause(250);
  for (const bad of coloredShadows()) failures.push(`${width}px: colored glow on hover ${bad}`);
}

if (failures.length) {
  console.error('FAIL:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('PASS: tight card spacing, contained phone tile, no colored glow at 1440/820/390');
