import { execFileSync } from 'node:child_process';

const SESSION = 'portfolio-padding';
const URL = 'http://localhost:8000/';
const failures = [];

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

for (const [width, height] of [[1720, 1155], [1440, 900], [820, 1180], [390, 844]]) {
  browser('set', 'viewport', String(width), String(height));
  browser('eval', `window.location.href='${URL}?probe=padding-${width}-${Date.now()}'; 'ok'`);
  pause(700);
  evaluate("document.querySelector('#projects').scrollIntoView({block:'start',behavior:'instant'}); 'ok'");
  pause(350);

  const data = evaluate(`(() => {
    const cards = [...document.querySelectorAll('.projects-grid .tcg-card')];
    return {
      cards: cards.map(card => ({
        name: card.querySelector('.tcg-name')?.textContent.trim() || '(unnamed)',
        card: card.offsetWidth,
        inner: card.querySelector('.tcg-card__inner').offsetWidth,
        art: card.querySelector('.tcg-art').offsetWidth
      })),
      overflow: document.documentElement.scrollWidth - innerWidth
    };
  })()`);

  if (!data || !Array.isArray(data.cards) || data.cards.length === 0) {
    failures.push(`${width}px: no gallery cards found`);
    continue;
  }
  if (data.overflow > 1) failures.push(`${width}px: horizontal overflow ${data.overflow}px`);

  const firstArt = data.cards[0].art;
  for (const card of data.cards) {
    const expectedInner = card.card - 6;
    if (Math.abs(card.inner - expectedInner) > 1) {
      failures.push(`${width}px: ${card.name} inner ${card.inner}px, expected ${expectedInner}px (card ${card.card}px, art ${card.art}px)`);
    }
    if (Math.abs(card.art - firstArt) > 1) {
      failures.push(`${width}px: ${card.name} art ${card.art}px, expected ${firstArt}px across all cards`);
    }
  }
}

if (failures.length) {
  console.error('FAIL:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('PASS: every card fills its width at 1720/1440/820/390 — including Teaching Robotics with VEX and Network Monitoring Systems');
