#!/usr/bin/env node
// Thoth CLI — zero-dependency installer for the Thoth Claude skill.
// Usage:
//   npx thoth-skill init                 # install to ~/.claude/skills/thoth
//   npx thoth-skill init --ai cursor     # install to ~/.cursor/skills/thoth
//   npx thoth-skill init --local         # install to ./.claude/skills/thoth
//   npx thoth-skill init --offline       # use bundled assets only (skip GitHub fetch)
//   npx thoth-skill uninstall            # remove the skill
//   npx thoth-skill versions             # list released versions
//   npx thoth-skill update               # pull the latest release

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { execFileSync } = require('child_process');
const zlib = require('zlib');

const REPO = process.env.THOTH_REPO || 'NirvanaGuha/thoth';
const SKILL_NAME = 'thoth';
const VERSION = require('../package.json').version;

// ---------------------------------------------------------------------------
// Tiny color helpers (no deps)
// ---------------------------------------------------------------------------
const c = (code) => (s) => process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s;
const bold = c('1');
const dim = c('2');
const green = c('32');
const cyan = c('36');
const yellow = c('33');
const red = c('31');

// ---------------------------------------------------------------------------
// Argument parsing (dead-simple, no deps)
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const [, , cmd = 'help', ...rest] = argv;
  const flags = {};
  const positional = [];
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      flags[k] = v !== undefined ? v : (rest[i + 1] && !rest[i + 1].startsWith('--') ? rest[++i] : true);
    } else if (a.startsWith('-')) {
      flags[a.slice(1)] = true;
    } else {
      positional.push(a);
    }
  }
  return { cmd, flags, positional };
}

// ---------------------------------------------------------------------------
// Install path resolution
// ---------------------------------------------------------------------------
const SKILL_DIR_MAP = {
  claude: '.claude/skills',       // Claude Code & Cowork
  cursor: '.cursor/skills',       // Cursor
  windsurf: '.windsurf/skills',   // Windsurf
};

function resolveTarget(flags) {
  const ai = (flags.ai || 'claude').toLowerCase();
  const subdir = SKILL_DIR_MAP[ai];
  if (!subdir) {
    fail(`Unknown --ai value: ${ai}. Supported: ${Object.keys(SKILL_DIR_MAP).join(', ')}`);
  }
  const scope = flags.local ? process.cwd() : os.homedir();
  return path.join(scope, subdir, SKILL_NAME);
}

// ---------------------------------------------------------------------------
// Fetching from GitHub
// ---------------------------------------------------------------------------
function httpGet(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'thoth-cli' }, ...opts }, (res) => {
      // Follow redirects (GitHub release tarballs 302 to codeload)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return httpGet(res.headers.location, opts).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`GET ${url} → HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function fetchLatestRelease() {
  const url = `https://api.github.com/repos/${REPO}/releases/latest`;
  try {
    const buf = await httpGet(url);
    const info = JSON.parse(buf.toString('utf8'));
    return { tag: info.tag_name, tarball: info.tarball_url };
  } catch (e) {
    // Fall back to the default branch tarball if there are no releases yet.
    return { tag: 'main', tarball: `https://codeload.github.com/${REPO}/tar.gz/refs/heads/main` };
  }
}

function untarGz(buf, destRoot) {
  // Minimal tar extractor — handles regular files and directories only.
  // Good enough for a Claude skill (pure text/markdown). No symlinks in our tarball.
  const raw = zlib.gunzipSync(buf);
  let pos = 0;
  // Identify the top-level folder in the tar (GitHub adds "<user>-<repo>-<sha>/").
  let topLevel = null;
  while (pos + 512 <= raw.length) {
    const header = raw.slice(pos, pos + 512);
    if (header[0] === 0) break; // End of archive
    const name = header.slice(0, 100).toString('utf8').replace(/\0.*$/, '');
    const sizeField = header.slice(124, 136).toString('utf8').replace(/\0.*$/, '').trim();
    const size = parseInt(sizeField, 8) || 0;
    const type = header[156] === 0 ? '0' : String.fromCharCode(header[156]);
    pos += 512;

    if (!name) { pos += Math.ceil(size / 512) * 512; continue; }

    // Skip extended-header entries (pax global, pax local, GNU long name / link).
    // GitHub's release tarballs start with a pax global header whose name is NOT
    // the repo folder — letting it set topLevel makes every subsequent entry
    // fail the `relative.startsWith('skill/')` filter, silently extracting nothing.
    if (type === 'x' || type === 'g' || type === 'K' || type === 'L') {
      pos += Math.ceil(size / 512) * 512;
      continue;
    }

    if (topLevel === null) topLevel = name.split('/')[0];
    const relative = name.startsWith(topLevel + '/') ? name.slice(topLevel.length + 1) : name;

    // Only extract the skill/ subfolder from the tarball.
    if (!relative.startsWith('skill/')) {
      pos += Math.ceil(size / 512) * 512;
      continue;
    }
    const out = path.join(destRoot, relative.slice('skill/'.length));
    if (type === '5' || relative.endsWith('/')) {
      fs.mkdirSync(out, { recursive: true });
    } else if (type === '0' || type === '') {
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, raw.slice(pos, pos + size));
    }
    pos += Math.ceil(size / 512) * 512;
  }
  if (!topLevel) {
    throw new Error('Tarball appears empty or malformed — nothing extracted.');
  }
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------
async function cmdInit(flags) {
  const target = resolveTarget(flags);
  console.log(`${bold('Thoth')} ${dim('v' + VERSION)}`);
  console.log(`Installing to ${cyan(target)}`);

  if (fs.existsSync(target) && !flags.force) {
    console.log(yellow(`\n  ${target} already exists.`));
    console.log(`  Re-run with ${bold('--force')} to overwrite, or use ${bold('thoth update')}.`);
    process.exit(1);
  }

  fs.mkdirSync(target, { recursive: true });

  if (flags.offline) {
    // Use bundled assets shipped inside the npm package.
    const bundled = path.join(__dirname, '..', 'assets', 'skill');
    if (!fs.existsSync(bundled)) {
      fail('Offline mode requested but no bundled assets found at ' + bundled);
    }
    copyRecursive(bundled, target);
    console.log(green('\n  ✓ Installed from bundled assets.'));
  } else {
    console.log(dim('  fetching latest release from GitHub…'));
    const { tag, tarball } = await fetchLatestRelease();
    console.log(dim(`  release: ${tag}`));
    const buf = await httpGet(tarball);
    untarGz(buf, target);
    console.log(green(`\n  ✓ Installed ${tag}.`));
  }

  console.log(`\n${bold('Quick start:')}`);
  console.log(`  ${cyan('/thoth <your-name>')}    activate / create your persona`);
  console.log(`  ${cyan('/thoth onboard')}        run the 20-min interview`);
  console.log(`  ${cyan('/thoth')}                generate your first post`);
  console.log(`  ${cyan('/thoth help')}           full command list\n`);
}

function cmdUninstall(flags) {
  const target = resolveTarget(flags);
  if (!fs.existsSync(target)) {
    console.log(yellow(`Nothing installed at ${target}.`));
    return;
  }
  const hasPersonas = fs.existsSync(path.join(target, 'personas')) &&
    fs.readdirSync(path.join(target, 'personas')).some((n) => n !== 'README.md' && n !== '.active');
  if (hasPersonas && !flags.force) {
    console.log(yellow(`\n  Personas detected at ${target}/personas/.`));
    console.log(`  These contain your voice data and post history.`);
    console.log(`  Re-run with ${bold('--force')} to wipe them, or copy ${cyan(path.join(target, 'personas'))} out first.\n`);
    process.exit(1);
  }
  rmRecursive(target);
  console.log(green(`\n  ✓ Removed ${target}.`));
}

async function cmdUpdate(flags) {
  const target = resolveTarget(flags);
  if (!fs.existsSync(target)) {
    console.log(yellow(`No existing install at ${target}. Run ${bold('thoth init')} first.`));
    return;
  }
  // Preserve personas/ across update.
  const personasSrc = path.join(target, 'personas');
  const personasBackup = path.join(os.tmpdir(), `thoth-personas-${Date.now()}`);
  let hasPersonas = false;
  if (fs.existsSync(personasSrc)) {
    copyRecursive(personasSrc, personasBackup);
    hasPersonas = true;
  }
  rmRecursive(target);
  await cmdInit({ ...flags, force: true });
  if (hasPersonas) {
    rmRecursive(path.join(target, 'personas'));
    copyRecursive(personasBackup, path.join(target, 'personas'));
    rmRecursive(personasBackup);
    console.log(green('  ✓ Preserved your personas/ folder.'));
  }
}

async function cmdVersions() {
  const url = `https://api.github.com/repos/${REPO}/releases`;
  try {
    const buf = await httpGet(url);
    const list = JSON.parse(buf.toString('utf8'));
    if (!list.length) {
      console.log(dim('No releases published yet.'));
      return;
    }
    console.log(bold('Available versions:'));
    for (const r of list.slice(0, 10)) {
      const tag = r.tag_name;
      const date = (r.published_at || '').slice(0, 10);
      console.log(`  ${cyan(tag.padEnd(10))} ${dim(date)}  ${r.name || ''}`);
    }
  } catch (e) {
    fail(`Couldn't reach GitHub: ${e.message}`);
  }
}

function cmdList(flags) {
  // Scan all known install roots for installed thoth folders.
  const roots = [];
  for (const subdir of Object.values(SKILL_DIR_MAP)) {
    roots.push(path.join(os.homedir(), subdir, SKILL_NAME));
    roots.push(path.join(process.cwd(), subdir, SKILL_NAME));
  }
  const found = roots.filter((p) => fs.existsSync(path.join(p, 'SKILL.md')));
  if (!found.length) {
    console.log(dim('No Thoth installs detected.'));
    return;
  }
  console.log(bold('Thoth installs:'));
  for (const p of found) {
    const personasDir = path.join(p, 'personas');
    const personas = fs.existsSync(personasDir)
      ? fs.readdirSync(personasDir).filter((n) => n !== '.active' && n !== 'README.md' && !n.startsWith('.'))
      : [];
    console.log(`  ${cyan(p)}`);
    console.log(`    personas: ${personas.length ? personas.join(', ') : dim('(none yet)')}`);
  }
}

function cmdHelp() {
  console.log(`
${bold('Thoth')} ${dim('v' + VERSION)}  ${dim('— open-source LinkedIn voice skill for Claude')}

${bold('Usage:')}
  ${cyan('npx thoth-skill <command> [options]')}

${bold('Commands:')}
  ${cyan('init')}                   Install the skill (default: ~/.claude/skills/thoth)
  ${cyan('update')}                 Pull the latest release, preserving your personas/
  ${cyan('uninstall')}              Remove the skill (prompts if personas/ exist)
  ${cyan('versions')}               List released versions
  ${cyan('list')}                   Show where Thoth is installed and which personas exist
  ${cyan('help')}                   Print this message

${bold('Options for init / update / uninstall:')}
  ${cyan('--ai <target>')}          claude (default) | cursor | windsurf
  ${cyan('--local')}                Install to the current project (./<ai-dir>/skills/thoth)
                          instead of the user home directory
  ${cyan('--offline')}              Use the assets bundled in the npm package
                          (no GitHub fetch). Useful on air-gapped machines.
  ${cyan('--force')}                Overwrite existing install / wipe personas on uninstall

${bold('Examples:')}
  ${dim('# simplest install (user-global)')}
  ${cyan('npx thoth-skill init')}

  ${dim('# install into the current project only')}
  ${cyan('npx thoth-skill init --local')}

  ${dim('# install into Cursor')}
  ${cyan('npx thoth-skill init --ai cursor')}

  ${dim('# update, keeping your personas')}
  ${cyan('npx thoth-skill update')}

${bold('Docs:')} https://github.com/${REPO}
`);
}

// ---------------------------------------------------------------------------
// FS helpers (no deps)
// ---------------------------------------------------------------------------
function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dst, entry));
    }
  } else {
    fs.copyFileSync(src, dst);
  }
}

function rmRecursive(p) {
  if (!fs.existsSync(p)) return;
  if (fs.rmSync) {
    fs.rmSync(p, { recursive: true, force: true });
  } else {
    // Node < 14 fallback — not strictly needed since engines>=18.
    execFileSync('rm', ['-rf', p]);
  }
}

function fail(msg) {
  console.error(red('Error: ') + msg);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
(async function main() {
  const { cmd, flags } = parseArgs(process.argv);
  try {
    switch (cmd) {
      case 'init':
      case 'install':
        await cmdInit(flags);
        break;
      case 'uninstall':
      case 'remove':
        cmdUninstall(flags);
        break;
      case 'update':
      case 'upgrade':
        await cmdUpdate(flags);
        break;
      case 'versions':
        await cmdVersions();
        break;
      case 'list':
        cmdList(flags);
        break;
      case '--version':
      case '-v':
      case 'version':
        console.log(VERSION);
        break;
      case 'help':
      case '--help':
      case '-h':
      default:
        cmdHelp();
    }
  } catch (e) {
    fail(e.stack || e.message || String(e));
  }
})();
