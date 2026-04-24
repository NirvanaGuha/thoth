# thoth-skill (CLI)

The npx-installable CLI for the [Thoth](https://github.com/NirvanaGuha/thoth) Claude skill.

## Install

```sh
npx thoth-skill init          # simplest — installs to ~/.claude/skills/thoth
npm install -g thoth-skill    # or install the CLI globally, then run `thoth init`
```

## Commands

```
thoth init [--ai claude|cursor|windsurf] [--local] [--offline] [--force]
thoth update                    # pull latest, preserving personas/
thoth uninstall [--force]       # remove the skill
thoth list                      # show installs + personas
thoth versions                  # list released versions
thoth help
```

See [the main repo README](https://github.com/NirvanaGuha/thoth) for full documentation.

## Publishing

The CLI is published from the `cli/` folder of the main repo. See `.github/workflows/publish.yml`.

Pre-publish checklist:
1. Bump `cli/package.json` version.
2. Sync `cli/assets/skill/` from the top-level `skill/` (the release workflow handles this).
3. Tag a release in the repo.
