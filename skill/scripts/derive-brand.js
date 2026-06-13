#!/usr/bin/env node
/**
 * Thoth brand auto-derivation.
 *
 * Derives a per-persona visual identity (brand.yaml) from the persona's
 * PERSONALITY — its dominant/secondary brand archetype and tone sliders —
 * so a persona gets a coherent, on-character palette without a design step.
 *
 * Explicit branding always wins: any colour passed via --accent/--bg/--ink/
 * --primary (or a key the caller marks explicit) overrides the derived value.
 * That is how "unless I give branding instructions" is honoured — the skill
 * passes user-supplied colours as flags; with none, the palette is pure-derived.
 *
 * Usage:
 *   node derive-brand.js --persona <persona.md> [--handle "@x"] --out <brand.yaml>
 *   node derive-brand.js --archetype magician --secondary hero \
 *        [--tone-casual 5 --tone-funny 3 --tone-irreverent 2 --tone-enthusiasm 3] \
 *        [--accent "#5B3BFF"] --out <brand.yaml>
 *
 * Exit: 0 ok, 1 arg/parse error.
 */
'use strict';
const fs = require('fs');

function parseArgs(argv) {
  const o = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--')) o[argv[i].slice(2)] = argv[++i];
  }
  return o;
}
const args = parseArgs(process.argv);

// --- archetype -> base hue (deg) + energy (scales accent saturation) ---------
// Hues chosen from the LinkedIn-voice meaning of each Jungian archetype:
// transformation=violet, courage=crimson, authority=navy, knowledge=slate-blue,
// care=teal, play=amber, etc. (see references/brand-archetypes.md).
const ARCHETYPE = {
  hero:      { hue: 352, energy: 1.00 },
  outlaw:    { hue: 6,   energy: 1.12 },
  magician:  { hue: 266, energy: 0.96 },
  everyman:  { hue: 210, energy: 0.80 },
  lover:     { hue: 338, energy: 0.96 },
  jester:    { hue: 40,  energy: 1.14 },
  caregiver: { hue: 168, energy: 0.82 },
  creator:   { hue: 24,  energy: 1.06 },
  ruler:     { hue: 232, energy: 0.86 },
  innocent:  { hue: 196, energy: 0.84 },
  sage:      { hue: 214, energy: 0.76 },
  explorer:  { hue: 150, energy: 0.90 },
};

// archetype -> display/body font (macOS system faces — no bundling, the CSS
// stack falls back to Inter/-apple-system if a face is absent). Chosen to match
// each archetype's character: geometric for vision, serif for authority/knowledge,
// hand-drawn for play, humanist sans for warmth.
const FONT = {
  hero:      { d: 'Futura',         b: 'Helvetica Neue' },
  outlaw:    { d: 'Helvetica Neue', b: 'Helvetica Neue' },
  magician:  { d: 'Futura',         b: 'Avenir Next' },
  everyman:  { d: 'Helvetica Neue', b: 'Helvetica Neue' },
  lover:     { d: 'Didot',          b: 'Georgia' },
  jester:    { d: 'Chalkboard SE',  b: 'Helvetica Neue' },
  caregiver: { d: 'Avenir Next',    b: 'Avenir Next' },
  creator:   { d: 'Gill Sans',      b: 'Gill Sans' },
  ruler:     { d: 'Baskerville',    b: 'Georgia' },
  innocent:  { d: 'Avenir Next',    b: 'Avenir Next' },
  sage:      { d: 'Georgia',        b: 'Georgia' },
  explorer:  { d: 'Gill Sans',      b: 'Avenir Next' },
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp(s, 0, 1); l = clamp(l, 0, 1);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return ('#' + to(r) + to(g) + to(b)).toUpperCase();
}

// --- gather personality ------------------------------------------------------
let dominant = (args.archetype || '').toLowerCase();
let secondary = (args.secondary || '').toLowerCase();
const tone = {
  casual: num(args['tone-casual'], 3),
  funny: num(args['tone-funny'], 3),
  irreverent: num(args['tone-irreverent'], 3),
  enthusiasm: num(args['tone-enthusiasm'], 3),
};
let handle = args.handle || '';

if (args.persona) {
  const t = fs.readFileSync(args.persona, 'utf8');
  dominant = dominant || (t.match(/dominant:\s*([a-z]+)/i) || [])[1] || '';
  secondary = secondary || (t.match(/secondary:\s*([a-z]+)/i) || [])[1] || '';
  pick(t, /formal_casual:\s*(\d+)/, 'casual');
  pick(t, /serious_funny:\s*(\d+)/, 'funny');
  pick(t, /respectful_irreverent:\s*(\d+)/, 'irreverent');
  pick(t, /matter_of_fact_enthusiastic:\s*(\d+)/, 'enthusiasm');
  if (!handle) {
    const u = (t.match(/username:\s*([^\s]+)/) || [])[1];
    if (u) handle = '@' + u;
  }
  function pick(text, re, key) { const m = text.match(re); if (m && !args['tone-' + key]) tone[key] = +m[1]; }
}
function num(v, d) { return v == null ? d : +v; }

dominant = ARCHETYPE[dominant] ? dominant : 'sage';   // safe fallback
const base = ARCHETYPE[dominant];
const sec = ARCHETYPE[secondary] || base;

// --- derive palette from personality ----------------------------------------
const satA = clamp(0.62 * base.energy + (tone.enthusiasm - 3) * 0.05 + (tone.irreverent - 3) * 0.03, 0.45, 0.95);
const litA = clamp(0.55 + (tone.enthusiasm - 3) * 0.02, 0.46, 0.62);
const accent = hslToHex(base.hue, satA, litA);
const ink = hslToHex(base.hue, 0.32, clamp(0.13 - (tone.irreverent - 3) * 0.01, 0.09, 0.17));
const bg = hslToHex(base.hue, 0.30, 0.975);

// pastel sticker fills: analogous spread off the base, plus a pop from the secondary
const sl = clamp(0.905 - (tone.irreverent - 3) * 0.006, 0.86, 0.93);
const ss = clamp(0.56 + (tone.funny - 3) * 0.04 + (tone.enthusiasm - 3) * 0.02, 0.4, 0.8);
const swatchHues = [base.hue, base.hue + 34, base.hue - 30, base.hue + 64, sec.hue];
const swatches = swatchHues.map((h) => hslToHex(h, ss, sl));

const gradient = `linear-gradient(150deg, ${bg} 0%, ${hslToHex(base.hue + 18, 0.45, 0.965)} 52%, ${hslToHex(sec.hue, 0.42, 0.96)} 100%)`;
const radius = Math.round(14 + (tone.casual - 1) / 4 * 14) + 'px';   // casual -> rounder

// explicit overrides win
const font = FONT[dominant] || FONT.sage;
const out = {
  accent: args.accent || accent,
  ink: args.ink || ink,
  primary: args.primary || args.ink || ink,
  bg: args.bg || bg,
  displayFont: args['display-font'] || font.d,
  bodyFont: args['body-font'] || font.b,
};

const yaml = `# Auto-derived by scripts/derive-brand.js from this persona's personality:
#   archetype: ${dominant}${secondary ? ' / ' + secondary : ''}  |  tone(casual ${tone.casual}, funny ${tone.funny}, irreverent ${tone.irreverent}, enthusiasm ${tone.enthusiasm})
# Explicit branding overrides this — edit values below or re-run /thoth brand with colours.
persona:
  handle: "${handle}"
  aspect_ratio: "4:5"
colors:
  primary: "${out.primary}"
  accent: "${out.accent}"
  ink: "${out.ink}"
  background: "${out.bg}"
palette:
  swatch1: "${swatches[0]}"
  swatch2: "${swatches[1]}"
  swatch3: "${swatches[2]}"
  swatch4: "${swatches[3]}"
  swatch5: "${swatches[4]}"
typography:
  display_font: "${out.displayFont}"
  body_font: "${out.bodyFont}"
style:
  header: "pill"
  card_radius: "${radius}"
  card_stroke: "${out.ink}"
  background_gradient: "${gradient}"
`;

if (!args.out) { process.stdout.write(yaml); }
else {
  fs.mkdirSync(require('path').dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, yaml);
  console.log(`[derive-brand] ${dominant}/${secondary || '-'} -> ${args.out}`);
  console.log(`[derive-brand] accent ${out.accent}  ink ${out.ink}  bg ${out.bg}`);
  console.log(`[derive-brand] swatches ${swatches.join(' ')}`);
  console.log(`[derive-brand] fonts ${out.displayFont} / ${out.bodyFont}`);
}
