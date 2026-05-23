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
// Pre-install: rescue legacy persona data from inside the skill folder.
// v1.1+ stores persona data at ~/.thoth/ (outside the skill folder), but
// earlier versions kept it inside the skill at <target>/personas/. A reinstall
// or update would destroy it — so move it out before touching the target.
function rescueLegacyPersonas(target) {
  const legacy = path.join(target, 'personas');
  const newRoot = path.join(os.homedir(), '.thoth');
  const newPersonas = path.join(newRoot, 'personas');

  if (!fs.existsSync(legacy)) return;
  if (fs.existsSync(newPersonas)) return; // already migrated, leave legacy alone

  // Heuristic: any subdirectory under personas/ is user data (vs. README.md / .active).
  const entries = fs.readdirSync(legacy, { withFileTypes: true });
  const hasUserData = entries.some((e) => e.isDirectory());
  if (!hasUserData) return;

  console.log(yellow(`  found legacy persona data at ${legacy}`));
  console.log(`  migrating to ${cyan(newPersonas)} before reinstall…`);
  fs.mkdirSync(newRoot, { recursive: true });
  fs.renameSync(legacy, newPersonas);
  console.log(green(`  ✓ migrated.\n`));
}

async function cmdInit(flags) {
  const target = resolveTarget(flags);
  console.log(`${bold('Thoth')} ${dim('v' + VERSION)}`);
  console.log(`Installing to ${cyan(target)}`);

  rescueLegacyPersonas(target);

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
  // v1.0.x personas-in-skill safety: warn if there's still user data inside
  // the skill folder (shouldn't happen after a normal upgrade, but possible
  // if the user installed v1.0.x and never invoked Thoth on v1.1+).
  const inSkillPersonas = path.join(target, 'personas');
  const hasUserDataInSkill = fs.existsSync(inSkillPersonas) &&
    fs.readdirSync(inSkillPersonas, { withFileTypes: true }).some((e) => e.isDirectory());
  if (hasUserDataInSkill && !flags.force) {
    console.log(yellow(`\n  Legacy persona data detected inside the skill at ${inSkillPersonas}.`));
    console.log(`  v1.1+ stores persona data at ${cyan('~/.thoth/personas/')} (outside the skill).`);
    console.log(`  Run ${bold('thoth update')} first to migrate it, then re-run uninstall.`);
    console.log(`  Or pass ${bold('--force')} to wipe the legacy data anyway.\n`);
    process.exit(1);
  }
  rmRecursive(target);
  const newRootPersonas = path.join(os.homedir(), '.thoth', 'personas');
  if (fs.existsSync(newRootPersonas)) {
    console.log(green(`\n  ✓ Removed ${target}.`));
    console.log(dim(`  Your persona data at ${newRootPersonas} was not touched. Delete it manually if you also want that gone.`));
  } else {
    console.log(green(`\n  ✓ Removed ${target}.`));
  }
}

async function cmdUpdate(flags) {
  const target = resolveTarget(flags);
  if (!fs.existsSync(target)) {
    console.log(yellow(`No existing install at ${target}. Run ${bold('thoth init')} first.`));
    return;
  }
  // v1.1+ stores persona data outside the skill folder (~/.thoth/), so
  // ordinary updates do not need to preserve anything inside the skill.
  // rescueLegacyPersonas (called from cmdInit) handles the one-time migration
  // for users still on v1.0.x at update time.
  rmRecursive(target);
  await cmdInit({ ...flags, force: true });
  console.log(green('  ✓ Update complete. Your persona data at ~/.thoth/ was untouched.'));
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
    console.log(`  ${cyan(p)}`);
  }
  // Resolve the data root (per the rules in SKILL.md) and list personas there.
  const localData = path.join(process.cwd(), '.thoth', 'personas');
  const homeData = path.join(os.homedir(), '.thoth', 'personas');
  const legacy = found.map((p) => path.join(p, 'personas')).find((p) =>
    fs.existsSync(p) && fs.readdirSync(p, { withFileTypes: true }).some((e) => e.isDirectory())
  );
  let dataRoot = null;
  if (fs.existsSync(localData)) dataRoot = localData;
  else if (fs.existsSync(homeData)) dataRoot = homeData;
  else if (legacy) dataRoot = legacy;

  console.log();
  if (!dataRoot) {
    console.log(`${bold('Personas:')} ${dim('(none yet — run `/thoth <your-name>` in Claude to create one)')}`);
    return;
  }
  const personas = fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory()).map((e) => e.name);
  let active = '';
  const activePath = path.join(dataRoot, '.active');
  if (fs.existsSync(activePath)) active = fs.readFileSync(activePath, 'utf8').trim();
  console.log(`${bold('Personas')} ${dim(`(data root: ${dataRoot})`)}`);
  for (const p of personas) {
    const marker = p === active ? green(' *') : '';
    console.log(`  ${cyan(p)}${marker}`);
  }
  if (active) console.log(`  ${dim('* = active')}`);
}

function cmdHelp() {
  console.log(`
${bold('Thoth')} ${dim('v' + VERSION)}  ${dim('— open-source LinkedIn voice skill for Claude')}

${bold('Usage:')}
  ${cyan('npx thoth-skill <command> [options]')}

${bold('Commands:')}
  ${cyan('init')}                   Install the skill (default: ~/.claude/skills/thoth)
  ${cyan('update')}                 Pull the latest release (persona data at ~/.thoth/ is untouched)
  ${cyan('uninstall')}              Remove the skill (persona data at ~/.thoth/ is kept)
  ${cyan('versions')}               List released versions
  ${cyan('list')}                   Show where Thoth is installed and which personas exist
  ${cyan('help')}                   Print this message

${bold('Options for init / update / uninstall:')}
  ${cyan('--ai <target>')}          claude (default) | cursor | windsurf
  ${cyan('--local')}                Install to the current project (./<ai-dir>/skills/thoth)
                          instead of the user home directory
  ${cyan('--offline')}              Use the assets bundled in the npm package
                          (no GitHub fetch). Useful on air-gapped machines.
  ${cyan('--force')}                Overwrite existing install / ignore legacy persona warnings

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
