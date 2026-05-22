# Personas

This directory inside the skill is **a placeholder**. Real persona data lives outside the skill folder so it can be granted read/write access without exposing Claude's own config files.

## Where your persona data actually lives

Thoth resolves the **data root** at runtime in this order:

1. `./.thoth/personas/` in the current working directory (per-project mode — useful for teams checking personas into a project repo).
2. `~/.thoth/personas/` (global mode, default).
3. `~/.claude/skills/thoth/personas/` (legacy mode for pre-v1.1 installs — auto-migrated to `~/.thoth/` on first run after upgrade).

The active persona pointer (a single line with the username) lives at `<data-root>/personas/.active`.

## Per-user folder layout

```
<data-root>/personas/<username>/
├── persona.md       # canonical voice doc (written by onboarding, editable)
├── topics.md        # pillar topics + expertise areas
├── recent.md        # daily inputs, timestamped — what's been on your mind
├── history.yaml     # posted-log: date, type, topic, wordcount
├── last-post.md     # most recent draft, used by `/thoth regenerate`
├── sources.yaml     # connected git repos (read-only POV sources)
└── schedule.txt     # name of any scheduled task (so `/thoth unschedule` can find it)
```

Thoth manages these files — don't edit by hand unless you know what you're doing. Use `/thoth edit` instead.

## Migrating from a pre-v1.1 install

If you have personas at `~/.claude/skills/thoth/personas/` from an earlier version, the first `/thoth ...` command after upgrade will offer a one-time `mv` to `~/.thoth/personas/`. Decline if you want to migrate manually; the offer comes back on the next invocation until you accept.

## Privacy note

Everything in the data root stays local. Thoth doesn't transmit it anywhere. To back up: copy `~/.thoth/` (or `./.thoth/` for a project). To migrate machines: copy the data root to the new machine — the skill itself reinstalls cleanly.

If you're on a shared install (team / agency), keep in mind that any user with access to the data root can read any persona — including the anti-voice, contrarian beliefs, and recent inputs. If that's a concern, use per-project mode (`./.thoth/`) inside a directory only your account can read, or install Thoth per-user with a separate home directory.
