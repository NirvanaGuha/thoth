# Personas

This directory stores one subfolder per user on this Thoth install. Thoth manages these files — don't edit by hand unless you know what you're doing. Use `/thoth edit` instead.

## Active persona

`personas/.active` holds a single line with the username of the currently active persona. If absent or empty, no persona is active — commands that need an active user will ask you to activate one.

## Per-user folder layout

```
personas/<username>/
├── persona.md       # canonical voice doc (written by onboarding, editable)
├── topics.md        # pillar topics + expertise areas
├── recent.md        # daily inputs, timestamped — what's been on your mind
├── history.yaml     # posted-log: date, type, topic, wordcount
├── last-post.md     # most recent draft, used by `/thoth regenerate`
├── sources.yaml     # connected git repos (read-only POV sources)
└── schedule.txt     # name of any scheduled task (so `/thoth unschedule` can find it)
```

## Privacy note

Everything in this directory stays local to your Thoth install. Thoth doesn't transmit it anywhere. If you want to back it up, copy the whole folder. If you want to move it to a new machine, copy the folder there and reinstall the skill.

If you're on a shared install (team / agency), keep in mind that any user on this install can read any persona — including the anti-voice, contrarian beliefs, and recent inputs. If that's a concern, install Thoth per-user rather than shared.
