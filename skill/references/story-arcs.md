# Story Arcs — Post-Level Structure

Every Thoth-generated post follows one of three arcs. The reader shouldn't notice the structure — it should just feel like good writing. But the structure is what makes a post land rather than drift.

## Arc 1 — The Classic Five-Beat (default)

The most common arc. Works across every post type.

```
1. HOOK        (1–2 lines)   Specific, concrete, earns the next line.
2. CONTEXT     (2–4 lines)   Situation, stakes, backstory, problem.
3. INSIGHT     (core)        The substance. The lesson, the reframe, the reveal.
4. RESOLUTION  (1–3 lines)   What happened, what landed, what was learned.
5. CLOSE       (1–2 lines)   A reflection, a question, an invitation.
```

Use for: Personal, Work, Thought-leadership.

**Example shape (Work post, 220 words):**

> **HOOK:** The deploy went out at 11:47pm. By midnight, the on-call Slack channel had seventeen unread messages.
>
> **CONTEXT:** We were shipping a config change that should have been a no-op. Same API, same parameters, just a new default. I tested it in staging for a week. Peer-reviewed. Rolled it to 10% of traffic first.
>
> **INSIGHT:** What I missed was that "no-op for the API" didn't mean "no-op for the queue worker." The worker serialized the new default into jobs that were already in flight. Those jobs tried to deserialize under the old schema and quietly dropped into the dead-letter queue. Our dashboards looked fine — throughput was unchanged. We just didn't notice that a chunk of throughput was now going nowhere.
>
> **RESOLUTION:** Caught it by 12:15am. Rolled back. Retried the DLQ in the morning. Total impact: about 1,400 delayed notifications across two customers.
>
> **CLOSE:** Added a monitor on DLQ size the next day. The lesson wasn't "test harder." It was "test the *consumers* of the thing you're changing, not just the thing itself."

---

## Arc 2 — The Frame-Break

Used when the whole point is a reframe. The opening sets up a conventional wisdom; the body dismantles it.

```
1. FRAME       (1–2 lines)   The received wisdom, stated crisply.
2. TENSION     (1–3 lines)   Why this frame is incomplete or wrong.
3. EVIDENCE    (core)        A concrete example, experience, or data that breaks the frame.
4. REFRAME     (1–3 lines)   A new way to see it.
5. CLOSE       (1–2 lines)   Implication or question.
```

Use for: Thought-leadership, sometimes Educational.

**Signature moves:**
- Frame stated in the user's natural voice, not straw-manned. The frame should feel like a reasonable belief.
- Evidence is specific and recent. "A customer last month" > "customers in general."
- Reframe is generative — it tells the reader what to do differently, not just what to believe differently.

---

## Arc 3 — The Quiet Reveal

Used for Personal posts and Educational posts where the insight sneaks up on the reader.

```
1. SCENE       (2–3 lines)   A specific moment, no big claim yet.
2. DETAIL      (2–4 lines)   More texture. The reader starts wondering where this is going.
3. TURN        (1–2 lines)   A small pivot — the reveal.
4. LANDING     (1–3 lines)   The insight, landed quietly.
5. CLOSE       (optional)    Sometimes this arc ends without a bow.
```

Use for: Personal, Educational, sometimes Promotional.

**Signature moves:**
- The scene has sensory specifics — a room, a sound, a person's gesture.
- The reader should not know the "point" until the turn.
- Resist the urge to hand-hold after the landing. Trust the reader.

---

## Which arc for which post type?

| Post type | Default arc | Alternate |
|---|---|---|
| Personal | Classic or Quiet Reveal | — |
| Work | Classic | Frame-Break (for process posts) |
| Thought-leadership | Frame-Break | Classic |
| Educational | Classic | Quiet Reveal (for concept-teaching) |
| Promotional | Classic (problem → solution → ask) | Frame-Break (for "why the industry is wrong + we built X") |

Rotate the arcs within a type over 10 posts so the voice doesn't become formulaic.

---

## Additional framework layers (optional)

From the PushEngage-team LinkedIn-posts workflow, Thoth also tracks these deeper copywriting frameworks when useful:

### The Ghost / Truth / Lie / Happy Ending

For Frame-Break and some Personal posts:

- **Ghost** — the unseen pain or belief in the audience's head.
- **Lie** — what the audience has been told (or is telling themselves) about it.
- **Truth** — the alternative view the author is offering.
- **Happy Ending** — what becomes possible if the audience takes the Truth.

Not every post needs all four. But when a post feels "meh" on review, check: is there a Ghost being named? Is the Lie surfaced before the Truth is offered?

### The Six Thinking Hats lens (de Bono)

When diagnosing why a draft feels off, ask which "hat" dominates:

- **White Hat** — facts, data, information
- **Red Hat** — feelings, intuition, reactions
- **Black Hat** — risks, judgments, "why this is wrong"
- **Yellow Hat** — optimism, benefits, "why this works"
- **Green Hat** — creativity, alternatives
- **Blue Hat** — process, overview, meta

A draft that's 90% Yellow Hat reads as naive. A draft that's 90% Black Hat reads as grouchy. Most good posts have 2–3 hats in balance, with the dominant one matching the user's archetype.

**Archetype → natural hat mapping:**

- Sage → White + Blue
- Outlaw → Black + Green
- Hero → Yellow + Red
- Caregiver → Red + Yellow
- Magician → Blue + Green
- Creator → Green + White
- Ruler → Blue + Black
- Everyman → Red + White
- Lover → Red + Yellow
- Jester → Green + Red
- Innocent → Yellow + Red
- Explorer → Green + White

Use this as a diagnostic — if a draft's hats don't match the user's archetype, rebalance before emitting.

---

## Paragraph mechanics

LinkedIn rewards short paragraphs because posts are read on mobile and in-feed. Default paragraph rules:

- **Max 3 sentences per paragraph**, with frequent 1-sentence paragraphs for emphasis.
- **Line breaks between paragraphs always.** No solid wall of text.
- **First line of each paragraph does work** — either advances the story or lands an idea. Avoid pure connective "And so..." paragraph openers.
- **No mid-paragraph bullet points** or inline lists. If a list is needed, break it out.

## Sentence mechanics

- **Vary sentence length.** A rhythm of short-medium-short-long feels natural. All-short reads staccato; all-long reads like academic prose.
- **Active voice default.** Passive voice only when the object is genuinely more important than the subject.
- **No throat-clearing openers** — "I wanted to share that...", "It's interesting to note...", "As many of you know...", "Just a quick thought but..."
- **Specific > abstract** every time. "47 customers in the last quarter" beats "many customers recently."

## The final read-aloud test

Before emitting, silently read the draft aloud. Places where you stumble, trip, or pause awkwardly are places to rewrite. If you're reading and think "this sounds like LinkedIn," rewrite the opener.
