import { execFileSync } from 'node:child_process';

const SESSION = 'portfolio-fix';
const PAGE = `http://localhost:8000/?t=${Date.now()}`;
const failures = [];

function browser(...args) {
  return execFileSync('agent-browser', [...args, '--session', SESSION], { encoding: 'utf8' });
}

function evaluate(expression) {
  const raw = browser('eval', expression).trim();
  let value;
  try { value = JSON.parse(raw); } catch { return raw; }
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
}

function pause(ms) {
  execFileSync('sleep', [String(ms / 1000)]);
}

browser('set', 'viewport', '1440', '900');
browser('eval', `window.location.href='${PAGE}'; 'ok'`);
pause(1000);

// 1. Project actions must keep the flat card-link styling, not UA button chrome.
const linkStyle = evaluate(`(() => {
  const c = getComputedStyle(document.querySelector('.tcg-foot__link'));
  return { bg: c.backgroundColor, border: c.borderStyle, font: c.fontFamily };
})()`);
if (linkStyle.bg !== 'rgba(0, 0, 0, 0)' && linkStyle.bg !== 'transparent') {
  failures.push(`project action has background ${linkStyle.bg}`);
}
if (linkStyle.border !== 'none') failures.push(`project action has ${linkStyle.border} border`);
if (/Arial/.test(linkStyle.font)) failures.push(`project action uses UA font ${linkStyle.font}`);

// 2. Focus must stay inside the project-detail dialog.
evaluate("document.querySelector('.tcg-foot__link').click(); 'ok'");
pause(200);
for (let i = 0; i < 4; i += 1) {
  browser('press', 'Tab');
  pause(80);
  const inside = evaluate("document.getElementById('project-detail-modal').contains(document.activeElement)");
  if (!inside) {
    failures.push(`Tab ${i + 1} moved focus outside the modal`);
    break;
  }
}
const inertSet = evaluate("[...document.body.children].filter(el => el.id !== 'project-detail-modal' && el.tagName !== 'SCRIPT').every(el => el.inert)");
if (!inertSet) failures.push('background is not inert while the modal is open');
evaluate("document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape'})); 'ok'");
pause(150);
const restored = evaluate("[...document.body.children].every(el => !el.inert) && document.activeElement?.classList.contains('tcg-foot__link')");
if (!restored) failures.push('focus/inert state was not restored on close');

// 3. Scroll-spy must re-evaluate after a resize with no scroll event.
evaluate("document.querySelector('#references').scrollIntoView({block:'start',behavior:'instant'}); 'ok'");
pause(250);
const before = evaluate("document.querySelector('.nav-link.active')?.getAttribute('href')");
browser('set', 'viewport', '390', '844');
pause(350);
const expected = evaluate(`(() => {
  const sections = [...document.querySelectorAll('section[id]')];
  const probe = scrollY + (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 8;
  let current = sections[0].id;
  sections.forEach(s => { if (s.getBoundingClientRect().top + scrollY <= probe) current = s.id; });
  if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) current = sections.at(-1).id;
  return '#' + current;
})()`);
const after = evaluate("document.querySelector('.nav-link.active')?.getAttribute('href')");
if (after !== expected) failures.push(`after resize: highlight ${after}, section in view ${expected} (was ${before})`);

// 4. Static-document correctness checked on the raw HTML.
browser('eval', `window.location.href='${PAGE}'; 'ok'`);
pause(600);
const head = evaluate(`(() => {
  const ld = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  return {
    icons: [...document.querySelectorAll('link[rel="icon"]')].map(l => l.getAttribute('href')),
    email: ld.email,
    title: document.title,
    ogTitle: document.querySelector('meta[property="og:title"]').content,
    hiddenSummary: !!document.querySelector('.sr-only')
  };
})()`);
if (head.icons.length !== 1 || head.icons[0] !== '/favicon.svg') {
  failures.push(`icon links are ${JSON.stringify(head.icons)}, expected only /favicon.svg`);
}
if (head.email !== 'agonia.lloyd8@gmail.com') failures.push(`JSON-LD email is ${head.email}`);
if (head.title !== head.ogTitle.replace(' &amp; ', ' & ')) {
  failures.push(`title "${head.title}" differs from og:title "${head.ogTitle}"`);
}
if (!head.hiddenSummary) failures.push('missing visually-hidden crawlable summary');

if (failures.length) {
  console.error('FAIL:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('PASS: card action styling, modal focus, resize highlight, and static head metadata');
