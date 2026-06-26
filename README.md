# Thoth

[![Release](https://img.shields.io/github/v/release/NirvanaGuha/thoth?style=for-the-badge&color=blue)](https://github.com/NirvanaGuha/thoth/releases)
[![12 Archetypes](https://img.shields.io/badge/archetypes-12-purple?style=for-the-badge)](./skill/references/brand-archetypes.md)
[![4-D Tone Model](https://img.shields.io/badge/tone_model-NN%2Fg-green?style=for-the-badge)](./skill/references/tone-spectrum.md)
[![License](https://img.shields.io/github/license/NirvanaGuha/thoth?style=for-the-badge&color=green)](./LICENSE)

[![npm](https://img.shields.io/npm/v/thoth-skill?style=flat-square&logo=npm&label=CLI)](https://www.npmjs.com/package/thoth-skill)
[![npm downloads](https://img.shields.io/npm/dm/thoth-skill?style=flat-square&label=downloads)](https://www.npmjs.com/package/thoth-skill)
[![GitHub stars](https://img.shields.io/github/stars/NirvanaGuha/thoth?style=flat-square&logo=github)](https://github.com/NirvanaGuha/thoth/stargazers)

**An open-source Claude skill that builds a unique, consistent LinkedIn voice — for yourself, or for your whole team.**

Thoth runs a 20-minute framework-driven interview, pins your voice to proven personality models (Jungian brand archetypes + the Nielsen Norman 4-D tone-of-voice model + contrarian-belief elicitation), and generates ready-to-publish LinkedIn posts across a balanced content mix — each paired with a matching animated infographic. Copy-ready, and yours to publish — Thoth never posts on your behalf.

Named after the Egyptian god of writing, who weighed hearts against the feather of truth. Thoth the skill weighs every draft against your persona and refuses to ship anything that doesn't sound like you.

---

## What's new in v1.6

- **Enneagram onboarding.** The interview now captures your Enneagram — upload or paste your test results (Truity, Enneagram Institute, Crystal, 16Personalities-style) and Thoth pulls out the type, wing, subtype, and core motivation/fear, then translates them into a concrete voice instruction. No test? A 90-second mini-assessment fills in, or skip it. The result grounds your voice in *why* you write, not just how you sound.
- **Infographics, now hands-free.** `/thoth` analyzes each post, picks the best-fit template, and renders the GIF in the same turn as the text — no extra prompt, no waiting. Opt out with `--no-image`.
- **Smarter template picks.** Killed the `grid-card` over-bias — the generator now rules out order, comparison, number/trend, and structure shapes before falling back to the N×2 grid, and varies templates across posts.

## What's new in v1.5

- **Animated infographics.** Every post now ships with a matching animated GIF (portrait 1080×1350, inside LinkedIn's <5MB / <400-frame envelope). `/thoth` auto-attaches one; opt out with `--no-image`. Pass a `.png` output for a static frame.
- **14-template library.** stat, line-chart, bar-chart, comparison, steps, flowchart, cycle, timeline, layers, funnel, venn, matrix, spectrum, grid — the generator auto-picks the best fit from the post's point of view (a number → stat, a trend → line-chart, a contrast → bar-chart, depth → layers, …).
- **Auto-derived brand.** `/thoth brand` now derives a persona's colours, 5-swatch palette, fonts, and card style from their archetype + tone — no interview. `/thoth brand setup` is the explicit-colour override.
- **Renderer pipeline.** `puppeteer-core` + your system Chrome (no Chromium download); GSAP timelines are captured frame-by-frame and encoded with `gifski` (or an `ffmpeg` fallback). First run installs deps into `~/.thoth/cache/`.
- **Coming next:** document/PDF posts and native image carousels — same renderer; the framework catalog already gives us slide structure for free.

See [CHANGELOG.md](./CHANGELOG.md) for the full release history.

---

## What Thoth actually does

```
+-----------------------------------------------------------------------------+
|  /thoth onboard                                                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  20-MINUTE INTERVIEW                                                        |
|     Section 1 - Role & Audience           2 min                             |
|     Section 2 - Archetype pinning         6 min   (12 archetypes)           |
|     Section 3 - Enneagram profile         3 min   (optional, upload test)   |
|     Section 4 - Tone calibration          4 min   (4-D spectrum)            |
|     Section 5 - Hot takes & anti-voice    6 min                             |
|     Section 6 - Pillar topics             4 min                             |
|     Section 7 - Handoffs & preferences    2 min                             |
|                                                                             |
|  OUTPUT: personas/<you>/persona.md                                          |
|     archetype.dominant:   sage                                              |
|     archetype.secondary:  creator                                           |
|     enneagram.type:       5  (Investigator, 5w4, sp)                        |
|     enneagram.voice_implications: "depth + evidence, pull reader in"        |
|     tone.formal_casual:               3                                     |
|     tone.serious_funny:               2                                     |
|     tone.respectful_irreverent:       3                                     |
|     tone.matter_of_fact_enthusiastic: 2                                     |
|     anti_voice:                                                             |
|       - "Posts that start with 'Excited to share...'"                       |
|       - "Humble-brags disguised as lessons"                                 |
|     contrarian_beliefs:                                                     |
|       - belief: "Open rate is the wrong metric for push"                    |
|         support: "We've seen 4x retention from non-openers"                 |
|         would_change_mind: "Better attribution disproving recall value"     |
|     pillar_topics:                                                          |
|       - push notification strategy                                          |
|       - frontend engineering for visual canvases                            |
|       - lifecycle marketing automation                                      |
|                                                                             |
+-----------------------------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------------------------+
|  /thoth                                                                     |
+-----------------------------------------------------------------------------+
|  Picks next post type using 30/25/20/15/10 ratio gap                        |
|  Pulls from pillar topics + recent inputs + (optional) git themes           |
|  Drafts in your voice via story-arc + post-type frameworks                  |
|  Runs voice-check against your archetype, tone targets, and anti-voice      |
|  Outputs copy-ready LinkedIn post text                                      |
+-----------------------------------------------------------------------------+
```

---

## The content mix

Thoth rotates across five post types over a rolling 20-post window:

| % | Type | Purpose |
|---|---|---|
| **30%** | **Personal** | Humanizes you. Earns the right to post about work. |
| **25%** | **Work** | Shows what you actually do. Credibility by demonstration. |
| **20%** | **Thought-leadership** | Your takes. Contrarian beliefs grounded in experience. |
| **15%** | **Educational** | Pure teaching. "Here's how X works." |
| **10%** | **Promotional** | Direct product / service / case study promotion. |

The mix is enforced automatically. `/thoth calendar` shows your actual ratio vs. targets and tells you what's next.

---

## The 12 archetypes (dominant + secondary)

| # | Archetype | Signature on LinkedIn |
|---|---|---|
| 1 | Hero | Triumph over a specific, named challenge |
| 2 | Outlaw | Contrarian takes on industry orthodoxy |
| 3 | Magician | Reveals the invisible mechanism — "here's the trick" |
| 4 | Everyman | Plainspoken, relatable, honest about what's hard |
| 5 | Lover | Warm, sensory, writes about what they love |
| 6 | Jester | Makes a serious point by refusing to be serious |
| 7 | Caregiver | Service-oriented, writes to help |
| 8 | Creator | Obsessed with craft, shows the iterative work |
| 9 | Ruler | Strategic, systems-minded, accountable authority |
| 10 | Innocent | Quiet wonder, unguarded, optimistic without naivety |
| 11 | Sage | Analytical, cites evidence, slow before confident |
| 12 | Explorer | Writes from the road — curiosity, pattern-spotting |

Onboarding pins one **dominant** archetype (≈70% of your voice) and a **secondary** (shades the remaining ≈30%). Thoth always picks from two different orientations so the voice has dimension.

Full archetype guide: [skill/references/brand-archetypes.md](./skill/references/brand-archetypes.md)

---

## The 4-D tone spectrum (Nielsen Norman)

```
    Formal  <---------------->  Casual
   Serious  <---------------->  Funny
Respectful  <---------------->  Irreverent
   Matter-  <---------------->  Enthusiastic
  of-fact
```

Each axis is a 1–5 target. You can set drift rules per post type (e.g. "+1 casual on Personal posts"). Thoth scores every draft against your targets and rewrites before emitting if any axis drifts ±2 or more.

Full model: [skill/references/tone-spectrum.md](./skill/references/tone-spectrum.md)

---

## Installation

### Option 1 — One-line installer (fastest, no Node required)

```sh
curl -fsSL https://raw.githubusercontent.com/NirvanaGuha/thoth/main/install.sh | bash
```

Installs to `~/.claude/skills/thoth/`. Respects these env vars:

```sh
THOTH_AI=codex      THOTH_SCOPE=local     THOTH_REF=v1.5.0
```
`THOTH_AI` accepts `claude` (default), `cursor`, `windsurf`, or `codex` (→ `~/.codex/skills/thoth`).

### Option 2 — npx (recommended for Node users)

```sh
npx thoth-skill init                   # default: user-global, Claude
npx thoth-skill init --local           # project-local (./.claude/skills/thoth)
npx thoth-skill init --ai cursor       # Cursor
npx thoth-skill init --ai codex        # OpenAI Codex (→ ~/.codex/skills/thoth)
npx thoth-skill update                 # pull latest — your personas in ~/.thoth/ are untouched
npx thoth-skill uninstall              # remove the skill — your personas in ~/.thoth/ are kept
```

Or install the CLI globally:

```sh
npm install -g thoth-skill
thoth init
```

### Option 3 — Claude plugin marketplace (Claude Code)

```
/plugin marketplace add NirvanaGuha/thoth
/plugin install thoth@thoth
```

### Option 4 — Manual

```sh
git clone https://github.com/NirvanaGuha/thoth.git
cp -r thoth/skill ~/.claude/skills/thoth
```

Works with Claude Code, Claude Desktop, Cowork, Cursor, Windsurf, and OpenAI Codex — anywhere that supports standard `.claude/skills/`-style skills.

---

## Quick start

After installing, in Claude:

```
/thoth <your-name>     # activate and scaffold your persona folder
/thoth onboard         # run the 20-minute interview
/thoth                 # generate your first post
/thoth daily           # one-shot "what happened today?" flow
/thoth schedule 08:30  # automate the daily flow at 8:30 local
/thoth help            # full command list
```

### All commands

| Command | What it does |
|---|---|
| `/thoth help` | Show the command list. |
| `/thoth <name>` | Activate a persona. Subsequent commands run for this user. |
| `/thoth onboard [name]` | Run the 20-min persona interview. |
| `/thoth` | Generate a post (ratio-aware post-type selection). |
| `/thoth <type>` | Force a post type (`personal`, `work`, `thought-leadership`, `educational`, `promotional`). |
| `/thoth daily` | One-shot daily flow: ask what's new, draft today's post. |
| `/thoth regenerate [feedback]` | Redraft the last post, optionally with steering. |
| `/thoth calendar` | Show the ratio tracker — actual vs. target, what's next. |
| `/thoth edit` | Edit the active persona. |
| `/thoth list` | Show all personas on this install. |
| `/thoth connect git <path>` | Add a local repo as a POV source (abstract themes only, strict redaction). |
| `/thoth disconnect git <path>` | Remove a git source. |
| `/thoth schedule [HH:MM]` | Set up a recurring daily run that writes a draft to `~/.thoth/inbox/` and pings you with a system notification. Default 08:30 local. |
| `/thoth unschedule` | Cancel the recurring schedule. |
| `/thoth inbox` | List pending-review drafts from scheduled runs. `/thoth inbox <date>` opens one; `accept` / `reject` / `regenerate` decides its fate. Drafts only count toward your content-mix ratio after you accept them. |
| `/thoth image [<date>] [--variant <name>]` | Render the post as an animated GIF (portrait 1080×1350, inside LinkedIn's animation envelope). Auto-picks the best-fit template from 14 by the post's POV; override with `--variant`, or pass a `.png` output for a static frame. Brand-aware (uses your persona's `brand.yaml`). |
| `/thoth brand` | View the active persona's visual identity (auto-derived from their archetype + tone on first use). `/thoth brand setup` walks the explicit interview to set colours, font, handle by hand. |
| `/thoth recover` | Restore personas from past Claude session logs after an upgrade wiped your data. |
| `/thoth update` | Check for a newer Thoth release and upgrade in place. Persona data is not touched. |
| `/thoth version` | Print the installed Thoth version and where the skill + data live. |
| `/thoth frameworks` | Browse the framework catalog (20 frameworks × 5 post types) and the 13-pattern hook library. `/thoth frameworks <name>` for a single framework's full spec. |

---

## Example prompts

```
/thoth nirvana                         # activate Nirvana's persona
/thoth                                 # draft a post, ratio-aware

/thoth regenerate shorter, less corporate, add a question at the end

/thoth thought-leadership              # force a Thought-leadership post

/thoth daily                           # "anything interesting today?" flow

/thoth calendar                        # see where you're light on post types
```

### What `/thoth calendar` looks like

```
Thoth — content calendar for nirvana
Window: last 20 posts

Target    Actual   Type                       Status
30%       32%      Personal                   on target
25%       21%      Work                       slightly under
20%       25%      Thought-leadership         overrepresented
15%       12%      Educational                slightly under
10%        5%      Promotional                underrepresented

Next up: Promotional — 5% behind target.
```

---

## Multi-user support (teams / agencies)

A single install supports any number of personas. Families, teams, and agencies can share one Thoth with a persona per person:

```
/thoth nirvana        # switch to Nirvana's voice
/thoth                # draft for Nirvana

/thoth rakesh         # switch to Rakesh
/thoth                # draft for Rakesh
```

Personas live at `~/.thoth/personas/<name>/` — each has its own voice file, pillar topics, post history, and recent inputs. The active persona is stored in `~/.thoth/personas/.active`. For per-project setups (e.g. a team checking personas into a repo), create `./.thoth/` in the project root and Thoth will use it instead.

> **Note:** persona data lives **outside** the skill folder (`~/.claude/skills/thoth/`) so you can grant blanket read/write to your persona data without exposing Claude's own config files. If you're upgrading from a pre-v1.1 install, the first `/thoth ...` command after upgrade will offer to migrate your existing personas from the old location.

---

## Git as a POV source (optional, strictly sandboxed)

`/thoth connect git <path>` lets Thoth read a local repo's commit history **to understand what you're working on** — for topic and voice seeding. Hard rules:

- Never names the repository.
- Never quotes code, file paths, variable names, or commit messages verbatim.
- Never promotes the product being built.
- Skips commits touching auth, credentials, or security.
- Runs a 5-check redaction pass before emitting any post that touched git context.

Full rules: [skill/references/git-safety.md](./skill/references/git-safety.md). The constraint is the feature — your LinkedIn voice stays yours, not an extended ad for your employer's roadmap.

---

## How it works

```
┌────────────────────────────────────────────────────────────┐
│  1. ACTIVATE                                               │
│     /thoth <name> → personas/.active ← <name>              │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│  2. PICK POST TYPE                                         │
│     Read history.yaml → compute 20-post ratio gap          │
│     Select type with largest negative gap                  │
│     Respect recency: never pick the same type twice        │
│     in a row unless gap > 10pp                             │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│  3. SELECT TOPIC                                           │
│     Rotate through pillar_topics                           │
│     Weight today's recent.md entries heavily               │
│     (if connected) synthesize git log into abstract        │
│     themes — NEVER repo names, paths, or code              │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│  4. DRAFT                                                  │
│     Apply archetype + tone targets                         │
│     Apply post-type template + story arc                   │
│     (classic / frame-break / quiet-reveal)                 │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│  5. VOICE CHECK (mandatory before emit)                    │
│     ✓ sounds like dominant archetype + secondary           │
│     ✓ all 4 tone axes within ±1 of target                  │
│     ✓ no opener clichés                                    │
│     ✓ at least one concrete detail                         │
│     ✓ no matches against anti_voice patterns               │
│     ✓ length in type's Min–Max window                      │
│     ✓ if git-seeded: redaction check passes                │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│  6. EMIT + LOG                                             │
│     Output copy-ready text                                 │
│     Append to history.yaml                                 │
│     Save to last-post.md for /thoth regenerate             │
└────────────────────────────────────────────────────────────┘
```

---

## Repository layout

```
thoth/
├── .claude-plugin/              # Plugin marketplace metadata
│   └── plugin.json
├── .github/workflows/           # CI (publishes CLI on release)
│   └── publish.yml
├── cli/                         # npm package (thoth-skill CLI)
│   ├── package.json
│   ├── bin/thoth.js             # zero-deps installer
│   ├── assets/skill/            # bundled skill for --offline installs
│   └── README.md
├── skill/                       # THE skill — copied to ~/.claude/skills/thoth
│   ├── SKILL.md
│   ├── references/
│   │   ├── brand-archetypes.md
│   │   ├── tone-spectrum.md
│   │   ├── hot-take-exercises.md
│   │   ├── onboarding-interview.md
│   │   ├── content-mix.md
│   │   ├── post-types.md
│   │   ├── hook-patterns.md
│   │   ├── story-arcs.md
│   │   ├── git-safety.md
│   │   ├── example-posts.md
│   │   ├── persona-template.md
│   │   ├── brand-template.md
│   │   └── commands.md
│   ├── templates/
│   │   └── single-image/        # 14 animated infographic templates + _shared kit (tokens, base, components, motion)
│   ├── personas/                # template only — real persona data lives in ~/.thoth/
│   │   └── README.md
│   └── scripts/                 # render.js (GIF renderer), derive-brand.js, recover.js
├── install.sh                   # curl | bash installer
├── skill.json                   # skill metadata
├── CLAUDE.md                    # dev guide
├── CONTRIBUTING.md
├── LICENSE
└── README.md                    # this file
```

---

## Hard rules (never violated)

1. Never publishes on your behalf. Output is text.
2. Never names a connected git repo, quotes code, or promotes the product being built.
3. Never fabricates specifics (numbers, people, events) not in your persona or inputs.
4. Never starts a post with a LinkedIn cliché ("Excited to share", "I'm humbled to announce").
5. Never uses more than 4 hashtags. Never tags people for engagement bait.
6. Never drifts from your documented archetype and tone.

If the draft trips any rule, Thoth rewrites. If it can't rewrite to pass, it tells you why.

---

## Privacy

Everything stays on your machine. Thoth writes to `~/.thoth/personas/` (or `./.thoth/personas/` in a project that opts into local mode) and nowhere else. It does not transmit persona data, post history, or inputs anywhere. No telemetry.

To back up: copy `~/.thoth/`. To migrate machines: copy `~/.thoth/` to the new install. The skill code itself at `~/.claude/skills/thoth/` is reinstalled cleanly on the new machine — only the data root needs copying.

---

## Changelog

Full version history is in [CHANGELOG.md](./CHANGELOG.md). Recent highlights:

- **v1.5.0** — Animated infographics. Every post pairs with an auto-generated GIF, picked from a 14-template library by the post's point of view. Per-persona brand (colours, palette, fonts) is now auto-derived from archetype + tone.
- **v1.4.0** — Visual rendering (MVP). `/thoth image` produces 1200×1200 brand-aware PNG cards from any post — quote, stat, or headline variants, auto-picked from content. `/thoth brand` to set up your persona's visual identity.
- **v1.3.0** — Standuply-shaped daily flow. `/thoth schedule` now drops drafts in `~/.thoth/inbox/` with a system notification; `/thoth inbox` to review, accept, regenerate, or reject. Drafts only count toward your ratio after you accept them.
- **v1.2.0** — Framework catalog (20 frameworks across 5 types) + hook pattern library (13 patterns) + `/thoth frameworks` command. Every generated post now picks a named framework and hook with rotation.
- **v1.1.3** — Ship `CHANGELOG.md`; add "What's new" highlights to the README.
- **v1.1.2** — `/thoth update` and `/thoth version` commands.
- **v1.1.1** — `/thoth recover`; install-time legacy-persona rescue for `install.sh` and `npx`.
- **v1.1.0** — Persona data relocated to `~/.thoth/` (outside the skill folder).
- **v1.0.3** — Skip pax/long-name tar headers in the CLI installer.
- **v1.0.0** — Initial release.

To upgrade an existing install, just run `/thoth update` from inside Claude.

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CLAUDE.md](./CLAUDE.md) (the dev guide).

High-value contributions:
- New archetype example-posts (see `skill/references/example-posts.md` for format).
- Translations of the onboarding interview.
- Adapters for other AI tools (`--ai` targets beyond Claude/Cursor/Windsurf).

---

## Credits

- **Brand archetypes** — Carol S. Pearson & Margaret Mark, *The Hero and the Outlaw* (2001), building on C.G. Jung.
- **Tone of voice model** — Kate Moran et al., Nielsen Norman Group UX research.
- **Story-arc and copy frameworks** — Six Thinking Hats (de Bono), Ghost/Truth/Lie/Happy Ending (classic copywriting canon).

---

## License

[MIT](./LICENSE).
