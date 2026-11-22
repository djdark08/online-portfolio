import { execFileSync } from 'node:child_process';

const SESSION = 'portfolio-fix';
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

browser('set', 'viewport', '1440', '900');
browser('open', 'http://localhost:8000/');
execFileSync('sleep', ['1']);

const actions = evaluate(`[...document.querySelectorAll('.tcg-foot__link')].map(el => ({
  tag: el.tagName,
  href: el.getAttribute('href'),
  index: el.getAttribute('data-project-index')
}))`);

const dead = actions.filter(a => a.href === '#projects' || (!a.href && a.index === null));
if (dead.length) failures.push(`${dead.length} project action(s) are dead links`);
if (actions.length !== 6) failures.push(`expected 6 project actions, got ${actions.length}`);

const expected = evaluate('window.portfolioConfig.projects.list[0]');

evaluate("document.querySelector('.tcg-foot__link')?.click(); 'ok'");
execFileSync('sleep', ['0.3']);

const modal = evaluate(`(() => {
  const m = document.getElementById('project-detail-modal');
  if (!m) return null;
  const img = m.querySelector('img');
  return {
    active: m.classList.contains('active'),
    text: m.innerText,
    imgSrc: img ? img.getAttribute('src') : null
  };
})()`);

if (!modal || !modal.active) {
  failures.push('project detail modal did not open');
} else {
  if (!modal.text.includes(expected.name)) failures.push('modal missing project name');
  if (!modal.text.includes(expected.description)) failures.push('modal missing description');
  if (modal.imgSrc !== expected.image) failures.push(`modal image ${modal.imgSrc} != ${expected.image}`);
  for (const tech of expected.technologies) {
    if (!modal.text.includes(tech)) failures.push(`modal missing tech ${tech}`);
  }
}

evaluate("document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'})); 'ok'");
execFileSync('sleep', ['0.2']);
const closed = evaluate("!document.getElementById('project-detail-modal')?.classList.contains('active')");
if (!closed) failures.push('Escape did not close the modal');

if (failures.length) {
  console.error('FAIL:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('PASS: six working project actions; modal shows name, description, image and tech; Escape closes');
