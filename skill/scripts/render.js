#!/usr/bin/env node
/**
 * Thoth single-image renderer.
 *
 * Takes a template name + content JSON + per-persona brand config,
 * renders the HTML via puppeteer-core (uses the user's system Chrome —
 * no Chromium download), outputs a PNG at 2x for retina sharpness.
 *
 * Dependencies are installed into ~/.thoth/cache/render/ on first run
 * (NOT into the skill folder — that gets wiped on `amskills update`).
 *
 * Usage:
 *   node render.js \
 *     --template <quote-card|stat-card|headline-card> \
 *     --content <path-to-content.json> \
 *     --brand <path-to-brand.yaml> \
 *     --out <output.png>
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

function ensureDeps() {
  if (fs.existsSync(path.join(CACHE_NODE_MODULES, 'puppeteer-core'))) return;

  console.error('[thoth render] First-time setup: installing puppeteer-core into', CACHE_DIR);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  if (!fs.existsSync(CACHE_PKG)) {
    fs.writeFileSync(CACHE_PKG, JSON.stringify({
      name: 'thoth-render-cache',
      version: '1.0.0',
      private: true,
      dependencies: { 'puppeteer-core': '^22.0.0' }
    }, null, 2));
  }

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
    handle: '',
    aspect_ratio: '1:1',
  };
}

// ---------------------------------------------------------------------------
// Template rendering (mustache-lite: {{var}} and {{#var}}...{{/var}})
// ---------------------------------------------------------------------------
function render(template, ctx) {
  // Conditional blocks
  let out = template.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (_, k, body) => {
    return ctx[k] ? body : '';
  });
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
  return `:root{${overrides.join('')}}`;
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
  const base = loadSharedCss('base.css');
  const overrides = brandOverrides(brand);

  const html = render(template, {
    ...content,
    tokens_css: tokens + overrides,
    base_css: base,
  });

  // Save a debug HTML next to the output for manual eyeballing
  const debugHtml = args.out.replace(/\.png$/, '.html');
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(debugHtml, html);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: args.out,
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 1200 },
      omitBackground: false,
    });
  } catch (err) {
    console.error('[thoth render] Render failed:', err.message);
    await browser.close();
    process.exit(4);
  }

  await browser.close();
  console.log(`[thoth render] Wrote ${args.out}`);
  console.log(`[thoth render] Debug HTML: ${debugHtml}`);
})();
