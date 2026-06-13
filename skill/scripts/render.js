#!/usr/bin/env node
/**
 * Thoth single-image renderer.
 *
 * Takes a template name + content JSON + per-persona brand config and renders
 * the HTML via puppeteer-core (uses the user's system Chrome — no Chromium
 * download). Output mode is chosen by the --out extension:
 *   .png  -> single static frame at 2x (existing behavior)
 *   .gif  -> animated GIF: the template's window.__thothAnim GSAP timeline is
 *            built paused, seeked frame-by-frame, captured, and encoded with
 *            gifski (preferred) or ffmpeg two-pass palette (fallback).
 * Canvas is portrait 4:5 (1080x1350) — LinkedIn's max feed real estate. GIFs
 * are held under LinkedIn's animation envelope (<5MB, <400 frames).
 *
 * Dependencies (puppeteer-core, gsap) install into ~/.thoth/cache/render/ on
 * first run (NOT into the skill folder — that gets wiped on `amskills update`).
 *
 * Usage:
 *   node render.js \
 *     --template <quote-card|stat-card|headline-card> \
 *     --content <path-to-content.json> \
 *     --brand <path-to-brand.yaml> \
 *     --out <output.png|output.gif> \
 *     [--fps 30] [--quality 90]
 *
 * Exit codes:
 *   0  success
 *   1  arg error
 *   2  template not found
 *   3  Chrome not found
 *   4  render failure
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      out[a.slice(2)] = argv[++i];
    }
  }
  return out;
}

const args = parseArgs(process.argv);
if (!args.template || !args.content || !args.brand || !args.out) {
  console.error('Usage: render.js --template <name> --content <json> --brand <yaml> --out <png>');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Dependency bootstrap — install puppeteer-core into ~/.thoth/cache/render/
// ---------------------------------------------------------------------------
const CACHE_DIR = path.join(os.homedir(), '.thoth', 'cache', 'render');
const CACHE_NODE_MODULES = path.join(CACHE_DIR, 'node_modules');
const CACHE_PKG = path.join(CACHE_DIR, 'package.json');

const CACHE_DEPS = { 'puppeteer-core': '^22.0.0', 'gsap': '^3.12.5' };

function ensureDeps() {
  const haveAll = Object.keys(CACHE_DEPS).every(
    (d) => fs.existsSync(path.join(CACHE_NODE_MODULES, d)));
  if (haveAll) return;

  console.error('[thoth render] First-time setup: installing', Object.keys(CACHE_DEPS).join(', '), 'into', CACHE_DIR);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  // Always (re)write package.json so newly-added deps actually install on upgrade.
  fs.writeFileSync(CACHE_PKG, JSON.stringify({
    name: 'thoth-render-cache',
    version: '1.0.0',
    private: true,
    dependencies: CACHE_DEPS
  }, null, 2));

  const r = spawnSync('npm', ['install', '--silent', '--no-audit', '--no-fund'], {
    cwd: CACHE_DIR,
    stdio: 'inherit'
  });
  if (r.status !== 0) {
    console.error('[thoth render] npm install failed. Make sure Node and npm are installed.');
    process.exit(4);
  }
}

ensureDeps();
const puppeteer = require(path.join(CACHE_NODE_MODULES, 'puppeteer-core'));

// ---------------------------------------------------------------------------
// Locate system Chrome (no Chromium download)
// ---------------------------------------------------------------------------
function findChrome() {
  const candidates = process.platform === 'darwin' ? [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Arc.app/Contents/MacOS/Arc',
  ] : process.platform === 'linux' ? [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/brave-browser',
  ] : [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Minimal YAML reader (only handles the flat key-value shape we need)
// ---------------------------------------------------------------------------
function readBrandYaml(filePath) {
  if (!fs.existsSync(filePath)) {
    return defaultBrand();
  }
  const text = fs.readFileSync(filePath, 'utf8');
  const brand = defaultBrand();
  const colorRe = /^\s+(\w+):\s*"?([^"\n]+)"?\s*$/;
  let section = null;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (/^\w/.test(line)) {
      section = line.replace(':', '').trim();
      continue;
    }
    const m = line.match(colorRe);
    if (!m) continue;
    const [, k, v] = m;
    if (section === 'colors') {
      if (k === 'primary') brand.colors.primary = v;
      else if (k === 'accent') brand.colors.accent = v;
      else if (k === 'background') brand.colors.bg = v;
      else if (k === 'ink') brand.colors.ink = v;
    } else if (section === 'typography') {
      if (k === 'display_font') brand.typography.display = v;
      if (k === 'body_font') brand.typography.body = v;
    } else if (section === 'palette') {
      const sm = k.match(/^swatch([1-5])$/);
      if (sm) brand.palette['s' + sm[1]] = v;
    } else if (section === 'style') {
      if (k === 'card_radius') brand.style.cardRadius = v;
      else if (k === 'card_stroke') brand.style.cardStroke = v;
      else if (k === 'background_gradient') brand.style.bgGradient = v;
      else if (k === 'header') brand.style.header = v;
    } else if (k === 'handle') {
      brand.handle = v.replace(/^["']|["']$/g, '');
    } else if (k === 'aspect_ratio') {
      brand.aspect_ratio = v;
    }
  }
  return brand;
}

function defaultBrand() {
  return {
    colors: {
      primary: '#191A35',
      accent: '#3B43FF',
      ink: '#191A35',
      bg: '#FFFFFF',
    },
    typography: {
      display: '',
      body: '',
    },
    palette: { s1: '', s2: '', s3: '', s4: '', s5: '' },
    style: { cardRadius: '', cardStroke: '', bgGradient: '', header: '' },
    handle: '',
    aspect_ratio: '1:1',
  };
}

// ---------------------------------------------------------------------------
// Template rendering (mustache-lite: {{var}} and {{#var}}...{{/var}})
// Conditionals may nest: the pass repeats to a fixpoint so an inner
// {{#a}}...{{#b}}...{{/b}}...{{/a}} resolves outside-in. (A single pass would
// strip the outer tags but leave the inner block as literal text.)
// ---------------------------------------------------------------------------
function render(template, ctx) {
  let out = template;
  for (let i = 0; i < 10; i++) {
    const next = out.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (_, k, body) => (ctx[k] ? body : ''));
    if (next === out) break;        // no conditionals left -> done
    out = next;
  }
  // Variable substitution
  out = out.replace(/{{(\w+)}}/g, (_, k) => {
    return ctx[k] !== undefined && ctx[k] !== null ? String(ctx[k]) : '';
  });
  return out;
}

// ---------------------------------------------------------------------------
// Resolve template + assets
// ---------------------------------------------------------------------------
const SKILL_DIR = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(SKILL_DIR, 'templates', 'single-image');

function loadTemplate(name) {
  const p = path.join(TEMPLATE_DIR, `${name}.html.tmpl`);
  if (!fs.existsSync(p)) {
    console.error(`[thoth render] Template not found: ${p}`);
    process.exit(2);
  }
  return fs.readFileSync(p, 'utf8');
}

function loadSharedCss(name) {
  const p = path.join(TEMPLATE_DIR, '_shared', name);
  return fs.readFileSync(p, 'utf8');
}

// Override token CSS variables from brand.yaml
function brandOverrides(brand) {
  const overrides = [];
  if (brand.colors.primary) overrides.push(`--brand-primary: ${brand.colors.primary};`);
  if (brand.colors.accent)  overrides.push(`--brand-accent: ${brand.colors.accent};`);
  if (brand.colors.ink)     overrides.push(`--brand-ink: ${brand.colors.ink};`);
  if (brand.colors.bg)      overrides.push(`--brand-bg: ${brand.colors.bg};`);
  if (brand.typography.display) {
    overrides.push(`--font-display: "${brand.typography.display}", "Inter", -apple-system, sans-serif;`);
  }
  if (brand.typography.body) {
    overrides.push(`--font-body: "${brand.typography.body}", "Inter", -apple-system, sans-serif;`);
  }
  for (let i = 1; i <= 5; i++) {
    if (brand.palette['s' + i]) overrides.push(`--swatch-${i}: ${brand.palette['s' + i]};`);
  }
  if (brand.style.cardRadius) overrides.push(`--card-radius: ${brand.style.cardRadius};`);
  if (brand.style.cardStroke) overrides.push(`--card-stroke: ${brand.style.cardStroke};`);
  if (brand.style.bgGradient) overrides.push(`--bg-gradient: ${brand.style.bgGradient};`);
  return `:root{${overrides.join('')}}`;
}

// ---------------------------------------------------------------------------
// Output mode + GIF encoding
// ---------------------------------------------------------------------------
const CANVAS = { w: 1080, h: 1350 };          // portrait 4:5 — LinkedIn feed-max
const FPS = parseInt(args.fps, 10) || 30;
const GIF_QUALITY = parseInt(args.quality, 10) || 90;
const MAX_FRAMES = 399;                       // LinkedIn animates GIFs under ~400 frames
const isAnimated = /\.gif$/i.test(args.out);

function which(bin) {
  const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', [bin], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim().split(/\r?\n/)[0] : null;
}

// Encode zero-padded PNG frames into a looping GIF, downscaling to `width`.
// Prefers gifski (best dithering for gradients); falls back to ffmpeg two-pass palette.
function encodeGif(framesDir, framePattern, frameFiles, outPath, fps, width) {
  const gifski = which('gifski');
  if (gifski) {
    console.error('[thoth render] Encoding with gifski');
    const r = spawnSync(gifski, ['-o', outPath, '--fps', String(fps),
      '--quality', String(GIF_QUALITY), '--width', String(width), ...frameFiles],
      { stdio: 'inherit' });
    if (r.status === 0) return 'gifski';
    console.error('[thoth render] gifski failed; falling back to ffmpeg');
  }
  const ffmpeg = which('ffmpeg');
  if (!ffmpeg) {
    console.error('[thoth render] No GIF encoder found. Install gifski (brew install gifski) or ffmpeg.');
    process.exit(4);
  }
  console.error('[thoth render] Encoding with ffmpeg (palettegen/paletteuse)');
  const palette = path.join(framesDir, 'palette.png');
  const scale = `scale=${width}:-1:flags=lanczos`;
  const gen = spawnSync(ffmpeg, ['-y', '-framerate', String(fps), '-i', framePattern,
    '-vf', `${scale},palettegen=stats_mode=diff`, palette], { stdio: 'inherit' });
  if (gen.status !== 0) { console.error('[thoth render] ffmpeg palettegen failed'); process.exit(4); }
  const use = spawnSync(ffmpeg, ['-y', '-framerate', String(fps), '-i', framePattern, '-i', palette,
    '-lavfi', `${scale}[x];[x][1:v]paletteuse=dither=sierra2_4a`, '-loop', '0', outPath],
    { stdio: 'inherit' });
  if (use.status !== 0) { console.error('[thoth render] ffmpeg paletteuse failed'); process.exit(4); }
  return 'ffmpeg';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
(async () => {
  const chromePath = findChrome();
  if (!chromePath) {
    console.error('[thoth render] No Chrome/Chromium/Brave/Edge found in standard install locations.');
    console.error('[thoth render] Install Google Chrome (https://www.google.com/chrome/) and re-run.');
    process.exit(3);
  }

  const brand = readBrandYaml(args.brand);
  const content = JSON.parse(fs.readFileSync(args.content, 'utf8'));

  // Inject defaults from brand
  if (!content.attribution) content.attribution = brand.handle || '';

  const template = loadTemplate(args.template);
  const tokens = loadSharedCss('tokens.css');
  const base = loadSharedCss('base.css') + loadSharedCss('components.css');
  const overrides = brandOverrides(brand);

  const html = render(template, {
    ...content,
    tokens_css: tokens + overrides,
    base_css: base,
  });

  // Save a debug HTML next to the output for manual eyeballing
  const debugHtml = args.out.replace(/\.(gif|png)$/i, '.html');
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(debugHtml, html);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  try {
    const page = await browser.newPage();

    if (!isAnimated) {
      // ----- Static PNG (portrait 4:5, 2x retina) -----
      await page.setViewport({ width: CANVAS.w, height: CANVAS.h, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await page.screenshot({
        path: args.out, type: 'png',
        clip: { x: 0, y: 0, width: CANVAS.w, height: CANVAS.h }, omitBackground: false,
      });
      await browser.close();
      console.log(`[thoth render] Wrote ${args.out} (static PNG)`);
      console.log(`[thoth render] Debug HTML: ${debugHtml}`);
      return;
    }

    // ----- Animated GIF (GSAP seek-capture -> encode) -----
    // Capture at 2x then downscale on encode for crisp text + smoother gradients.
    const gsapSrc = fs.readFileSync(
      path.join(CACHE_NODE_MODULES, 'gsap', 'dist', 'gsap.min.js'), 'utf8');
    await page.setViewport({ width: CANVAS.w, height: CANVAS.h, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.addScriptTag({ content: gsapSrc });
    await page.addScriptTag({ content: loadSharedCss('motion.js') });  // window.__thothMotion

    const dur = await page.evaluate(() => {
      if (!window.__thothAnim || typeof window.__thothAnim.build !== 'function') return null;
      window.gsap.ticker.lagSmoothing(0);
      window.__thothTL = window.__thothAnim.build(window.gsap);
      window.__thothTL.pause();
      return window.__thothAnim.duration || window.__thothTL.duration();
    });
    if (dur === null) {
      console.error(`[thoth render] Template "${args.template}" defines no window.__thothAnim.build(); cannot animate.`);
      await browser.close();
      process.exit(4);
    }

    let totalFrames = Math.max(2, Math.round(dur * FPS));
    let effFps = FPS;
    if (totalFrames > MAX_FRAMES) {
      totalFrames = MAX_FRAMES;
      effFps = Math.max(1, Math.floor(MAX_FRAMES / dur));
      console.error(`[thoth render] Capped to ${MAX_FRAMES} frames for LinkedIn; fps -> ${effFps}`);
    }

    const framesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'thoth-frames-'));
    const pad = (n) => String(n).padStart(5, '0');
    for (let i = 0; i < totalFrames; i++) {
      const t = (i / (totalFrames - 1)) * dur;
      await page.evaluate((time) => {
        // seek(t, false): do NOT suppress callbacks — onUpdate drives the
        // count-up text. GSAP suppresses events on seek by default, which
        // would freeze callback-driven values while property tweens still render.
        window.__thothTL.seek(time, false);
        return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      }, t);
      await page.screenshot({
        path: path.join(framesDir, `f_${pad(i)}.png`), type: 'png',
        clip: { x: 0, y: 0, width: CANVAS.w, height: CANVAS.h }, omitBackground: false,
      });
    }
    await browser.close();

    const framePattern = path.join(framesDir, 'f_%05d.png');
    const frameFiles = Array.from({ length: totalFrames }, (_, i) => path.join(framesDir, `f_${pad(i)}.png`));
    const encoder = encodeGif(framesDir, framePattern, frameFiles, args.out, effFps, CANVAS.w);

    const bytes = fs.statSync(args.out).size;
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    try { fs.rmSync(framesDir, { recursive: true, force: true }); } catch (e) {}

    const framesOK = totalFrames < 400;
    const sizeOK = bytes < 5 * 1024 * 1024;
    console.log(`[thoth render] Wrote ${args.out} (animated GIF, encoder=${encoder})`);
    console.log(`[thoth render] ${totalFrames} frames @ ${effFps}fps, ${mb} MB`);
    console.log(`[thoth render] LinkedIn envelope: frames ${framesOK ? 'OK' : 'OVER 400'}, size ${sizeOK ? 'OK' : 'OVER 5MB'}`);
    console.log(`[thoth render] Debug HTML: ${debugHtml}`);
    if (!framesOK || !sizeOK) process.exit(5);
  } catch (err) {
    console.error('[thoth render] Render failed:', err.message);
    try { await browser.close(); } catch (e) {}
    process.exit(4);
  }
})();
