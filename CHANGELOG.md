# Changelog

All notable changes to Thoth are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] — 2026-05-25

### Added
- **Inbox mode for scheduled runs.** `/thoth schedule [HH:MM]` now produces a Standuply-shaped daily flow: at the configured time, Thoth generates a draft, writes it to `~/.thoth/inbox/YYYY-MM-DD.md`, and fires a system notification. The draft sits as `pending-review` until you decide what to do with it.
- **`/thoth inbox`** command suite:
  - `/thoth inbox` — list drafts with status and metadata.
  - `/thoth inbox <date>` — open a specific draft for review.
  - `/thoth inbox accept [<date>]` — promote the draft, copy to `last-post.md`, mark `accepted` in history.
  - `/thoth inbox reject [<date>]` — mark `rejected`; kept for the record but excluded from ratio math.
  - `/thoth inbox regenerate [<date>] [<feedback>]` — redraft in place with optional steering.
  - `/thoth inbox cleanup` — archive accepted / rejected drafts older than 30 days under `inbox/archive/`.
- **`<data-root>/integrations/schedule.yaml`** — new config file storing time, timezone, notification channel, schedule ID, and last-run history.
- **`<data-root>/inbox/`** directory tree, with `_unread` marker file for cross-session "new content" detection.

### Changed
- **`/thoth daily` is now dual-mode.** Interactive mode (user-typed) behaves as before — asks "anything happen today?", drafts, returns to stdout. **Scheduled mode** (triggered by `[scheduled run]` marker or `THOTH_SCHEDULED=1` env) skips the question, writes to inbox, notifies. Soft preference for shorter post types on scheduled runs.
- **`history.yaml` schema** gains a `status:` field (`accepted` | `pending-review` | `rejected` | `regenerating`). Older rows without `status` are treated as `accepted` for backwards compatibility.
- **Content-mix ratio math** now counts only `accepted` rows. `pending-review` and `rejected` rows are excluded from both the ratio computation and the framework / hook rotation windows — drafts the user never shipped don't skew future picks.
- **`/thoth schedule`** integrates with notification channels (macOS notifications by default; Telegram / Slack / Discord via the `configure-notifications` skill if already configured) and runs through the OMC `schedule` skill, `scheduled-tasks` MCP, or native crontab — whichever is available.

### Topic-seeding fallback chain (scheduled mode)
1. `recent.md` entry from the last 24 hours → use it.
2. Else most recent `recent.md` entry in the last 7 days → use it.
3. Else fall back to topic rotation from `topics.md` + persona's `contrarian_beliefs` / `signature_grievances`.

Ensures a scheduled run never silently fails for lack of input.

## [1.2.0] — 2026-05-24

### Added
- **Framework catalog.** 20 named writing frameworks (4 per post type) at full schema — origin, shape, must-have/must-not-have, anti-pattern, worked spine, skip-when. Lives in restructured `skill/references/post-types.md`.
  - Personal: `quiet-reveal` ★, `then-now-because`, `the-confession`, `gratitude-specific`.
  - Work: `decision-log` ★, `failed-experiment`, `constraint-driven-story`, `pre-mortem`.
  - Thought-leadership: `heretical-claim-receipts-stake` ★, `first-principles-reframe`, `steel-man-then-dismantle`, `changed-my-mind`.
  - Educational: `pmrg` ★, `anti-pattern-catalog`, `curse-of-knowledge-unwind`, `cookbook`.
  - Promotional: `story-first-promo` ★, `i-built-this-because`, `receipt-stack-soft-ask`, `anti-launch`.
- **Hook pattern library.** New file `skill/references/hook-patterns.md` with 13 named hook patterns and a per-type compatibility matrix. Hooks compose independently of frameworks; the generator picks one of each per post.
- **`/thoth frameworks` command.** Read-only catalog browser. `/thoth frameworks` lists the catalog; `/thoth frameworks <name>` shows a single framework's full spec; `/thoth frameworks hooks` lists the hook library; `/thoth frameworks hooks <name>` shows a single hook's spec.
- **Selection algorithm** in `content-mix.md` extended to type → framework → hook → topic, each with rotation windows and archetype/topic fit filters.
- **`history.yaml`** schema gains `framework` and `hook_pattern` fields per post. Older rows without these fields are treated as `unknown` and excluded from rotation filters.
- **Voice check** gains two items in v1.2.0: confirm the draft follows the chosen framework's shape (not a generic Classic arc), and confirm the opener matches the chosen hook pattern.

### Changed
- `skill/references/post-types.md` restructured from one template-per-type into a 4-framework catalog per type (~1,400 lines). Previous Must-have / Must-not-have / Length-target guidance preserved.
- `skill/references/content-mix.md` "How Thoth picks the next type" section expanded into a four-step "Selection algorithm" covering type, framework, hook, and topic selection.
- `skill/SKILL.md` `/thoth` (generate post) dispatch updated to call out type → framework → hook → topic ordering with explicit announce-before-drafting.

## [1.1.3] — 2026-05-23

### Added
- `CHANGELOG.md` (this file). Ships with the skill and is linked from `README.md`.

### Changed
- `README.md` — new "Changelog" section linking here, plus a "What's new in v1.1" highlights block.

## [1.1.2] — 2026-05-23

### Added
- **`/thoth update`** — one-command upgrade from inside Claude. Reads the installed version from `SKILL.md` frontmatter, checks the latest on GitHub Releases and AM Skills, shows the release notes, and runs the right update command for the install source (`amskills update thoth`, `npx thoth-skill@latest update`, or the curl one-liner). Persona data at `~/.thoth/` is treated as opaque — never touched.
- **`/thoth version`** — pure-read helper. Prints the installed version, the skill code path, the resolved data root, the list of personas, and the active persona.
- `version:` field in the `SKILL.md` YAML frontmatter. Source of truth for the installed version at runtime.

### Changed
- Top-level `README.md` and `references/commands.md` command tables include the two new commands.

## [1.1.1] — 2026-05-23

### Added
- **`/thoth recover`** — scans `~/.claude/projects/**/*.jsonl` Claude session logs for `Read` / `Write` / `Edit` tool calls touching persona files and reconstructs the most recent state of each into the current data root. Use this if a v1.0.x → v1.1.x upgrade via `amskills update` wiped your data.
- `skill/scripts/recover.js` — Node-only recovery script (no Python dependency). Invoked by `/thoth recover`.
- `install.sh` — pre-install legacy-persona rescue. If a v1.0.x install is detected, the legacy `~/.claude/skills/thoth/personas/` directory is moved to `~/.thoth/personas/` **before** the new skill files land.
- `cli/bin/thoth.js` — `rescueLegacyPersonas()` runs at the start of `cmdInit`, protecting both `init` and `update` from the same data loss.

### Fixed
- **Persona data loss on v1.0.x → v1.1.x upgrades via `amskills update`.** v1.1.0's migration logic ran only when Claude read `SKILL.md` during a `/thoth` command, but `amskills update` replaces the skill folder by file substitution before that has a chance to happen. Install-time rescue closes the gap for `install.sh` and `npx thoth-skill`; `/thoth recover` rescues users whose data was already lost.

### Changed
- `npx thoth-skill update` — no longer juggles a personas backup in `/tmp`. Data lives at `~/.thoth/` and is independent of the skill folder.
- `npx thoth-skill uninstall` — warns if legacy data is still in-skill; advises running `update` first to migrate.
- `npx thoth-skill list` — resolves and displays the actual data root and personas.

## [1.1.0] — 2026-05-23

### ⚠️ Known issue (fixed in 1.1.1)
Upgrading from v1.0.x via `amskills update thoth` destroys legacy persona data at `~/.claude/skills/thoth/personas/` before this version's migration logic has a chance to run. **Upgrade to 1.1.1 or later immediately and run `/thoth recover` if affected.**

### Changed
- **Persona data now lives outside the skill folder.** The skill itself is immutable code at `~/.claude/skills/thoth/`; mutable data lives at `~/.thoth/` (global default) or `./.thoth/` (per-project, useful for teams checking personas into a repo). This lets users grant blanket read/write on persona data without exposing Claude's own config files.
- Data-root resolution order: `./.thoth/` → `~/.thoth/` → legacy `~/.claude/skills/thoth/` (until migrated) → create `~/.thoth/`.

### Added
- One-time migration in `SKILL.md`: first `/thoth ...` call after upgrade offers to `mv ~/.claude/skills/thoth/personas → ~/.thoth/personas`, leaving a `MIGRATED.md` breadcrumb at the old path.
- New `SKILL.md` "Where persona data lives" section with the full resolution algorithm and migration spec.
- `skill/personas/README.md` rewritten to describe the new storage model.
- `CLAUDE.md` "code vs data separation" note for developers working on the skill.

## [1.0.3] — 2026-04-24

### Fixed
- `cli/bin/thoth.js` — skip pax / GNU long-name tar headers when extracting GitHub release tarballs. Without this, the top-level directory was incorrectly identified and nothing was extracted, leaving installs empty.

## [1.0.0] — 2026-04-24

### Added
- Initial public release.
- 20-minute framework-driven persona interview (Jungian brand archetypes + Nielsen Norman 4-D tone-of-voice + contrarian-belief elicitation).
- Ratio-aware post generation across a 30/25/20/15/10 content mix (Personal / Work / Thought-leadership / Educational / Promotional).
- Story-arc, post-type, and voice-check frameworks under `skill/references/`.
- Multi-persona support — one shared install can host multiple users with `/thoth <name>` switching.
- Optional git-source POV reading with strict redaction rules (`skill/references/git-safety.md`).
- Daily flow (`/thoth daily`) and scheduled prompts (`/thoth schedule`).
- npx, curl, and AM Skills install paths.

[1.3.0]: https://github.com/NirvanaGuha/thoth/releases/tag/v1.3.0
[1.2.0]: https://github.com/NirvanaGuha/thoth/releases/tag/v1.2.0
[1.1.3]: https://github.com/NirvanaGuha/thoth/releases/tag/v1.1.3
[1.1.2]: https://github.com/NirvanaGuha/thoth/releases/tag/v1.1.2
[1.1.1]: https://github.com/NirvanaGuha/thoth/releases/tag/v1.1.1
[1.1.0]: https://github.com/NirvanaGuha/thoth/releases/tag/v1.1.0
[1.0.3]: https://github.com/NirvanaGuha/thoth/releases/tag/v1.0.3
[1.0.0]: https://github.com/NirvanaGuha/thoth/releases/tag/v1.0.0
