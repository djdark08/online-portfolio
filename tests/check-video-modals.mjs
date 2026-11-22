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

function geometry(modalSelector) {
  return evaluate(`(() => {
    const modal = document.querySelector('${modalSelector}.active');
    if (!modal) return null;
    const iframe = modal.querySelector('iframe');
    if (!iframe) return null;
    const r = iframe.getBoundingClientRect();
    return {
      w: Math.round(r.width), h: Math.round(r.height),
      left: Math.round(r.left), top: Math.round(r.top),
      right: Math.round(r.right), bottom: Math.round(r.bottom),
      vw: innerWidth, vh: innerHeight
    };
  })()`);
}

function checkFit(label, g, wantRatio) {
  if (!g) {
    failures.push(`${label}: modal did not open`);
    return;
  }
  const ratio = g.w / g.h;
  if (Math.abs(ratio - wantRatio) > 0.02) {
    failures.push(`${label}: aspect ${ratio.toFixed(3)} (want ${wantRatio.toFixed(3)}), ${g.w}x${g.h}`);
  }
  if (g.left < -1 || g.top < -1 || g.right > g.vw + 1 || g.bottom > g.vh + 1) {
    failures.push(`${label}: video outside viewport (${g.left},${g.top},${g.right},${g.bottom} vs ${g.vw}x${g.vh})`);
  }
}

for (const [width, height] of [[1440, 900], [390, 844]]) {
  browser('set', 'viewport', String(width), String(height));
  browser('eval', `window.location.href='${URL}?probe=modal-${width}-${Date.now()}'; 'ok'`);
  pause(650);
  evaluate("[...document.querySelectorAll('link[rel=stylesheet]')].forEach(l => { l.href = l.href.split('?')[0] + '?cb=' + Date.now(); }); 'ok'");
  pause(400);

  // YouTube (landscape) modal, opened the way a visitor opens it.
  evaluate("document.querySelector('#video-links').scrollIntoView({block:'start',behavior:'instant'}); 'ok'");
  pause(200);
  const opened = evaluate("(() => { const o=document.querySelector('.video-overlay'); if(!o) return false; o.click(); return true; })()");
  pause(450);
  const youtube = geometry('#youtube-modal');
  if (!opened || !youtube) failures.push(`${width}px: YouTube modal did not open`);
  else {
    checkFit(`${width}px YouTube`, youtube, 16 / 9);
    if (youtube.w < width * 0.6) failures.push(`${width}px YouTube: iframe only ${youtube.w}px wide`);
  }
  evaluate("typeof closeYouTubeModal === 'function' && closeYouTubeModal(); 'ok'");
  pause(200);

  // TikTok (portrait) modal.
  const openedPortrait = evaluate(`(() => {
    const v = window.portfolioConfig.videoLinks.videos.find(x => x.platform === 'tiktok');
    if (!v || typeof openVideoModal !== 'function') return false;
    openVideoModal(v);
    return true;
  })()`);
  pause(450);
  const portrait = geometry('#video-modal');
  if (!openedPortrait || !portrait) failures.push(`${width}px: portrait modal did not open`);
  else checkFit(`${width}px TikTok`, portrait, 9 / 16);
  evaluate("document.getElementById('video-modal-close')?.click(); 'ok'");
  pause(200);
}

if (failures.length) {
  console.error('FAIL:\n' + failures.join('\n'));
  process.exit(1);
}
console.log('PASS: YouTube 16:9 and TikTok 9:16 modals fit viewport at 1440x900 and 390x844');
