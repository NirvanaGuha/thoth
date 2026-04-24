# Contributing to Thoth

Thanks for considering a contribution. Thoth stays good when its voice-calibration examples stay real, its frameworks stay proven, and its guard rails stay strict.

## What's welcome

- **New example posts** for underrepresented archetype + tone combinations. Format follows `skill/references/example-posts.md`. Each example needs: the archetype combo, tone targets, a real-sounding (not over-polished) post, and a short "why this works" note.
- **Archetype anti-pattern additions.** If you've seen a specific failure mode for one of the 12 archetypes, add it to the anti-pattern list in `skill/references/brand-archetypes.md`.
- **Onboarding-interview translations.** Thoth currently assumes English. A faithful translation of `onboarding-interview.md` + `hot-take-exercises.md` into another language is a big unlock.
- **New `--ai` targets.** The CLI currently knows about Claude, Cursor, and Windsurf. Adding more surfaces is mostly a path-map change in `cli/bin/thoth.js`.
- **Bug fixes and docs improvements.**

## What's usually a no

- **New post types beyond the 5** (Personal / Work / Thought-leadership / Educational / Promotional). Five is deliberate. Adding more dilutes the ratio system.
- **Loosening the git safety rules.** Those exist for users' professional protection. PRs relaxing them will be closed.
- **"Engagement-optimized" features** like auto-tagging people, emoji-spam options, or virality heuristics. Not what this skill is for.
- **Framework swaps.** The three frameworks (Jungian archetypes, NN/g tone, anti-voice exercises) are load-bearing. Adding a *fourth* diagnostic layer is fine; replacing one is not.

## Development workflow

```sh
# 1. Clone
git clone https://github.com/NirvanaGuha/thoth.git
cd thoth

# 2. Iterate on the skill
# Edit files in skill/. These are the source of truth.
# Your changes show up for anyone who runs `/plugin install`, `curl | bash`,
# or `npx thoth-skill init --offline` after the next release.

# 3. Test the CLI locally against your edits
cd cli
cp -r ../skill assets/skill          # sync skill into CLI's bundled assets
node bin/thoth.js init --local --offline  # installs into ./.claude/skills/thoth
cd ..

# 4. Test the skill itself
# Point a Claude session at ~/.claude/skills/thoth and run through:
#   /thoth test-user
#   /thoth onboard
#   /thoth
#   /thoth calendar
#   /thoth regenerate

# 5. Open a PR
git checkout -b feat/<short-name>
git commit -m "feat: <one-line>"
git push -u origin feat/<short-name>
```

## PR checklist

- [ ] Edits are in `skill/` (the source of truth), not in `cli/assets/skill/` (auto-synced at release).
- [ ] Cross-referenced files stay consistent (command tables, ratio numbers, field names). The easiest way to check is to grep for the thing you changed across the whole repo.
- [ ] No new dependencies in `cli/package.json`. The CLI is deliberately zero-dependency.
- [ ] No telemetry, no outbound calls beyond the GitHub release API in `cli/bin/thoth.js`.
- [ ] CHANGELOG.md (if introduced) or release notes updated.

## Voice-quality contributions

If you're contributing example posts, please:

1. Write the post yourself, in the archetype's voice. Don't generate it with Thoth and submit the output — that creates a feedback loop that narrows the voice.
2. Include the tone targets (1–5 on each of the four axes) that the example corresponds to.
3. Add a 1–3 sentence "why this works" note. The best examples teach via contrast — reference a specific thing the post *doesn't* do.
4. Keep posts between 80 and 500 words. The range matters.

## Release process (maintainers)

1. Update version in `cli/package.json` and `.claude-plugin/plugin.json` and `skill.json`.
2. Update CHANGELOG (if present) or draft release notes.
3. Tag: `git tag v1.x.y && git push --tags`
4. GitHub release triggers `.github/workflows/publish.yml`, which re-syncs `skill/` into `cli/assets/skill/` and publishes the CLI to npm with provenance.

## Code of conduct

Be kind. Disagree on ideas, not people. The same voice-quality rules we apply to generated LinkedIn posts apply here: punch at arguments, not at the humans making them.
