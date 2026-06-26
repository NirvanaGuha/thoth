# Onboarding Interview — Protocol

This is the full interview script Thoth runs on `/thoth onboard`. Total time: 20–30 minutes for a thoughtful user. Do **not** skip sections or speed-run. The quality of every future post depends on the quality of this interview.

## Before starting

Confirm to the user:

> *"This will take about 20–30 minutes. We'll cover seven short sections — your role and audience, your archetype, your Enneagram (optional — bring your test results if you have them), your tone, your hot takes, your pillar topics, and your anti-voice. At the end I'll write a persona document you can edit any time with `/thoth edit`. Ready?"*

Wait for explicit yes. If the user says they're busy, offer: *"We can do the essential 10-minute version — skip the optional follow-ups — and deepen it later. Full or express?"*

Full is always better, but forced fullness produces thin answers. Take the user's call.

---

## Section 1 — Role & Audience (2 min)

Goal: understand what the user does and who they're writing for.

Ask, in order:

1. *"What do you do? One sentence — job title and the specific thing you're responsible for."*
2. *"Who on LinkedIn do you most want to reach? Peers in your role, people hiring for your role, the customers you sell to, the community around your tech stack, or someone else? Pick the primary audience."*
3. *"What's one thing you'd like to be known for on LinkedIn 12 months from now?"*

Record under `role:` and `audience:` in `persona.md`. Don't over-structure — short free-text answers are fine here; later sections carry the structure.

---

## Section 2 — Archetype Pinning (6 min)

Goal: identify dominant + secondary archetypes (see `brand-archetypes.md`).

Ask these 6 questions. Each maps to 2–3 archetypes. Count internally.

### Q1 — Why write on LinkedIn at all?

*"Why do you want to post on LinkedIn? What's the real motivation — not the polite answer, the actual one."*

Listen for:
- "Prove I can do it / earn recognition" → **Hero**
- "Call out things that annoy me in my field" → **Outlaw**
- "Help people who are stuck" → **Caregiver**
- "I've built something I'm proud of" → **Creator**
- "Share what I've learned / correct misconceptions" → **Sage**
- "Build a community / connect with peers" → **Everyman** or **Lover**
- "Influence how my industry thinks" → **Ruler** or **Magician**
- "It's an adventure, a new thing to try" → **Explorer**
- "I enjoy the craft of writing" → **Lover** or **Creator**
- "Make people laugh while making a point" → **Jester**

### Q2 — The hardest kind of post to write honestly

*"Which of these would feel fake if you posted it tomorrow?
(a) 'Here's how we 10x'd our growth.'
(b) 'Here's a lesson I learned from failing.'
(c) 'Here's a contrarian take on [industry trend].'
(d) 'Here's how we built [thing] and what broke along the way.'
(e) 'Here's what I loved about the work we just shipped.'"*

The answers they **reject** are almost as revealing as the ones they'd write. Take note.

### Q3 — Who you admire

*"Name one or two writers on LinkedIn (or elsewhere) whose voice you genuinely enjoy. What specifically do you like about them?"*

Map the named writers to archetypes using the examples in `brand-archetypes.md`. This is often the single most diagnostic question.

### Q4 — Scale of emotional expression

*"On a scale from 'deadpan reporter' to 'feels everything openly', where do you naturally sit when writing for an audience?"*

- Deadpan → Sage, Ruler, Outlaw
- Middle → Everyman, Creator, Magician
- Open → Lover, Hero, Innocent, Caregiver

### Q5 — Posture toward industry orthodoxy

*"When you read a really popular take in your field, is your first instinct to
(a) nod along and extend it,
(b) poke a hole in it,
(c) relate it to something you've seen firsthand,
(d) reframe it in a way no one has?"*

- (a) → Sage or Caregiver
- (b) → Outlaw or Sage (if rigorous)
- (c) → Everyman or Explorer
- (d) → Magician or Ruler

### Q6 — Relationship with humor

*"Are you a funny person? And if yes, do you want your LinkedIn voice to be funny, or do you want to keep that separate?"*

Funny + yes on LinkedIn → Jester is in play.
Funny + no → humor will stay below 2 on tone spectrum.
Not particularly funny + still wants humor → use sparingly; don't pin Jester.

### Scoring

After all six questions, count archetype mentions. Dominant = highest count; secondary = highest-count archetype from a **different orientation** (Ego / Soul / Self / Order).

Tell the user:

> *"Based on that, I'm reading you as a dominant [X] with [Y] as a secondary shading. Here's what that means in practice:*
>
> *[one-sentence voice description from `brand-archetypes.md`]*
>
> *Track? Or does one of those feel off — we can swap them."*

Let them adjust. If they swap, re-verify against their answers.

Record in `persona.md`:

```yaml
archetype:
  dominant: sage
  secondary: everyman
  dominant_notes: |
    (Copy the "sounds like" example and the user's reaction to it.)
```

---

## Section 3 — Enneagram Profile (optional, 3–5 min)

Goal: capture the user's Enneagram type so the voice rests on their **core motivation and core fear**, not just surface tone. Archetype (Section 2) describes the *role* the voice plays; the Enneagram describes the *engine underneath it* — why they write, what they're avoiding, and the emotional register they default to under pressure. Together they make a far more specific persona.

This section is **optional**. Lead with the upload path — it's the highest-signal input we can get.

### Step 1 — Ask for test results

> *"Have you taken an Enneagram test? If so, paste your results here — or drop in the file/screenshot (a Truity, Enneagram Institute, Crystal, or 16Personalities-style report all work). I'll read the type, wing, and the breakdown and pull out what matters for your voice. If you haven't taken one, say 'no' and we'll do a 90-second mini-version — or just skip it."*

**If the user uploads or pastes a report**, extract and confirm:

- **Dominant type** (1–9) and its name (e.g. "Type 3 — The Achiever").
- **Wing** (e.g. 3w2 vs 3w4) if the report gives one.
- **Instinctual variant / subtype** (self-preservation `sp`, social `so`, sexual/one-to-one `sx`) if present.
- **The top 2–3 scored types**, not just the winner — a close second type often explains a voice that doesn't fit the dominant type cleanly.
- The report's stated **core motivation** and **core fear** for the type (or infer them from the standard Enneagram descriptions if the report omits them).

Read it back in one short paragraph and ask the user to confirm or correct:

> *"Reading your report: you're a [Type N — Name], [wing] wing, [variant] subtype, with [second type] close behind. The core drive there is [core motivation], and the thing it's steering away from is [core fear]. That tracks with [tie to something they said in Section 1–2]. Sound right?"*

### Step 2 — No results? Optional 90-second mini-assessment

If the user hasn't taken a test and wants the quick version, ask these three and infer a likely type (offer it as a hypothesis, never a verdict):

1. *"When you're at your best, what are you giving the world — competence, help, honesty, vision, calm, loyalty, fun, strength, or harmony?"*
2. *"Under stress, what's the feeling you're most trying to avoid — being seen as incompetent, unloved, corrupt, ordinary, useless, unsupported, trapped, controlled, or in conflict?"*
3. *"Do you move toward people, against people, or away from people when things get hard?"*

Map to a tentative type and say: *"This is a guess from three questions — a real test is better. Want me to note it as provisional?"*

If the user declines entirely, mark the section `SKIPPED` and move on. The voice still works on archetype + tone alone.

### Step 3 — Translate to voice implications

Whatever path produced the type, write **one line on how it should shape the writing** — this is the part the generator actually uses. Examples:

- **Type 1 (Reformer):** precise, principled, allergic to sloppiness — but watch for preachiness; soften the "should."
- **Type 3 (Achiever):** outcome-forward, credible, momentum in every line — but earn it with a real stake, not just wins.
- **Type 4 (Individualist):** personal, vivid, emotionally honest — leans into what others won't say out loud.
- **Type 5 (Investigator):** depth, evidence, no hand-waving — but pull the reader in, don't just transmit.
- **Type 7 (Enthusiast):** energetic, idea-rich, optimistic — but land one point instead of scattering five.
- **Type 8 (Challenger):** direct, high-conviction, unbothered by pushback — a natural fit for contrarian takes.

Record in `persona.md` under the `enneagram:` block (fields per `references/persona-template.md`). The `voice_implications` line is the load-bearing field — keep it concrete.

```yaml
enneagram:
  type: 3
  type_name: "The Achiever"
  wing: 3w4
  instinct: so
  secondary_type: 8
  core_motivation: "to be valued for genuine accomplishment"
  core_fear: "being seen as worthless or a fraud"
  source: report        # report | mini-assessment | skipped
  voice_implications: "Outcome-forward and credible, but anchor every claim to a real stake — never hollow wins."
```

---

## Section 4 — Tone Calibration (4 min)

Goal: pin all four NN tone dimensions with 1–5 targets (see `tone-spectrum.md`).

For each of the four dimensions, present the spectrum and ask the user to pick their target. Use the scoring heuristics in `tone-spectrum.md` — paraphrase the descriptions of each point rather than dumping the raw rubric.

For each dimension, follow up:

1. *"Pick a 1–5."*
2. *"Any topic where you'd drift? (e.g., personal stories get warmer, product launches more energetic)"*

Record as:

```yaml
tone:
  formal_casual: 3
  serious_funny: 2
  respectful_irreverent: 3
  matter_of_fact_enthusiastic: 2
  drift_rules:
    personal: "+1 casual, +1 enthusiastic"
    promotional: "+1 matter-of-fact, no drift on irreverence"
```

If the user seems uncertain, offer one existing voice per axis as a reference point. E.g., for serious/funny: *"Matt Levine is a 4. Ben Thompson of Stratechery is a 2. Where do you sit?"*

---

## Section 5 — Hot Takes & Anti-Voice (6 min)

Run the three exercises in `hot-take-exercises.md`:

1. The "I would never" list (3–5 specific matchers)
2. The contrarian-belief elicitation (1–3 beliefs, each with support + disconfirming-evidence)
3. The signature grievance (1–3 with replacements)

Do not shortcut these. They are the voice's guard rails.

Record the exercises' outputs in the `anti_voice:`, `contrarian_beliefs:`, and `signature_grievances:` YAML blocks in `persona.md` (field names and structure per `references/persona-template.md`).

---

## Section 6 — Pillar Topics & Expertise (4 min)

Goal: fill `topics.md` with 3–5 **pillar topics** and 2–4 **areas of expertise**.

### Pillars

A pillar topic is a theme the user will keep coming back to. Think of them as the columns of a Roman building — the whole voice rests on them.

Ask:

1. *"What are the 3–5 topics you'd still be posting about a year from now? These should be broad enough to generate 50 posts each, specific enough that not everyone on LinkedIn writes about them."*
2. For each one: *"What's one angle you have on this topic that you haven't seen written about much?"*

### Expertise areas

Narrower than pillars — these are the specific skills / domains where the user is demonstrably strong.

Ask:

1. *"What are you genuinely good at — not what's on your resume, what have you actually done enough that you know things most people don't?"*

### Recording

```
# Pillar topics

1. **Push notification strategy** — angle: "most teams under-measure the assisted-conversion value"
2. **Frontend engineering for visual canvases** — angle: "React Flow is under-used in marketing tools"
3. **Lifecycle marketing automation** — angle: "workflow logic, not message copy, is the lever"
4. **Managing senior engineers** — angle: "the review cadence that's worked for me"

# Expertise areas

- Visual workflow editor design
- Push notification deliverability
- React + TypeScript performance work
- Cross-functional PM↔Eng communication
```

---

## Section 7 — Handoffs & Preferences (2 min)

Goal: capture operational preferences.

1. *"Target post length? Short (80–150), standard (150–300), long (300–500), or vary?"*
2. *"Hashtags? Always use, use sparingly, never, or case-by-case?"*
3. *"Emojis? None, light (1–2 per post if natural), moderate, or heavy?"*
4. *"First-person 'I' — always, sometimes, or prefer 'we'?"*
5. *"Sign-off pattern — a question, a reflection, a call to action, or none?"*

Record under the `output_preferences:` YAML block in `persona.md` (field names per `references/persona-template.md`).

---

## Section 8 — Capture existing voice (optional, 3 min)

If the user has already posted on LinkedIn or written elsewhere:

> *"Paste 1–3 pieces of your own writing that you feel captures your voice at its best. Doesn't have to be LinkedIn. Anything — blog posts, emails, Slack messages you liked, a paragraph from a talk. I'll use these for voice calibration alongside the framework."*

Store under `personas/<name>/voice-samples.md`. These are consulted during every post generation as ground-truth voice references.

If the user has nothing yet, skip this — they'll fill it in over time as Thoth-generated posts become their own voice samples.

---

## Completing the interview

After all sections:

1. Render the full `persona.md` for the user to read:
   > *"Here's your persona. Anything feel off?"*
2. Accept edits inline. Update the file.
3. Set `STATUS: ACTIVE` at the top of `persona.md`.
4. Confirm:
   > *"Onboarding complete. You can run `/thoth` any time to draft a post, `/thoth daily` to start a daily-prompt flow, or `/thoth schedule` to automate it. Type `/thoth help` for all commands."*

---

## If the user asks to skip a section

Politely push back **once**:

> *"That section [archetype / tone / anti-voice] is load-bearing — skipping it tends to produce posts that sound generic. Even a 90-second version gives the skill enough to go on. Still skip?"*

If they insist, mark the section as `SKIPPED` in `persona.md` and note what's missing. Thoth will still function but voice-checks will be weaker. `/thoth edit` can fill them in later.
