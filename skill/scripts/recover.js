#!/usr/bin/env node
/**
 * Thoth persona recovery script.
 *
 * Scans Claude Code session JSONL files for persona content that was
 * read or written by past sessions, and restores it to the current data root.
 *
 * Use this when persona data has been lost — e.g. after a v1.0.x → v1.1.x
 * upgrade via `amskills update`, which replaces the skill folder wholesale
 * without preserving personas inside it.
 *
 * Invoked by `/thoth recover` in SKILL.md. Cross-platform; needs only Node.
 *
 * Usage:
 *   node recover.js                  # interactive: scan, list, prompt to apply
 *   node recover.js --apply          # scan + write recovered files
 *   node recover.js --target <dir>   # override the data root (default: ~/.thoth)
 *   node recover.js --dry-run        # scan + list, never write
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const SESSION_DIRS = [
  path.join(os.homedir(), '.claude/projects'),
];

const PERSONA_FILES = [
  'persona.md',
  'last-post.md',
  'history.yaml',
  'topics.md',
  'sources.yaml',
  'recent.md',
  'launch-campaign-drafts.md',
  'launch-calendar.md',
  'next-batch-drafts.md',
  'voice-samples.md',
  'schedule.txt',
];

function parseArgs(argv) {
  const flags = { apply: false, dryRun: false, target: path.join(os.homedir(), '.thoth') };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--apply') flags.apply = true;
    else if (a === '--dry-run') flags.dryRun = true;
    else if (a === '--target') flags.target = argv[++i];
    else if (a === '--help' || a === '-h') flags.help = true;
  }
  return flags;
}

function findJsonl(roots) {
  const found = [];
  function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch { return; }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && p.endsWith('.jsonl')) found.push(p);
    }
  }
  for (const r of roots) walk(r);
  return found;
}

function stripLineNumbers(text) {
  // Read tool output prefixes every line with '   123\t'. Strip it.
  return text.replace(/^\s*\d+\t/gm, '');
}

function classifyPath(filePath) {
  // Match .../personas/<persona>/<filename>. Return [persona, filename] or null.
  const m = filePath.match(/\/personas\/([a-z0-9-]+)\/([^/]+)$/);
  if (!m) return null;
  const [, persona, fname] = m;
  if (!PERSONA_FILES.includes(fname)) return null;
  return [persona, fname];
}

function scanJsonl(jsonlPath, captures) {
  let raw;
  try { raw = fs.readFileSync(jsonlPath, 'utf8'); }
  catch { return; }

  const toolUseToPath = new Map();
  const lines = raw.split('\n');

  for (const line of lines) {
    if (!line) continue;
    let rec;
    try { rec = JSON.parse(line); } catch { continue; }
    if (rec.type !== 'assistant') continue;
    const msg = rec.message;
    if (!msg || !Array.isArray(msg.content)) continue;
    for (const block of msg.content) {
      if (block.type !== 'tool_use') continue;
      const tname = block.name;
      const input = block.input || {};
      const fp = input.file_path;
      if (!fp) continue;
      const cls = classifyPath(fp);
      if (!cls) continue;
      const [persona, fname] = cls;

      if (tname === 'Read') {
        toolUseToPath.set(block.id, fp);
      } else if (tname === 'Write') {
        const ts = rec.timestamp || '';
        const content = input.content || '';
        if (content) {
          recordCapture(captures, persona, fname, ts, content, jsonlPath, 'Write');
        }
      } else if (tname === 'Edit') {
        const ts = rec.timestamp || '';
        recordEdit(captures, persona, fname, ts, input.old_string || '', input.new_string || '', jsonlPath);
      }
    }
  }

  // Now collect Read tool results
  for (const line of lines) {
    if (!line) continue;
    let rec;
    try { rec = JSON.parse(line); } catch { continue; }
    if (rec.type !== 'user') continue;
    const msg = rec.message;
    if (!msg || !Array.isArray(msg.content)) continue;
    const ts = rec.timestamp || '';
    for (const block of msg.content) {
      if (block.type !== 'tool_result') continue;
      if (block.is_error) continue;
      const fp = toolUseToPath.get(block.tool_use_id);
      if (!fp) continue;
      const cls = classifyPath(fp);
      if (!cls) continue;
      const [persona, fname] = cls;
      let text;
      if (Array.isArray(block.content)) {
        text = block.content.filter(b => b.type === 'text').map(b => b.text || '').join('');
      } else if (typeof block.content === 'string') {
        text = block.content;
      } else continue;
      if (!text) continue;
      recordCapture(captures, persona, fname, ts, stripLineNumbers(text), jsonlPath, 'Read');
    }
  }
}

function recordCapture(captures, persona, fname, ts, content, src, kind) {
  const key = `${persona}/${fname}`;
  const existing = captures.get(key);
  // Prefer Write captures (exact content) over Read (may have line-prefix artifacts).
  // Otherwise prefer most recent.
  if (!existing) {
    captures.set(key, { ts, content, src, kind, edits: [] });
    return;
  }
  if (kind === 'Write' && existing.kind === 'Read') {
    captures.set(key, { ts, content, src, kind, edits: [] });
  } else if (kind === existing.kind && ts > existing.ts) {
    captures.set(key, { ...captures.get(key), ts, content, src });
  }
}

function recordEdit(captures, persona, fname, ts, oldStr, newStr, src) {
  const key = `${persona}/${fname}`;
  const existing = captures.get(key);
  if (!existing) {
    captures.set(key, { ts: '', content: null, src, kind: 'EditOnly', edits: [{ ts, oldStr, newStr }] });
    return;
  }
  existing.edits.push({ ts, oldStr, newStr });
}

function applyEdits(content, edits, baseTs) {
  // Apply edits that occurred AFTER the base content was written, in order.
  const sorted = edits.filter(e => e.ts > baseTs).sort((a, b) => a.ts.localeCompare(b.ts));
  let final = content;
  for (const e of sorted) {
    if (e.oldStr && final.includes(e.oldStr)) {
      final = final.replace(e.oldStr, e.newStr);
    }
  }
  return { content: final, applied: sorted.length };
}

function prompt(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(q, ans => { rl.close(); resolve(ans.trim()); }));
}

async function main() {
  const flags = parseArgs(process.argv);
  if (flags.help) {
    console.log(`Usage: node recover.js [--apply] [--dry-run] [--target <dir>]`);
    process.exit(0);
  }

  console.log(`Thoth persona recovery`);
  console.log(`  scan roots: ${SESSION_DIRS.join(', ')}`);
  console.log(`  target:     ${flags.target}/personas/`);

  const jsonls = findJsonl(SESSION_DIRS);
  console.log(`  scanning ${jsonls.length} session files…\n`);

  const captures = new Map();
  for (const f of jsonls) scanJsonl(f, captures);

  if (captures.size === 0) {
    console.log(`No persona content found in session logs.`);
    process.exit(0);
  }

  console.log(`Found ${captures.size} recoverable file(s):\n`);
  const sortedKeys = [...captures.keys()].sort();
  const toWrite = [];
  for (const key of sortedKeys) {
    const entry = captures.get(key);
    if (entry.content === null) {
      console.log(`  ⚠ ${key.padEnd(50)} edits-only (no base content found)`);
      continue;
    }
    const { content: final, applied } = applyEdits(entry.content, entry.edits, entry.ts);
    const editNote = applied > 0 ? `  +${applied} edits` : '';
    console.log(`  ✓ ${key.padEnd(50)} ${String(final.length).padStart(7)} B  ${entry.kind}${editNote}`);
    toWrite.push({ key, final });
  }

  if (flags.dryRun) {
    console.log(`\n(dry-run: nothing written)`);
    return;
  }

  let shouldWrite = flags.apply;
  if (!shouldWrite) {
    const a = await prompt(`\nWrite these ${toWrite.length} file(s) to ${flags.target}/personas/? (yes/no) `);
    shouldWrite = /^y/i.test(a);
  }
  if (!shouldWrite) {
    console.log(`Cancelled.`);
    return;
  }

  for (const { key, final } of toWrite) {
    const [persona, fname] = key.split('/');
    const outDir = path.join(flags.target, 'personas', persona);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, fname);
    if (fs.existsSync(outPath)) {
      const existing = fs.readFileSync(outPath, 'utf8');
      if (existing.length >= final.length) {
        console.log(`  skip  ${key} (existing file is at least as large)`);
        continue;
      }
    }
    fs.writeFileSync(outPath, final);
  }

  // Set .active if a persona was recovered and .active doesn't exist
  const activePath = path.join(flags.target, 'personas', '.active');
  if (!fs.existsSync(activePath)) {
    const personas = [...new Set(sortedKeys.map(k => k.split('/')[0]))];
    if (personas.length === 1) {
      fs.writeFileSync(activePath, personas[0] + '\n');
    } else if (personas.length > 1) {
      const a = await prompt(`\nWhich persona should be active? (${personas.join(' / ')}) `);
      if (personas.includes(a)) {
        fs.writeFileSync(activePath, a + '\n');
      }
    }
  }

  console.log(`\n✓ Recovery complete. Persona data is at ${flags.target}/personas/.`);
}

main().catch(e => { console.error(e); process.exit(1); });
