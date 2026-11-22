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

const sections = ['home', 'about', 'technical-skills', 'experience', 'projects', 'references', 'contacts'];

for (const [width, height] of [[1440, 900], [820, 1180], [390, 844]]) {
  browser('set', 'viewport', String(width), String(height));
  browser('eval', `window.location.href='${URL}'; 'ok'`);
  pause(600);

  evaluate("document.querySelector('#projects').scrollIntoView({block:'start',behavior:'instant'}); 'ok'");
  pause(300);

  const geometry = evaluate(`(() => {
    const phone = document.querySelector('.gallery-tiktok-phone');
    const card = document.querySelector('.projects-grid .tcg-card');
    return {
      phone: phone ? Math.round(phone.getBoundingClientRect().height) : null,
      card: card ? Math.round(card.getBoundingClientRect().height) : null,
      overflow: document.documentElement.scrollWidth - innerWidth
    };
  })()`);

  if (geometry.phone === null || geometry.card === null) {
    failures.push(`${width}px: gallery cards missing`);
  } else if (Math.abs(geometry.phone - geometry.card) > 24) {
    failures.push(`${width}px: phone tile ${geometry.phone}px vs card ${geometry.card}px`);
  }
  if (geometry.overflow > 1) {
    failures.push(`${width}px: horizontal overflow ${geometry.overflow}px`);
  }

  for (const id of sections) {
    evaluate(`document.querySelector('#${id}').scrollIntoView({block:'start',behavior:'instant'}); 'ok'`);
    pause(220);
    const active = evaluate("document.querySelector('.nav-link.active')?.getAttribute('href') || null");
    if (active !== `#${id}`) {
      failures.push(`${width}px: section #${id} highlighted ${active}`);
    }
  }
}

if (failures.length) {
  console.error('FAIL:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('PASS: gallery geometry, no overflow, and nav highlight at 1440/820/390');
