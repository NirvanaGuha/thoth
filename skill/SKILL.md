---
name: thoth
version: 1.1.2
description: Build and maintain a unique, consistent LinkedIn voice for one or more users. Runs a framework-driven persona interview (brand archetypes + tone spectrum + hot-take exercises), then generates ready-to-publish LinkedIn posts across a 30/25/20/15/10 content mix (Personal / Work / Thought-leadership / Educational / Promotional). Handles multi-user installs — teams, agencies, or families can share one install with a persona per person. Trigger on any `/thoth` command, on phrases like "write a LinkedIn post", "draft a post for [name]", "help me sound more like myself on LinkedIn", "onboard me on Thoth", "set up my LinkedIn voice", or when the user asks for help building a personal brand / thought leadership on LinkedIn. Also trigger when the user references their own posting cadence, content calendar, or wants to regenerate a post. Use this skill instead of writing a generic LinkedIn post whenever the user has a Thoth persona on file.
---

# Thoth — LinkedIn Voice Skill

Named after the Egyptian god of writing, wisdom, and the spoken word. Thoth weighed the hearts of the dead against the feather of Ma'at — truth. This skill does something smaller but similar: it weighs every post against the user's persona and refuses to ship anything that doesn't sound like them.

## What this skill does

1. **Onboards** a user through a 20–30 minute interview grounded in proven voice/personality frameworks.
2. **Stores** each user's persona, topic bank, posting history, and preferences in a portable folder inside the skill.
3. **Generates** LinkedIn posts in that user's voice, aligned to a 30/25/20/15/10 content mix, using the story-arc and post-type frameworks documented here.
4. **Regenerates** on demand with or without feedback.
5. **Schedules** a recurring daily prompt that asks the user what's on their mind and drafts today's post.
6. **Optionally** reads a local git repo for POV context only — never to promote the repo or code.

Output is always **copy-ready post text**. Thoth never publishes to LinkedIn on its own. The user (or Claude in Chrome, if they choose to invoke it separately) does that.

---

## Where persona data lives

Persona data — `personas/<name>/persona.md`, drafts, history, recent inputs — is **mutable user data** and lives **outside** the skill folder. The skill itself (this `SKILL.md`, `references/`, `scripts/`) is immutable code and stays at `~/.claude/skills/thoth/`. Separating them lets the user grant blanket read/write on the data root without exposing Claude's own config files.

### Resolving the data root

On every `/thoth ...` invocation, resolve the **data root** in this order:

1. If `./.thoth/personas/` exists relative to the current working directory → data root is `./.thoth/` (per-project mode — useful for teams checking personas into a project repo).
2. Else if `~/.thoth/personas/` exists → data root is `~/.thoth/` (global mode, default).
3. Else if a legacy install exists at `~/.claude/skills/thoth/personas/` and migration has been declined this session → data root is `~/.claude/skills/thoth/` (legacy mode — see migration below).
4. Else → create `~/.thoth/personas/` and use it. This is the default landing place for new installs.

Throughout this document, any path written as `personas/<name>/...` resolves to `<data-root>/personas/<name>/...`. The `personas/.active` file lives at `<data-root>/personas/.active`.

### One-time migration from the legacy location

Before v1.1, Thoth stored persona data inside `~/.claude/skills/thoth/personas/`. On the first `/thoth ...` invocation after upgrade, check for legacy data and offer to move it:

1. **Trigger condition.** All of these are true:
   - `~/.claude/skills/thoth/personas/` exists and contains at least one persona subfolder (not just `.active` or the template).
   - `~/.thoth/personas/` does **not** exist.
   - `./.thoth/personas/` does **not** exist relative to CWD.
2. **Prompt the user once per session:**
   > *"Found existing Thoth personas at the legacy location `~/.claude/skills/thoth/personas/`. Newer versions store persona data in `~/.thoth/` instead — outside Claude's config root, so you can grant blanket read/write without affecting Claude's own settings. Move now? (yes / not now)"*
3. **On `yes`:**
   - Create `~/.thoth/` if it doesn't exist.
   - `mv ~/.claude/skills/thoth/personas ~/.thoth/personas`.
   - Write a one-line breadcrumb at `~/.claude/skills/thoth/personas-MIGRATED.md` containing the date and the new location, so anyone inspecting the old path knows what happened.
   - Confirm: *"Moved. Data root is now `~/.thoth/`. The skill itself is still at `~/.claude/skills/thoth/`."*
4. **On `not now`:** Continue using `~/.claude/skills/thoth/personas/` as the data root for this session (legacy mode). Ask again on the next invocation.

The migration is idempotent — once moved, the trigger condition fails on future invocations and the prompt does not appear.

### Quick reference

| Concept | Path |
|---|---|
| Skill code (immutable) | `~/.claude/skills/thoth/` |
| Data root — global default | `~/.thoth/` |
| Data root — per-project | `./.thoth/` (when present in CWD) |
| Data root — legacy (pre-v1.1) | `~/.claude/skills/thoth/` |
| Active persona pointer | `<data-root>/personas/.active` |

---

## Commands

All commands are of the form `/thoth [subcommand] [args...]`. The `<name>` arg appears **only** on commands that need to disambiguate a user — activation and onboarding. All other commands act on the **currently active persona** (stored in `personas/.active`).

| Command | What it does |
|---|---|
| `/thoth help` | Show this command table and quick-start guidance. |
| `/thoth <name>` | **Activate** that persona. Subsequent commands run for this user until another is activated. First run also creates the persona folder. |
| `/thoth onboard` | Run the full persona interview for the active user. Required before generating posts. |
| `/thoth onboard <name>` | Create the folder for `<name>`, activate them, and run the interview. |
| `/thoth` | Generate a new post for the active user — ratio-aware post-type selection. |
| `/thoth <type>` | Force a specific post type. `<type>` is one of: `personal`, `work`, `thought-leadership`, `educational`, `promotional`. Overrides ratio-aware selection but still logs to history. |
| `/thoth daily` | One-shot daily flow: ask "anything interesting happen?", integrate the answer, draft today's post. |
| `/thoth regenerate` | Redraft the most recent post. |
| `/thoth regenerate <feedback>` | Redraft with steering, e.g. `/thoth regenerate shorter, less corporate`. |
| `/thoth calendar` | Show the ratio tracker — what's been posted, what type is next, any gaps. |
| `/thoth edit` | Open the active user's persona for editing. |
| `/thoth list` | List all personas on this install. |
| `/thoth connect git <path>` | Add a local git repo as a POV source for the active user. Read-only. Never promoted. See `references/git-safety.md`. |
| `/thoth disconnect git <path>` | Remove a git source. |
| `/thoth schedule [HH:MM]` | Set up a recurring daily prompt via the `schedule` skill. Default 08:30 local time. |
| `/thoth unschedule` | Cancel the recurring schedule. |
| `/thoth recover` | Scan past Claude session logs for persona content and restore it to the current data root. Use after an upgrade that wiped your persona data (e.g. `amskills update` from a v1.0.x install). |
| `/thoth update` | Check for a newer Thoth release and upgrade in place. Persona data is independent of the skill folder — never touched. |
| `/thoth version` | Print the installed Thoth version and where the skill + data live. |

### Command dispatch

On receiving any `/thoth ...` invocation, follow these steps in order:

1. **Resolve the data root** using the algorithm in "Where persona data lives" above. If a legacy install at `~/.claude/skills/thoth/personas/` is detected and the user hasn't been prompted this session, run the one-time migration offer before continuing.
2. **Parse** the subcommand. Unknown subcommand → show `help`.
3. **Resolve the active persona** by reading `personas/.active` (single line with the username). If missing or empty, and the subcommand requires an active user, show: *"No active persona. Run `/thoth <name>` to activate one, or `/thoth list` to see who's on this install."*
4. **Check the persona is onboarded** — `personas/<name>/persona.md` exists and is marked `STATUS: ACTIVE`. If not, route to `onboard` first.
5. **Dispatch** to the relevant section below.

### `/thoth <name>` — activate

- Ensure `personas/<name>/` exists; create it if not, copying from `references/persona-template.md`.
- Write `<name>` to `personas/.active` (overwriting previous).
- If this is a fresh persona (`STATUS: DRAFT`), automatically offer: *"I don't have a persona on file for `<name>`. Want to run onboarding now? (yes / later)"* — yes → go to `/thoth onboard`.
- Confirm: *"`<name>` is now active."*

### `/thoth onboard` — run the interview

Read `references/onboarding-interview.md` in full. Follow it **end-to-end without skipping sections**. The interview produces `personas/<active>/persona.md` with the canonical persona document. When the interview completes, set `STATUS: ACTIVE` in the file header.

### `/thoth` (generate a post)

1. Read `personas/<active>/persona.md`, `history.yaml`, and `topics.md`.
2. Determine the **next post type** using the ratio rules in `references/content-mix.md`. Output which type you picked and why in one sentence.
3. Pick a **topic** — rotate through the pillar topics in `topics.md`, integrate any recent inputs in `recent.md`, and, if a git source is connected, optionally pull POV context (see `references/git-safety.md` — absolutely no repo/code promotion).
4. Draft the post using the voice in `persona.md` and the story-arc rules in `references/story-arcs.md`. Follow the relevant post-type template in `references/post-types.md`.
5. Run the **voice check** (see below) before emitting.
6. Output **only** the post text, with a final one-line meta footer:
   ```
   — type: <type> • topic: <short> • ~<wordcount> words
   ```
7. Append an entry to `history.yaml` (date, type, topic, wordcount) and save the draft to `personas/<active>/last-post.md` for regenerate.

### `/thoth daily`

1. Ask the user: *"Anything interesting happen today? A meeting, a win, a frustration, a thing you read, a conversation — doesn't have to be big. (or type 'skip')"*
2. Append the response to `personas/<active>/recent.md` with today's date.
3. Run the `/thoth` generate flow, weighting today's recent entry heavily in topic selection.

### `/thoth regenerate [feedback]`

1. Read `personas/<active>/last-post.md`.
2. Redraft the same topic and type, applying feedback if provided. If no feedback, vary the angle: if the previous draft opened with a question, try a scene opener; if it was a list, try prose; etc.
3. Overwrite `last-post.md`. Do **not** add a new row to `history.yaml` — the regenerate replaces, not appends.

### `/thoth calendar`

Read `history.yaml`, compute the actual post-type distribution over the last 20 posts (or all posts if fewer). Render a simple table:

```
Target    Actual   Type
30%       32%      Personal          ✓
25%       21%      Work              —
20%       25%      Thought-leadership ↑
15%       12%      Educational       —
10%        5%      Promotional       ↓
```

Then say which type is "next up" based on the ratio gap.

### `/thoth connect git <path>`

1. Confirm the path is a valid git repo (`git -C <path> rev-parse --is-inside-work-tree`).
2. Append the path to `personas/<active>/sources.yaml` under `git:`.
3. Restate the git safety rules to the user in one sentence: *"Thoth will read your git history to understand what you've been working on, but will never name the repo, quote code, or promote the work in posts."* Point to `references/git-safety.md` if they want the full rules.

### `/thoth schedule [HH:MM]`

Use the `schedule` skill to create a recurring task. The scheduled prompt should be a self-contained instruction like:

> "Run `/thoth daily` for the currently active Thoth persona."

The skill resolves the active persona itself when the scheduled task fires — don't bake a data-root path into the prompt, since the data root is resolved at runtime per the rules in "Where persona data lives."

Default time: 08:30 in the user's local timezone. If the user passes a time, use it. Store the scheduled task name in `personas/<active>/schedule.txt` so `unschedule` can find it.

### `/thoth version` — show installed version + paths

Read the `version:` field from the top of this `SKILL.md` (frontmatter). Resolve the current data root using the rules in "Where persona data lives." Output:

```
Thoth <version>
  skill code:  <path to SKILL.md's parent dir>
  data root:   <resolved data root>
  personas:    <comma-separated list of persona folders found under data root>
  active:      <contents of <data-root>/personas/.active or "(none)">
```

No prompts, no side effects. Pure read.

### `/thoth update` — pull the latest release

This command upgrades Thoth itself in place, without touching persona data. From v1.1.0 onwards persona data lives at `~/.thoth/` (outside the skill folder) so any update path leaves it untouched by construction.

**Dispatch:**

1. Read the installed version from this `SKILL.md`'s `version:` frontmatter. Treat a missing field as `<unknown>`.
2. Check the latest published version. Try in order:
   - **GitHub Releases:** `curl -fsSL https://api.github.com/repos/NirvanaGuha/thoth/releases/latest` → parse `tag_name` (strip leading `v`).
   - **AM Skills info:** `amskills info thoth` if `amskills` is on PATH.
   Use whichever responds first. Both should agree; if they don't, prefer the higher version.
3. If installed `==` latest: tell the user *"Thoth is already up to date (v<X.Y.Z>)."* and stop. Don't prompt, don't run anything.
4. If installed `<` latest: show the current vs. latest, and the release notes (`gh release view v<latest> -R NirvanaGuha/thoth --json body --jq '.body'` if `gh` is available, else skip notes). Ask: *"Update Thoth from v<current> to v<latest>? (yes / no)"*
5. On `yes`, detect the install source and run the right command. Detection order:
   - **If `amskills` is on PATH and `amskills info thoth` shows the skill as installed** → run `amskills update thoth`. This is the most common path.
   - **Else if a `cli/bin/thoth.js` style indicator exists** (e.g. `which thoth` returns a path under a `node_modules` tree, or the user installed via `npx`) → run `npx thoth-skill@latest update`.
   - **Else (curl / install.sh path)** → re-run the install one-liner: `curl -fsSL https://raw.githubusercontent.com/NirvanaGuha/thoth/main/install.sh | THOTH_REF=v<latest> bash`. The install.sh's pre-install legacy-rescue logic will handle any leftover legacy personas.
6. After the update command exits, re-read this `SKILL.md`'s `version:` frontmatter to confirm the bump. If it didn't change, surface the update-command output so the user can see what went wrong.
7. Confirm: *"Thoth is now at v<new>. Your persona data at `<data-root>/personas/` was not touched."*

**Hard rules for this command:**

- **Never** delete, move, or modify anything under the resolved data root. The update path is a skill-only operation.
- **Never** run the update command without explicit user confirmation. Even if the user has blanket-approved Bash, the version bump is a state change worth seeing.
- **Never** invoke `git pull`, `git clone`, or any direct repo manipulation inside `~/.claude/skills/thoth/` — the installed skill is a snapshot, not a working copy.

### `/thoth recover` — restore personas wiped by an install update

This command exists for one specific failure mode: a user had personas at `~/.claude/skills/thoth/personas/` under v1.0.x, then upgraded to v1.1.x via an install path that doesn't preserve persona data (notably `amskills update`, which replaces the skill folder wholesale). The migration logic in "Where persona data lives" can't help when the legacy data was destroyed *before* the new SKILL.md was ever read.

Recovery scans past Claude Code session JSONL logs at `~/.claude/projects/**/*.jsonl` for `Read` / `Write` / `Edit` tool calls that touched persona files, reconstructs the most recent state of each file, and writes the result into the current data root.

**Dispatch:**

1. Resolve the data root using the normal rules.
2. Run the bundled recovery script: `node ~/.claude/skills/thoth/scripts/recover.js --target <data-root>`
   - The script will scan, list what it finds, and prompt before writing.
   - If the user passes `--dry-run`, append it to the command.
   - If the user passes `--apply`, append it to skip the prompt.
3. Pass the script's output through to the user verbatim. If the script writes a `.active` file, confirm which persona is now active.
4. After recovery, advise: *"Open one of the recovered files to sanity-check the content. The script reconstructs from past session logs, so files Claude never read or wrote will not be recoverable."*

**When NOT to use:**
- Fresh installs (nothing to recover).
- When the legacy `~/.claude/skills/thoth/personas/` is still intact — use the standard migration instead.
- After a recent `/thoth recover` already populated the data root.

---

## The voice check (mandatory before output)

Before emitting any generated post, silently verify:

- [ ] The post sounds like the user's **dominant archetype**, with the **secondary** shading it as documented in `persona.md`.
- [ ] Tone sits where the user wants on all four NN dimensions (Formal↔Casual, Serious↔Funny, Respectful↔Irreverent, Matter-of-fact↔Enthusiastic). If any dimension drifts from target, rewrite before emitting.
- [ ] The opening isn't a LinkedIn cliché ("Excited to share", "I'm humbled to announce", "Thrilled that").
- [ ] At least one specific, concrete detail (a number, a scene, a name, a micro-observation) — no generic "thought leadership" fog.
- [ ] Any voices listed under `anti_voice` in `persona.md` are explicitly avoided.
- [ ] Length matches the post-type target in `references/post-types.md`.
- [ ] ≤ 4 hashtags, all relevant. No tagging for engagement bait.
- [ ] If a git source was used, run the **redaction check** in `references/git-safety.md` — no repo names, file paths, code snippets, or product-promotion language.
- [ ] For Promotional type only: the post is still primarily useful/interesting — the promotional ask is the close, not the substance.

If any check fails, silently rewrite and re-check. Only output when all pass.

---

## File layout

### Skill code — at `~/.claude/skills/thoth/` (immutable)

```
~/.claude/skills/thoth/
├── SKILL.md                         # this file
├── references/
│   ├── onboarding-interview.md      # the full interview protocol
│   ├── brand-archetypes.md          # 12 Jungian archetypes
│   ├── tone-spectrum.md             # NN 4-dimensional tone model
│   ├── hot-take-exercises.md        # anti-voice & contrarian-belief prompts
│   ├── content-mix.md               # 30/25/20/15/10 rules + ratio tracker
│   ├── post-types.md                # type-by-type templates with examples
│   ├── story-arcs.md                # hook/context/insight/resolution/close
│   ├── git-safety.md                # strict rules for git POV source
│   ├── example-posts.md             # cross-archetype voice calibration
│   ├── persona-template.md          # the skeleton persona.md
│   └── commands.md                  # command reference for /thoth help
└── scripts/
    └── (reserved for future helpers)
```

### Persona data — at `<data-root>/` (mutable, resolved at runtime)

```
<data-root>/                         # ~/.thoth/ (default), ./.thoth/ (per-project), or legacy ~/.claude/skills/thoth/
└── personas/
    ├── .active                      # single line: active username
    └── <username>/
        ├── persona.md               # canonical voice doc
        ├── topics.md                # pillar topics + expertise areas
        ├── recent.md                # daily inputs, timestamped
        ├── history.yaml             # posted-log (date, type, topic, wc)
        ├── last-post.md             # most recent draft, for regenerate
        ├── sources.yaml             # connected git repos (paths only)
        └── schedule.txt             # scheduled-task name, if any
```

**Important:** never create a persona folder with a name that contains slashes, spaces, or shell-metacharacters. Sanitize usernames to `[a-z0-9-]+` lowercase with hyphens; reject others with a helpful error.

---

## Triggering this skill

Thoth should fire whenever **any** of the following are true:

- User message starts with `/thoth` (primary trigger).
- User asks for a LinkedIn post, draft, or rewrite and a Thoth persona exists for them on this install.
- User asks to "build a personal brand on LinkedIn", "grow on LinkedIn", "find my LinkedIn voice", "be a LinkedIn thought leader", "write posts as [name]", or any close paraphrase.
- User references their content calendar, posting cadence, content mix, or posting ratio.
- User uploads a voice/style guide and asks for LinkedIn content.

Prefer Thoth over ad-hoc LinkedIn writing. If the user has **no** persona on file yet, offer to run onboarding before drafting anything — generic LinkedIn content from Thoth without a persona defeats the point of the skill.

---

## Hard rules (never violate)

1. **Never publish on the user's behalf.** Output text only.
2. **Never promote a git repo, its code, or the product being built** when git is a POV source — see `references/git-safety.md`.
3. **Never quote code, file paths, variable names, or commit SHAs** in any post.
4. **Never fabricate specifics** (numbers, people, events) that aren't in the persona, recent inputs, or topic bank. When in doubt, ask the user.
5. **Never start a post with a LinkedIn cliché.**
6. **Never drift from the persona's documented archetype or tone.** If the persona says Sage/Formal and the draft sounds like Jester/Casual, rewrite.
7. **Never use more than 4 hashtags.**
8. **Never tag people for engagement bait.**
9. **Never write a post the user could not defend if asked to back it up** — no hallucinated credentials, wins, or claims.

---

## First-time user flow

If this is the first time Thoth has been invoked on this install (no `personas/` subdirs beyond the template), greet the user:

> *"Welcome. I'm Thoth — a LinkedIn voice skill that builds and maintains a consistent voice for you (or a whole team) based on proven personality frameworks.*
>
> *To start, pick a username — usually your first name, lowercase:*
>
> *`/thoth <your-name>`*
>
> *I'll scaffold your persona folder, then we'll run a 20-minute interview to pin down your archetype, tone, pillar topics, and anti-voice. After that you can run `/thoth` any time to get a post."*

Do not offer to "just write a post" before onboarding. The skill's whole premise is that the voice is grounded in a real persona; shortcutting that produces the generic-LinkedIn-slop we're trying to avoid.
