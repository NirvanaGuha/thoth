# Command Reference

Render this when the user runs `/thoth help`. Keep concise.

---

**Thoth — LinkedIn voice skill**

Commands:

- `/thoth help` — show this command list.
- `/thoth <name>` — activate that persona. First time: creates the folder and offers to run onboarding.
- `/thoth onboard` — run the 20–30 min persona interview for the active user.
- `/thoth onboard <name>` — create `<name>`, activate, and run the interview.
- `/thoth` — generate a post for the active user (ratio-aware).
- `/thoth <type>` — force a post type (personal / work / thought-leadership / educational / promotional).
- `/thoth daily` — one-shot: ask what's new today, then draft today's post.
- `/thoth regenerate` — redraft the last post.
- `/thoth regenerate <feedback>` — redraft with steering. Example: `/thoth regenerate less corporate, shorter, add a question at the end.`
- `/thoth calendar` — show ratio tracker and recommended next type.
- `/thoth edit` — open active user's persona for editing.
- `/thoth list` — show all personas on this install.
- `/thoth connect git <path>` — add a local repo as a POV source. Read-only, abstract themes only — see the one-line rules shown on connect.
- `/thoth disconnect git <path>` — remove a git source.
- `/thoth schedule [HH:MM]` — schedule recurring daily run (default 08:30 local). Drafts land in `~/.thoth/inbox/` with a system notification.
- `/thoth unschedule` — cancel the recurring schedule.
- `/thoth inbox` — list pending-review drafts from scheduled runs. `/thoth inbox <date>` opens one; `accept` / `reject` / `regenerate <feedback>` / `cleanup` for the actions.
- `/thoth image [<date>] [--variant <name>]` — render the last post (or a given draft) as an animated GIF (portrait 1080×1350, inside LinkedIn's <5 MB / <400-frame envelope). Auto-picks from 14 infographic types by the post's POV (stat, line-chart, bar-chart, comparison, steps, flowchart, cycle, timeline, layers, funnel, venn, matrix, spectrum, grid); override with `--variant <type>`, or pass a `.png` output for a static frame.
- `/thoth brand` — view the active persona's visual identity. First run auto-derives colors, palette, and fonts from the persona's archetype + tone; `/thoth brand setup` runs the explicit interview to set them by hand.
- `/thoth recover` — restore persona data from past Claude session logs (use after an upgrade that wiped your data, e.g. `amskills update` from v1.0.x).
- `/thoth update` — check for a newer release and upgrade in place. Persona data is never touched.
- `/thoth version` — print installed version, skill path, and data root.
- `/thoth frameworks` — browse the 20-framework catalog and 13-hook library. `/thoth frameworks <name>` for a single framework's full spec.

Output is always copy-ready LinkedIn post text. Thoth never posts on your behalf.

Quick start:

1. `/thoth <your-name>`
2. `/thoth onboard`
3. `/thoth daily` (or `/thoth schedule` to automate)
