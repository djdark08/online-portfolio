import { execFileSync } from 'node:child_process';

const SESSION = 'portfolio-phone-rows';
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
  browser('eval', `window.location.href='${URL}?probe=phone-rows-${width}-${Date.now()}'; 'ok'`);
  pause(700);
  evaluate("document.querySelector('#projects').scrollIntoView({block:'start',behavior:'instant'}); 'ok'");
  pause(350);

  const data = evaluate(`(() => {
    const grid = document.querySelector('.projects-grid');
    const tile = document.querySelector('.gallery-phone-tile');
    const card = document.querySelector('.projects-grid .tcg-card');
    if (!grid || !tile || !card) return null;
    const phone = tile.querySelector('.iphone-container');
    const p = phone.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const cs = getComputedStyle(tile);
    const gs = getComputedStyle(grid);
    return {
      gridRow: cs.gridRow,
      borderTopWidth: parseFloat(cs.borderTopWidth),
      paddingTop: parseFloat(cs.paddingTop),
      background: cs.backgroundColor,
      gridAutoRows: gs.gridAutoRows,
      alignItems: gs.alignItems,
      phoneW: Math.round(p.width),
      phoneH: Math.round(p.height),
      cardH: Math.round(c.height),
      overflow: document.documentElement.scrollWidth - innerWidth
    };
  })()`);

  if (!data) {
    failures.push(`${width}px: phone tile, card or grid missing`);
    continue;
  }
  if (!String(data.gridRow).includes('span 2')) failures.push(`${width}px: phone tile grid-row ${data.gridRow}, expected span 2`);
  if (data.borderTopWidth !== 0) failures.push(`${width}px: phone tile border ${data.borderTopWidth}px, expected none`);
  if (data.paddingTop !== 0) failures.push(`${width}px: phone tile padding ${data.paddingTop}px, expected none`);
  if (data.background !== 'rgba(0, 0, 0, 0)' && data.background !== 'transparent') failures.push(`${width}px: phone tile background ${data.background}, expected none`);
  if (data.gridAutoRows !== 'auto') failures.push(`${width}px: gridAutoRows ${data.gridAutoRows}, expected auto`);
  if (data.alignItems !== 'start') failures.push(`${width}px: alignItems ${data.alignItems}, expected start`);
  if (data.phoneH > 900) failures.push(`${width}px: phone height ${data.phoneH}px exceeds 900px cap`);
  if (Math.abs(data.phoneW / data.phoneH - 425 / 900) > 0.03) failures.push(`${width}px: phone ratio ${data.phoneW}x${data.phoneH} is not 425:900`);
  const minRatio = (width >= 1440) ? 1.5 : 1;
  if (data.phoneH <= data.cardH * minRatio) failures.push(`${width}px: phone ${data.phoneH}px is not taller than ${minRatio}x card ${data.cardH}px`);
  if (data.overflow > 1) failures.push(`${width}px: horizontal overflow ${data.overflow}px`);
}

if (failures.length) {
  console.error('FAIL:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('PASS: phone spans two rows at real-phone size at 1720/1440/820/390');
