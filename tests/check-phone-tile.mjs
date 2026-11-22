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

for (const [width, height] of [[1440, 900], [820, 1180], [390, 844]]) {
  browser('set', 'viewport', String(width), String(height));
  browser('eval', `window.location.href='${URL}?probe=phone-${width}-${Date.now()}'; 'ok'`);
  pause(600);
  evaluate("[...document.querySelectorAll('link[rel=stylesheet]')].forEach(l => { l.href = l.href.split('?')[0] + '?cb=' + Date.now(); }); 'ok'");
  pause(400);

  evaluate("document.querySelector('#projects').scrollIntoView({block:'start',behavior:'instant'}); 'ok'");
  pause(350);

  const data = evaluate(`(() => {
    const grid = document.querySelector('.projects-grid');
    const tile = grid?.firstElementChild;
    const card = grid?.querySelector('.tcg-card');
    if (!tile || !card) return null;
    const cs = getComputedStyle(tile);
    const box = tile.querySelector('.iphone-container');
    const iframe = tile.querySelector('.tiktok-video');
    return {
      isFirst: tile.classList.contains('gallery-tiktok-phone'),
      dedicated: tile.classList.contains('gallery-phone-tile'),
      isCard: tile.classList.contains('project-card'),
      hasVideo: !!iframe,
      padding: parseFloat(cs.paddingTop),
      radius: parseFloat(cs.borderTopLeftRadius),
      tileH: Math.round(tile.getBoundingClientRect().height),
      cardH: Math.round(card.getBoundingClientRect().height),
      boxFits: box ? box.getBoundingClientRect().height <= tile.getBoundingClientRect().height + 1 : false,
      overflow: document.documentElement.scrollWidth - innerWidth
    };
  })()`);

  if (!data) {
    failures.push(`${width}px: phone tile or card missing`);
    continue;
  }
  if (!data.isFirst) failures.push(`${width}px: phone tile is not the first gallery item`);
  if (!data.dedicated) failures.push(`${width}px: phone tile lacks its dedicated class`);
  if (data.isCard) failures.push(`${width}px: phone tile still inherits .project-card sizing`);
  if (!data.hasVideo) failures.push(`${width}px: TikTok videos missing from phone tile`);
  if (data.padding < 4) failures.push(`${width}px: phone tile has no inner padding (${data.padding}px)`);
  if (Math.abs(data.tileH - data.cardH) > 24) {
    failures.push(`${width}px: phone tile ${data.tileH}px vs card ${data.cardH}px`);
  }
  if (!data.boxFits) failures.push(`${width}px: phone frame overflows its tile`);
  if (data.overflow > 1) failures.push(`${width}px: horizontal overflow ${data.overflow}px`);
}

if (failures.length) {
  console.error('FAIL:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('PASS: dedicated padded phone tile aligned with cards at 1440/820/390');
