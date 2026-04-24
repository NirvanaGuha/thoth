# Content Mix — The 30/25/20/15/10 Rule

A balanced LinkedIn voice is not just a single kind of post. It's a rotation across five distinct types, each doing different work for the author's brand.

## The target distribution

| % | Type | What it does for the brand |
|---|---|---|
| **30%** | **Personal** | Humanizes the author. Earns the right to post about work. Where readers actually form a sense of who you are. |
| **25%** | **Work** | Shows what you're actually doing. Builds credibility by demonstration, not claim. "Here's what I shipped / studied / solved this week." |
| **20%** | **Thought-leadership** | Establishes point of view. Your contrarian takes, frameworks, reframings. This is where influence compounds. |
| **15%** | **Educational** | Pure teaching. "Here's how [thing] works." Builds trust with the audience who came to learn. |
| **10%** | **Promotional** | Direct product / company / service promotion. The smallest slice — because the 90% that isn't promotion is what makes the 10% believable. |

Over any 20-post window, this maps to:
- 6 Personal
- 5 Work
- 4 Thought-leadership
- 3 Educational
- 2 Promotional

## Why this mix

- **Personal leads** because LinkedIn's algorithm and its readers both reward humanity. A voice that's 80% work posts reads as a company newsletter.
- **Work is second** because it's where credibility is earned by evidence rather than claim.
- **Thought-leadership is third, not first.** A contrarian take from someone who's shown their personal life and their actual work lands very differently from a contrarian take from a stranger.
- **Educational is small on purpose.** Pure "how to" posts are commodified and low-engagement on most feeds. A small dose goes a long way; more than 15% crowds out voice.
- **Promotional is deliberately 10%.** The rest of the posts *are* the promotion — they build the earning power that makes the 10% cash in.

---

## Type definitions (detailed)

### Personal (30%)

A post that would still make sense if the author didn't have their current job. Stories about family, childhood, non-work hobbies, travel, things the author noticed, moments of change, relationships, health, grief, awe.

**Still counts as Personal even if:**
- It's "personal in a work context" (e.g., "what I learned from the hardest manager I ever had" — this is Personal, not Work, because the vehicle is a relationship story).
- It mentions work briefly at the end.

**Does NOT count as Personal:**
- "A lesson I learned from shipping X." That's Work.
- "Here's a personal take on industry trend Y." That's Thought-leadership.

**Length:** Varies. Some of the strongest Personal posts are short (50–150 words).

### Work (25%)

A post about something the author did, built, tried, failed at, or learned in the context of their actual job.

**Counts as Work:**
- "Here's what happened when we shipped X."
- "Behind the scenes of the [feature/report/decision]."
- "Three things I tried this week that didn't work."
- "How our team organizes [workflow]."

**Does NOT count as Work:**
- "Here's the launch announcement for our new product!" → Promotional.
- "Here's a framework for thinking about work like this." → Thought-leadership.

**Length:** 200–350 words typical. Long enough to have a story.

### Thought-leadership (20%)

A post that advances a point of view — a contrarian take, a reframing, a framework, an opinion with evidence. The author is not just describing what happened; they're arguing for how to see it.

**Counts as Thought-leadership:**
- "Most X advice is wrong because Y."
- "I've stopped believing [common belief]. Here's why."
- "Here's a framework for [thing] that's worked for me."
- "Controversial opinion: [...]"

**Does NOT count as Thought-leadership:**
- "Here's what thought leaders are saying about X." (That's a round-up, not a take.)
- "Here are 10 tips for [thing]." (Educational, not a POV.)

**Length:** 200–400 words. Needs space for the argument.

**Source for these posts:** the user's `contrarian_beliefs` and `signature_grievances` YAML blocks in `persona.md`.

### Educational (15%)

Pure teaching. "Here is how X works." The author is a guide, not a character in the story.

**Counts as Educational:**
- "How deliverability actually works on iOS push."
- "A walkthrough of the decision-tree node in our workflow builder."
- "Five things I'd tell a first-time PM about sprint planning."

**Does NOT count as Educational:**
- "How I learned X." (Personal or Work.)
- "Why the conventional wisdom about X is wrong." (Thought-leadership.)

**Length:** 250–450 words. Teaching needs room.

### Promotional (10%)

Direct promotion: a new feature, a hiring post, an event, a case study, a testimonial, a call-to-action to sign up or try something.

**Even promotional posts must pass the "is this useful?" test.** A promotional post that's *only* a product announcement will underperform. The strongest promotional posts read as Thought-leadership or Work posts with a promotional close.

**Structure rule for Promotional posts:**
- First 70% of the post is substantive (a problem, a story, a lesson, a reframe).
- Promotional ask is the last 30%.

**Length:** 150–300 words. Keep it tight.

---

## How Thoth picks the next type

Read `personas/<active>/history.yaml`. Each row looks like:

```yaml
- date: 2026-04-24
  type: personal
  topic: "weekend hiking trip reframe"
  wordcount: 180
```

Compute the percentages across the **last 20 posts** (or all posts, if fewer than 20).

**Selection algorithm:**

1. For each of the five types, compute `actual - target` percentage gap.
2. Pick the type with the **most negative gap** — the most underrepresented.
3. If multiple types tie, prefer this priority order: `personal > work > thought-leadership > educational > promotional`. (This protects Personal from being starved, which is the single most common ratio failure in LinkedIn-posting.)
4. If all gaps are within ±2 percentage points, rotate through all five types (pick the one not seen most recently).

**Never** pick a type that was just used in the last 2 posts unless the gap is extreme (>10 percentage points behind target) — variety matters more than ratio correction on short windows.

**Always** tell the user what type was selected and why in one sentence:

> *"Picking Thought-leadership today — you're at 10% over the last 20 posts vs. a 20% target. Using your 'attribution is broken' contrarian belief as the seed."*

---

## Content mix override

The user may override the type at generation time: `/thoth personal` or `/thoth work` forces that type. When overridden, Thoth still records the post in `history.yaml` with the chosen type — it just skipped the auto-selection.

After three consecutive manual overrides in the same type, flag: *"Heads up — you've picked Personal three times in a row. Want me to start rebalancing, or is this a phase?"*

---

## Per-type opening patterns (to avoid formulaic drift)

A common failure mode: within a type, posts all start with the same structure. Over 20 posts, rotate opening structures:

**Personal openers** — rotate: scene, dialogue, question, observation, timeline ("Seven years ago today..."), list.
**Work openers** — rotate: problem, version-number, metric, scene, question.
**Thought-leadership openers** — rotate: contrarian assertion, question, list of common-wisdom statements to critique, scene.
**Educational openers** — rotate: problem being solved, a specific misconception, numbered intro.
**Promotional openers** — rotate: customer problem, internal problem we fixed, milestone.

After generating, silently check: "Are the last 3 posts of this type all opening the same way?" If yes, force a different opener.

---

## Ratio tracker output format

For `/thoth calendar`, render:

```
Thoth — content calendar for <name>
Window: last 20 posts

Target    Actual   Type                       Status
30%       32%      Personal                   ✓ on target
25%       21%      Work                       — slightly under
20%       25%      Thought-leadership         ↑ overrepresented
15%       12%      Educational                — slightly under
10%        5%      Promotional                ↓ underrepresented

Next up: Promotional — 5% behind target. Suggested seeds:
  · Workflows launch recap (your top-voted pillar + recent input)
  · Customer X case study (from recent.md entry on April 18)

Recent streak: P → P → W → TL → TL  (alternate away from TL next)
```

Use plain ASCII / markdown — no tables that won't render in the user's terminal.
