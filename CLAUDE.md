# Thoth — Developer Guide

This file is for Claude (or a human dev) working *on* the Thoth skill itself, not for end-users. Read this alongside `CONTRIBUTING.md`.

## Repo anatomy

```
thoth/
├── skill/                  ← the skill. SOURCE OF TRUTH.
├── cli/                    ← npm package; wraps installer logic around skill/
│   ├── bin/thoth.js        ← zero-dep Node CLI
│   └── assets/skill/       ← auto-synced copy for --offline installs
├── .claude-plugin/         ← Claude plugin marketplace manifest
├── install.sh              ← curl|bash installer (no Node required)
├── skill.json              ← skill-level metadata
└── .github/workflows/      ← CI that publishes the CLI on release
```

**The golden rule:** all skill content lives in `skill/`. Never edit `cli/assets/skill/` directly — it's re-synced from `skill/` at release time. If you edit both, `skill/` wins.

**Code vs data separation:** the `skill/` directory is immutable skill code. **Persona data does not live here.** At runtime Thoth resolves a data root — `./.thoth/` if present in CWD, else `~/.thoth/` (default), else legacy `~/.claude/skills/thoth/` for pre-v1.1 installs. The `skill/personas/` directory in this repo is intentionally empty except for `README.md` (which documents the resolution rules). The resolution algorithm and one-time migration logic are defined in `skill/SKILL.md` under "Where persona data lives" — do not bypass it by hardcoding paths anywhere else in the skill.

## Conventions

- **Ratio numbers** appear in several files (`SKILL.md`, `skill/references/content-mix.md`, `skill/references/post-types.md`, `README.md`). When you change one, grep for the old number and change them all. Ratios must always sum to 100.
- **Field names in persona.md** are snake_case (`anti_voice`, `contrarian_beliefs`, `signature_grievances`, `archetype.dominant`, `tone.formal_casual`). Prose can say "anti-voice" as a concept. YAML references in backticks must use snake_case.
- **Archetype names** are canonical (Hero, Outlaw, Magician, Everyman, Lover, Jester, Caregiver, Creator, Ruler, Innocent, Sage, Explorer). "Regular Guy" is a Pearson/Mark alias for Everyman — OK to mention in parentheses inside `brand-archetypes.md`, never as a primary name elsewhere.
- **Commands** — any command added must be registered in:
  1. `skill/SKILL.md` command table
  2. `skill/references/commands.md`
  3. `README.md` command table
  4. SKILL.md dispatch section (with its logic described)

## Testing changes

No unit tests — this is a skill, not a service. Validation is:

### Mechanical consistency

```sh
# Persona field names should be consistent snake_case inside backticks.
rg -n '`anti-voice`|`contrarian-beliefs`|`signature-grievances`' skill/ README.md

# Archetype naming consistency.
rg -n 'regular guy' skill/ README.md -i   # should only appear in brand-archetypes.md

# Ratio sum check.
rg -n '30%|25%|20%|15%|10%' skill/references/content-mix.md | head
```

### Manual behavior check

In a Claude session with the updated skill installed:

```
/thoth help
/thoth alice
/thoth onboard
→ answer a few questions to sanity-check the flow
/thoth
/thoth calendar
/thoth regenerate shorter
```

Watch for:
- Commands parse correctly.
- Active persona switches cleanly.
- The generated post doesn't start with a cliché.
- All four voice-check items fire (archetype fit, tone targets, anti-voice scan, length).
- `/thoth calendar` renders correctly.

### CLI test

```sh
cd cli
cp -r ../skill assets/skill
node bin/thoth.js init --local --offline
ls .claude/skills/thoth
rm -rf .claude
```

## When to edit what

| You want to… | Edit this |
|---|---|
| Change how onboarding works | `skill/references/onboarding-interview.md` |
| Add a command | `skill/SKILL.md` + `skill/references/commands.md` + `README.md` |
| Change the content mix ratio | `skill/references/content-mix.md` + `skill/SKILL.md` + `skill/references/post-types.md` + `README.md` |
| Update an archetype description | `skill/references/brand-archetypes.md` |
| Add a new `--ai` CLI target | `cli/bin/thoth.js` (the `SKILL_DIR_MAP` object) + `install.sh` case statement + `README.md` |
| Harden git safety | `skill/references/git-safety.md` |
| Change where persona data lives (data root, migration, resolution order) | `skill/SKILL.md` ("Where persona data lives" section) + `skill/personas/README.md` + `README.md` (Privacy + persona-location paragraphs) |
| Add a writing framework | `skill/references/post-types.md` (the catalog entry under the right post type) + `CHANGELOG.md`. Frameworks must register their `Compatible hooks` against names in `skill/references/hook-patterns.md`. |
| Add a hook pattern | `skill/references/hook-patterns.md` (full spec + glossary row + compatibility matrix row). If the hook only works with certain frameworks, update those frameworks' `Compatible hooks` lists in `skill/references/post-types.md`. |

## Non-goals (keep in mind)

- This is not a LinkedIn automation tool. It must never post on behalf of the user.
- This is not a generic writing assistant. Scope = LinkedIn voice. Don't expand.
- This is not a "personality test" product. Archetypes and tone are lenses for writing, not diagnoses.
- This is not a place for engagement optimization. If a PR tries to make posts "perform better" at the cost of voice quality, it's not in scope.

## Upstreaming user-improvements

If a user hand-edits their `persona.md` in a way that reveals a gap in onboarding (e.g., they add a field the interview doesn't capture), that's a signal. Consider upstreaming the field into:

1. `skill/references/persona-template.md`
2. `skill/references/onboarding-interview.md` (new question)
3. `skill/SKILL.md` voice-check (if the field should be consulted at generation)

## Contact

See the repo's Issues tab. For security concerns, email the maintainer listed in `LICENSE`.
