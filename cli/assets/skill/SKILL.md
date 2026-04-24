---
name: thoth
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

### Command dispatch

On receiving any `/thoth ...` invocation, follow these steps in order:

1. **Parse** the subcommand. Unknown subcommand → show `help`.
2. **Resolve the active persona** by reading `personas/.active` (single line with the username). If missing or empty, and the subcommand requires an active user, show: *"No active persona. Run `/thoth <name>` to activate one, or `/thoth list` to see who's on this install."*
3. **Check the persona is onboarded** — `personas/<name>/persona.md` exists and is marked `STATUS: ACTIVE`. If not, route to `onboard` first.
4. **Dispatch** to the relevant section below.

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

> "Run `/thoth daily` for the persona currently marked active in `~/.claude/skills/thoth/personas/.active`."

Default time: 08:30 in the user's local timezone. If the user passes a time, use it. Store the scheduled task name in `personas/<active>/schedule.txt` so `unschedule` can find it.

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

```
thoth/
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
├── personas/
│   ├── .active                      # single line: active username
│   └── <username>/
│       ├── persona.md               # canonical voice doc
│       ├── topics.md                # pillar topics + expertise areas
│       ├── recent.md                # daily inputs, timestamped
│       ├── history.yaml             # posted-log (date, type, topic, wc)
│       ├── last-post.md             # most recent draft, for regenerate
│       ├── sources.yaml             # connected git repos (paths only)
│       └── schedule.txt             # scheduled-task name, if any
└── scripts/
    └── (reserved for future helpers)
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
