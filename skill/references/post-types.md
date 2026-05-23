# Post Types — Frameworks & Guidance

Each post Thoth generates picks **one type** (from the 30/25/20/15/10 mix in `content-mix.md`), **one framework** (from this file), **one story arc** (from `story-arcs.md`), and **one hook pattern** (from `hook-patterns.md`).

This file is structured per-type. Each type has:

1. **Guidance** — what the type is for, length target, must-have / must-not-have rules.
2. **Framework catalog** — four named frameworks with full specs. Pick one per post via the rotation algorithm in `content-mix.md`.

Framework selection is rotated across recent posts (default last 4) so the persona doesn't lock into a single shape. User can override with `/thoth <type> --framework <name>`.

---

## Personal (30%)

**What it's for:** Humanizing the author. Building the relationship with the reader that makes every other post type land harder.

**Length target:** 80–300 words. Personal can be very short.

**Must have:**
- A specific scene, moment, or relationship.
- At least one detail that couldn't have been written by someone else.
- A turn — something changed, was learned, or was seen differently.

**Must not have:**
- Generic "life lessons."
- Performative vulnerability ("I cried in the boardroom today" when nothing in the story warrants that).
- A forced business takeaway. Personal posts don't need to tie back to work.

### Framework: quiet-reveal

**Origin:** Reflective-essay tradition; used heavily by Naval Ravikant, Anne Lamott, Austin Kleon in long-form.

**Best for:** Personal. Sometimes Educational when teaching a concept that needs to sneak up on the reader.

**Avoid for:** Thought-leadership, Promotional. Energy mismatch.

**Default arc:** Quiet Reveal (Arc 3 in `story-arcs.md`).

**Compatible hooks:** `micro-confession`, `temporal-jump-cut`, `anti-credential`.

**Length sweet spot:** 120–220 words.

**Shape:**
1. **Scene** (2–3 sentences) — A specific moment, no big claim yet. Sensory specifics: a room, a sound, a person's gesture.
2. **Detail** (2–4 sentences) — More texture. The reader starts wondering where this is going.
3. **Ordinary detail** (1 sentence) — Something that seemed ordinary in the moment.
4. **Turn** (1–2 sentences) — A small pivot. The reveal.
5. **Landing** (1–3 sentences) — The insight, landed quietly. Resist hand-holding.

**Must have:**
- Sensory specifics in the scene — the reader has to see it.
- An ordinary detail that becomes important in retrospect.
- A landing that respects the reader's intelligence — no "and that's when I learned…" hand-holding.

**Must not have:**
- Announced moral at the top.
- A hook that telegraphs the insight.
- A close that re-states what just happened.

**Anti-pattern:** Generic-reflective ("It was a beautiful Tuesday morning…"). Generic openers signal generic ending. The reader will scroll.

**Worked spine** (Magician/Hero archetype, growth marketer):
```
SCENE:       "My dad taught me to drive on a 1987 Toyota Corolla
              with a manual transmission."
DETAIL:      "He didn't like teaching. He'd been a flight instructor.
              The first hour was brutal. I stalled eleven times."
ORDINARY:    "Around attempt nine, I started apologizing every time
              the engine choked."
TURN:        "He interrupted me on the tenth.
              'Stop saying sorry. The car is telling you something.'"
LANDING:     "Half my job now is building systems that talk to the
              person using them. My dad would have said: listen to
              what the car is telling you. I think he'd have liked
              the work."
```

**Skip this framework when:**
- The user has no specific scene to anchor in — abstract reflection is the failure mode.
- The topic genuinely needs a sharp claim (Thought-leadership material in disguise).
- The user's tone is heavily Outlaw/Ruler — Quiet Reveal can read as too soft for them.

---

### Framework: then-now-because

**Origin:** Sahil Bloom's transformation-post template, common in personal-development writing.

**Best for:** Personal (transformation). Some Work posts (when documenting a process shift).

**Avoid for:** Thought-leadership, Educational. Risk of "growth post" cliché.

**Default arc:** Classic.

**Compatible hooks:** `temporal-jump-cut`, `micro-confession`, `mistake-confession`.

**Length sweet spot:** 140–250 words.

**Shape:**
1. **Then** (2–3 sentences) — A specific past state. Picture-able, dated if possible.
2. **Now** (2–3 sentences) — The specific present state. Equally concrete.
3. **Because** (3–6 sentences) — The precise mechanism that bridged them. Not luck, not vague growth — a real change.
4. **Close** (1–2 sentences) — Implication or one-line generalization.

**Must have:**
- A "then" state specific enough the reader can picture it.
- A "now" state that's not just "I'm better at it" — show the concrete difference.
- A "because" with mechanism, not just chronology. *What* changed in the user's approach, not *when*.

**Must not have:**
- "I worked harder" as the mechanism. Working harder is not a story.
- A "because" that's actually just a list of self-praise.
- A close that swerves into thought-leadership ("and that's why everyone should…").

**Anti-pattern:** "I used to be insecure. Now I'm confident." That's not a story — that's a billboard. Frameworks need mechanism.

**Worked spine** (Hero/Sage archetype, B2B SaaS):
```
THEN:    "Three years ago I'd spend Sunday nights doom-scrolling
          calendars, trying to figure out what I'd tell my team
          on Monday morning."
NOW:     "Last Sunday I went hiking. The plan for Monday was already
          written on Friday afternoon."
BECAUSE: "I stopped doing the plan in my head. I started writing
          a one-paragraph 'what matters this week' note on Friday,
          out loud, in front of my notes. The act of writing it
          forced me to actually decide instead of letting Sunday's
          panic decide for me."
CLOSE:   "Most strategy isn't a thinking problem. It's a deciding
          problem."
```

**Skip this framework when:**
- The user's "then" is recent (under 3 months) — the contrast doesn't earn the post.
- The mechanism is generic ("I read more books," "I started journaling").
- The user is in active transformation — wait until the "now" state is stable enough to describe.

---

### Framework: the-confession

**Origin:** Justin Welsh's "negative authority" pattern; older in essay tradition (Augustine, Montaigne).

**Best for:** Personal. Sometimes Educational when the lesson is "I was wrong about X."

**Avoid for:** Promotional (sounds like a sales tactic), Thought-leadership (concedes too much).

**Default arc:** Classic.

**Compatible hooks:** `mistake-confession`, `anti-credential`, `changed-my-mind`.

**Length sweet spot:** 160–280 words.

**Shape:**
1. **Confession** (1–2 sentences) — Direct admission of being wrong about X for Y years.
2. **What I thought** (2–3 sentences) — The faulty belief, stated as the user genuinely held it (not strawmanned).
3. **What cracked it** (3–5 sentences) — The specific moment, conversation, data, or experience that broke the belief.
4. **What I do differently now** (2–3 sentences) — Concrete change in behavior, not just belief.
5. **Close** (1 sentence) — Often a one-line generalization or an honest open question.

**Must have:**
- Vulnerability without victim-posting. The confession is about the user's own thinking, not blaming others.
- A specific cracking moment, not "over time I realized."
- A concrete behavioral change, not just an updated belief.

**Must not have:**
- Performative humility ("I'm humbled to admit…").
- A swerve into self-promotion at the end.
- A confession so small it isn't a real change ("I used to put off email replies until the afternoon").

**Anti-pattern:** The fake confession — admitting a flaw that's actually a brag ("I care too much," "I'm too detail-oriented"). Real confessions cost something.

**Worked spine** (Magician/Hero archetype, marketing):
```
CONFESSION:  "For about four years I believed that creative work
              required uninterrupted blocks of time."
WHAT I       "I'd block whole afternoons. Decline meetings. Build
THOUGHT:      elaborate routines to protect 'deep work.'
              Most of those afternoons I produced one mediocre
              draft and an hour of YouTube."
WHAT          "Then I tried writing in 25-minute chunks between
CRACKED IT:   meetings, because I had no other option for two
              months. My output tripled."
WHAT I DO     "I no longer block four-hour windows. I write in
DIFFERENTLY:  25-minute sprints, three a day, between calls.
              The constraint is what makes the writing happen."
CLOSE:        "I think I confused 'I want deep work' with 'I want
              to feel like a serious person.'"
```

**Skip this framework when:**
- The user has nothing to confess that they'd say in public. Force-confession reads as fake.
- The confession is too small to matter or too large to bear (financial, relational, ethical).
- The user just confessed two posts ago — overuse turns confession into a tic.

---

### Framework: gratitude-specific

**Origin:** Counter-cliché version of the standard "I'm grateful…" post.

**Best for:** Personal. Adjacent to Work when the gratitude is for a colleague.

**Avoid for:** Thought-leadership, Promotional. Educational only if gratitude is the lesson (rare).

**Default arc:** Quiet Reveal or Classic.

**Compatible hooks:** `micro-confession`, `temporal-jump-cut`, `anti-credential`.

**Length sweet spot:** 100–200 words.

**Shape:**
1. **One person** (1 sentence) — Named, or specific enough to identify without name.
2. **One moment** (2–3 sentences) — Picture-able. A specific time, place, action.
3. **One thing they did** (2–3 sentences) — Not "they were always there for me." A concrete behavior.
4. **One thing it changed** (1–2 sentences) — In the user, in the user's work, in the user's thinking.
5. **Close** (optional) — Often a single line, sometimes the post just ends.

**Must have:**
- A named or specifically-described person — generic "a colleague" makes the post forgettable.
- One concrete thing they did, not a list of their virtues.
- One concrete thing it changed — not "I'll be forever grateful."

**Must not have:**
- "I want to thank everyone who…" plural.
- A gratitude that's actually self-promotion ("grateful to the team that helped me hit 10K followers").
- Hashtag #blessed and its cousins.

**Anti-pattern:** Gratitude-as-credentials. Posts that list everyone who's helped the user, with implied "look how connected I am." A gratitude post is for one person, one moment.

**Worked spine** (any archetype, personal post):
```
ONE PERSON:  "When I was 23, I had a manager named Dipti who taught
              me how to run a meeting."
MOMENT:      "She watched me run my first one. Three engineers,
              two designers, a 30-minute slot. I prepared slides.
              She watched me bomb."
WHAT SHE     "Afterward, she didn't critique the slides. She said:
DID:          'You spent 28 minutes talking. Try spending 28
              minutes listening, next time. See what happens.'"
WHAT IT       "I changed the format the next week. The team made
CHANGED:      decisions I hadn't thought of. I've run meetings
              that way for ten years."
CLOSE:        "I don't think she knows it shaped a decade of work.
              Probably worth telling her this week."
```

**Skip this framework when:**
- The user has nobody specific they'd publicly thank without it being a brag.
- The gratitude post will read as transactional (you scratch my back…).
- The user posted gratitude last week — natural ceiling on the type.

---

## Work (25%)

**What it's for:** Building credibility by showing what the author actually does. The opposite of claiming expertise — demonstrating it.

**Length target:** 200–350 words.

**Must have:**
- A specific thing that was built, tried, decided, fixed, or shipped.
- The problem that made the work necessary.
- Enough detail that another practitioner could learn from it.

**Must not have:**
- Vague "we're innovating in [space]" claims.
- A launch announcement dressed as a work post (that's Promotional).
- Credit-hogging. If a team shipped it, say so.

### Framework: decision-log

**Origin:** Engineering write-up tradition; ADRs (architecture decision records).

**Best for:** Work. Sometimes Educational when the decision generalizes.

**Avoid for:** Personal, Promotional.

**Default arc:** Classic.

**Compatible hooks:** `constraint-reveal`, `broken-thing`, `temporal-jump-cut`.

**Length sweet spot:** 220–320 words.

**Shape:**
1. **The decision** (1–2 sentences) — What had to be decided, stated simply.
2. **Options** (3–6 sentences) — Three options considered. Each named, briefly described, honestly weighed.
3. **The choice** (2–3 sentences) — What was picked, why.
4. **What we'd watch for** (1–2 sentences) — The risk we accepted.
5. **Result so far** (2–3 sentences) — What happened. If too early to know, say so.
6. **Close** (1 sentence) — The generalizable lesson, if any.

**Must have:**
- At least three options on the table, each treated fairly.
- A specific "why" for the choice that isn't "team consensus."
- An acknowledged risk that came with the choice.

**Must not have:**
- A retrospective rationalization. The reader should see real ambivalence in the options section.
- "We picked the obvious one" — if it was obvious, there's no post.
- A choice with no downside discussed.

**Anti-pattern:** Decision-log-as-victory-lap. Posts that pretend three options were considered when only one was real. The honest version names the option you almost picked and what tipped it.

**Worked spine** (Magician/Hero archetype, B2B SaaS):
```
DECISION:    "We had to pick how subscribers would be moved between
              segments — automatically based on behavior, or
              manually via marketer review."
OPTIONS:     "(A) Full automation — fastest, scales, but trust
              issues if it ever makes a bad move.
              (B) Full manual — marketer approves every move,
              full trust, but doesn't scale past 50K subscribers.
              (C) Automated with marketer-defined holdouts —
              automation by default, but the marketer reserves
              cohorts the algorithm can't touch."
CHOICE:      "Picked (C). It scales like automation, but the
              marketer has a kill switch for the cases they
              don't trust the system to handle yet."
RISK:        "If marketers never define holdouts, we're back to
              full automation with the same trust risk."
RESULT:      "Three months in: 80% of customers define at least
              one holdout. Average holdout is 3% of subscribers.
              Trust complaints down by half compared to v1."
CLOSE:       "Most build vs. buy decisions are actually trust vs.
              speed decisions in disguise."
```

**Skip this framework when:**
- The user can't speak publicly about the decision (NDA, hiring, finance).
- There was only one real option — no rotation through this framework when there's no choice to log.
- The result isn't in yet AND the framework's "result" section would be empty.

---

### Framework: failed-experiment

**Origin:** Build-in-public tradition; Lean Startup's "validated learning."

**Best for:** Work. Some Thought-leadership when the failure points to an industry-wide pattern.

**Avoid for:** Promotional (undercuts the ask).

**Default arc:** Classic.

**Compatible hooks:** `broken-thing`, `constraint-reveal`, `mistake-confession`.

**Length sweet spot:** 200–320 words.

**Shape:**
1. **The bet** (1–2 sentences) — What was tried, why we thought it'd work.
2. **What we expected** (1–2 sentences) — The hypothesis, stated as a prediction.
3. **What happened** (4–6 sentences) — What actually occurred, with specifics. Numbers if possible.
4. **What we missed** (2–3 sentences) — The thing we didn't see going in.
5. **What we'd do differently** (1–2 sentences) — Not "fail faster" — a specific behavioral change.
6. **Close** (1 sentence) — A line of generalization, often understated.

**Must have:**
- A specific hypothesis stated as a prediction with measurable outcome.
- A concrete failure, with numbers if applicable.
- A real lesson — not "fail fast" or "lessons learned."

**Must not have:**
- "Failure" that's actually a humble-brag in disguise ("we underestimated demand, sorry").
- Vague "we learned a lot" without naming what.
- A spin into how the failure was actually a success.

**Anti-pattern:** Failure-as-content. Failures that were known to be failures, written up to look insightful. Real failures had stakes.

**Worked spine** (any archetype, marketing/growth):
```
BET:         "We bet that adding a 'time-to-value' counter to the
              onboarding flow would lift activation by 20%."
EXPECTED:    "The hypothesis: users abandon onboarding because
              they don't know how close they are to the win.
              A counter resolves that."
HAPPENED:    "Activation moved 2%. Within the noise. Worse,
              the qualitative interviews showed users actively
              found the counter stressful — it made them feel
              behind."
MISSED:      "We assumed the bottleneck was uncertainty. The
              actual bottleneck was that the first task wasn't
              easy enough. A counter to a hard task is just a
              countdown to failure."
DIFFERENTLY: "We'd test 'is the first step easy enough' before
              testing 'do users know how close they are.'
              Order of operations."
CLOSE:       "Most product instincts are right about the
              problem and wrong about the cause."
```

**Skip this framework when:**
- The failure isn't done failing — the lesson hasn't crystallized.
- The user has no measured outcome to point at.
- The user already posted a failure last week — pace the type to avoid "failure-content creator" vibe.

---

### Framework: constraint-driven-story

**Origin:** Generic but underused; common in startup essays (Paul Graham, Jessica Livingston).

**Best for:** Work. Some Promotional when the constraint shaped the product.

**Avoid for:** Personal (constraint framing flattens emotional texture).

**Default arc:** Classic.

**Compatible hooks:** `constraint-reveal`, `temporal-jump-cut`, `broken-thing`.

**Length sweet spot:** 200–320 words.

**Shape:**
1. **The constraint** (1–2 sentences) — Time, money, headcount, scope. Tight enough to matter.
2. **What the constraint forced** (3–5 sentences) — Decisions that wouldn't have been made otherwise.
3. **What we cut** (2–3 sentences) — Things we wanted but couldn't have.
4. **What we shipped** (2–3 sentences) — Concrete outcome.
5. **What the constraint taught us** (2–3 sentences) — Often: that the cut things didn't matter.
6. **Close** (1 sentence) — Generalization about constraints.

**Must have:**
- A constraint specific enough to feel real (numbers, dates).
- Decisions that follow from the constraint, not just despite it.
- Honest accounting of what was cut.

**Must not have:**
- Constraint that's actually a brag ("we only had $10M and 30 people").
- A story that pretends the constraint didn't matter ("we made it work anyway").
- A spin into "we work best under pressure" platitude.

**Anti-pattern:** Constraint as backstory for a feature flex. The post is about what the constraint forced you to decide, not what you shipped.

**Worked spine** (Magician/Creator archetype, product team):
```
CONSTRAINT:  "Three weeks. One engineer. A board demo on the calendar.
              That was the budget for the entire feature."
FORCED:      "We couldn't build the customizable version. So we
              built three opinionated presets and made them
              configurable through a single dropdown."
CUT:         "We cut: drag-to-reorder, conditional logic at the
              node level, multi-step undo. Each was on the
              wireframe."
SHIPPED:     "The demo worked. The three presets covered ~80%
              of the actual use cases customers were asking for."
TAUGHT:      "When we eventually added drag-to-reorder six months
              later, only 4% of users ever used it. The cut was
              right — we just couldn't have known until we
              shipped without it."
CLOSE:       "Constraints don't make you build worse. They make
              you build the thing you'd have eventually realized
              you should have built."
```

**Skip this framework when:**
- The constraint is invented ("we had to ship fast" without specifics).
- The user has no honest "what we cut" to share.
- The constraint led to bad work — sometimes constraints really do break things, and Thoth shouldn't sugar that.

---

### Framework: pre-mortem

**Origin:** Gary Klein, Daniel Kahneman ("imagine the project failed — why?").

**Best for:** Work. Some Educational (teaching the technique).

**Avoid for:** Personal, Promotional (wrong energy).

**Default arc:** Classic.

**Compatible hooks:** `constraint-reveal`, `broken-thing`, `bad-advice`.

**Length sweet spot:** 220–340 words.

**Shape:**
1. **What we're shipping** (1–2 sentences) — The project, neutral framing.
2. **The pre-mortem setup** (1–2 sentences) — "Imagine it's six months from now and this failed. What broke?"
3. **The risks** (3–5 specific failure modes, each with a sentence) — Concrete, not "the team couldn't execute."
4. **Mitigations** (3–5 lines mapped to the risks) — What we're doing about each.
5. **Honest acknowledgment** (1–2 sentences) — The risks we're accepting unmitigated.
6. **Close** (1 sentence) — Often a reflection on the practice itself.

**Must have:**
- At least three specific, named failure modes.
- A mitigation for each, or an honest "we're accepting this risk."
- An admission of which risks we can't fully mitigate.

**Must not have:**
- Generic risks ("execution," "market timing").
- Pretend mitigations ("we'll communicate well").
- An overclaim that we've thought of everything.

**Anti-pattern:** Pre-mortem-as-reassurance. The pre-mortem only works if the risks named are real and uncomfortable.

**Worked spine** (Sage/Magician archetype, product launch):
```
SHIPPING:    "We're shipping a new onboarding flow next month —
              cut from 8 steps to 4."
SETUP:       "Imagine it's June. We rolled it out, retention
              dropped, and we're rolling back. What happened?"
RISKS:       "(1) The 4 steps left didn't actually convey the
              core value — users activated but never returned.
              (2) Power users hated the simplification because
              the dropped steps were their on-ramp.
              (3) The drop confused our customer success team
              because the docs still describe 8 steps.
              (4) The A/B test showed lift but the lift was
              from a cohort effect we didn't control for."
MITIGATIONS: "(1) Tracking 30-day retention not just D1.
              (2) Power-user path preserved via 'show advanced.'
              (3) Docs sprint is in scope for the launch.
              (4) Test was randomized at the org level, not
              the user level, to avoid cohort drift."
ACCEPTED:    "(1) is the one we can't fully prevent — we'll
              know in 30-60 days post-launch, not at ship."
CLOSE:       "The point of a pre-mortem isn't to prevent failure.
              It's to make sure when failure happens, you weren't
              surprised by it."
```

**Skip this framework when:**
- The launch is too small to warrant the structure.
- The user hasn't actually done the pre-mortem and would be inventing risks.
- The audience is end-customers who'd hear "things might fail" as red flag.

---

## Thought-leadership (20%)

**What it's for:** Advancing a point of view. Taking a position.

**Length target:** 200–400 words.

**Must have:**
- A clear claim, stated early.
- Evidence the author has actually seen (experience, data, specific observation).
- Willingness to concede — "I could be wrong about this if..."

**Must not have:**
- Contrarianism for its own sake.
- Unfalsifiable claims ("culture is everything" — what would disprove this?).
- Punching at specific named competitors or people.

### Framework: heretical-claim-receipts-stake

**Origin:** Joel Klettke (B2B copywriting tradition).

**Best for:** Thought-leadership. Sometimes Promotional ("we built X because the industry is wrong about Y").

**Avoid for:** Personal, Educational.

**Default arc:** Frame-Break.

**Compatible hooks:** `inverted-truism`, `changed-my-mind`, `conviction-with-receipts`.

**Length sweet spot:** 220–340 words.

**Shape:**
1. **Claim** (1–2 sentences) — A heretical assertion, stated without hedging. Must be something a working peer would push back on.
2. **Receipt 1** (2–4 sentences) — A specific case, number, or lived observation. Concrete, not general.
3. **Receipt 2** (2–4 sentences) — Different texture from Receipt 1 (e.g. if R1 was a number, R2 is a story).
4. **Receipt 3** *(optional)* — Pattern-completion proof, used when stakes are high.
5. **Stake** (1–2 sentences) — What changes if the reader buys the claim. The "so what."
6. **Concession** (1–2 sentences) — "I'd change my mind if…" with specific counter-evidence.
7. **Close** (1 sentence) — Invitation to push back. Not a retreat.

**Must have:**
- A claim someone in the user's audience would actually argue with.
- Receipts that name numbers, dates, or specific cases.
- A concrete concession (not "of course there are exceptions").

**Must not have:**
- Strawman framing of the opposing view — state the consensus *fairly* before breaking it.
- "It's not X, it's Y" reframe formula. State the claim directly.
- Hedging that erodes the claim ("some might say…").

**Anti-pattern:** Contrarian-for-engagement. Test: does the claim still hold if no one reacts?

**Worked spine** (Magician/Hero archetype, AI marketing):
```
CLAIM:       "Most marketers are working on the wrong layer with
              AI — skills aren't the bottleneck."
RECEIPT 1:   "A team I worked with put 12 people through prompt
              training. Output quality rose for one person. Six
              months later they were still 'the AI person.'"
RECEIPT 2:   "Compare: a team that built a deterministic content
              workflow. Mediocre prompters inside it shipped more
              consistent output than the trained team without one."
STAKE:       "Stop training people to be prompt artisans.
              Build the factory."
CONCESSION:  "I'd change my mind if shown a team that reached
              consistent AI output through training alone."
CLOSE:       "Curious where teams running this at scale land.
              Especially the ones above three people."
```

**Skip this framework when:**
- The user doesn't have receipts — claim outpaces evidence, reads as posturing.
- The topic is too abstract to support specific proof.
- The user's archetype is heavily Caregiver or Innocent — framework reads as combative.

---

### Framework: first-principles-reframe

**Origin:** Munger / Bezos tradition; common in essay-driven Silicon Valley writing.

**Best for:** Thought-leadership. Sometimes Educational when the reframe is teachable.

**Avoid for:** Personal, Promotional.

**Default arc:** Frame-Break.

**Compatible hooks:** `inverted-truism`, `bad-advice`, `conviction-with-receipts`.

**Length sweet spot:** 240–380 words.

**Shape:**
1. **Surface claim** (1–2 sentences) — The framing everyone uses. Stated fairly, in industry language.
2. **Why the frame is incomplete** (2–4 sentences) — Not "wrong" — *incomplete*. Show the gap.
3. **The deeper question** (1–2 sentences) — What the surface framing skips over.
4. **What changes with the new frame** (3–5 sentences) — How the picture looks differently.
5. **Practical implication** (2–3 sentences) — What the reader should do differently.
6. **Concession** (1 sentence) — When the surface frame is still right.
7. **Close** (1 sentence) — Open question or invitation.

**Must have:**
- A surface claim the reader recognizes.
- A "deeper question" that genuinely cuts under the surface — not just a rephrase.
- Practical implication, not just a philosophical reframe.

**Must not have:**
- Reframe that's actually just contrarianism with extra steps.
- "Everyone's wrong about X" without the deeper question.
- A frame too deep to act on — abstract reframes don't move readers.

**Anti-pattern:** The "real question is" trope without earning it. State the deeper question only if you've genuinely been thinking about it.

**Worked spine** (Magician/Sage archetype, B2B):
```
SURFACE:     "Conversion-rate optimization is the standard frame
              for landing-page work — find the variant that
              converts higher, ship it."
INCOMPLETE:  "But conversion rate is a rate. It tells you about
              the people who landed. It tells you nothing about
              the people who didn't, and nothing about the people
              who converted but churned in week two."
DEEPER:      "The deeper question isn't 'what converts the
              traffic you get?' It's 'what kind of traffic are
              you attracting in the first place?'"
NEW FRAME:   "A page that converts 5% of high-intent traffic
              is doing different work than a page that converts
              5% of low-intent traffic. The first is filtering.
              The second is selling. They reward different copy."
PRACTICAL:   "When CRO stops moving the needle, the answer is
              usually upstream — the wrong traffic is landing.
              Optimize the source, not the page."
CONCESSION:  "For high-velocity B2C with paid traffic, CRO is
              still the right frame. It only breaks down for
              long-cycle B2B."
CLOSE:       "Curious where folks running B2B see this."
```

**Skip this framework when:**
- The reader's "surface claim" isn't actually a held belief — reframe lands on nothing.
- The deeper question is just semantic gymnastics.
- The new frame doesn't change anyone's behavior.

---

### Framework: steel-man-then-dismantle

**Origin:** Rapoport's rules (Anatol Rapoport, popularized by Dennett).

**Best for:** Thought-leadership. Especially good when the opposing view has real merit.

**Avoid for:** Personal, Educational.

**Default arc:** Frame-Break.

**Compatible hooks:** `inverted-truism`, `changed-my-mind`, `conviction-with-receipts`.

**Length sweet spot:** 260–400 words.

**Shape:**
1. **The opposing view, steel-manned** (3–5 sentences) — The strongest version of the view you're going to argue against. Stated as a serious person would defend it.
2. **What's right about it** (2–3 sentences) — Concede what's correct. Honest concession.
3. **Where it breaks** (3–5 sentences) — The specific case, edge, or scale where the view fails.
4. **The replacement view** (3–4 sentences) — Not a 180° flip — the corrected version that keeps what was right and adds what was missing.
5. **Practical implication** (1–2 sentences) — What changes for the reader.
6. **Close** (1 sentence) — Often a question, sometimes a quiet challenge.

**Must have:**
- A genuine steel-man — the opposing view rendered well enough that a believer would nod.
- An honest "what's right" concession.
- A replacement view that's not just the original view inverted.

**Must not have:**
- Strawman labeled as steel-man.
- "What's right" that's actually setup for a gotcha.
- A replacement view that's just contrarian for contrarian's sake.

**Anti-pattern:** Performative steel-manning. Reading a steel-man, the believer should think "yes, that's roughly my view" — not "this person is pretending to take me seriously."

**Worked spine** (Sage/Magician archetype, marketing):
```
STEEL-MAN:   "The case for 'content is the new SEO' is real.
              Search has moved from keyword-matching to intent-
              matching. AI overviews summarize content rather
              than rank it. The signal that wins is genuinely
              useful, distinctive content. So the argument goes:
              stop chasing keywords, write the thing only you
              can write."
RIGHT:       "All of that is correct. Generic SEO posts have
              real diminishing returns. AI overviews do summarize.
              Distinctive content does compound."
BREAKS:      "Where it breaks is at the scale of a real business.
              'Write only what only you can write' is impossible
              advice for a B2B SaaS shipping 4-6 pieces a week
              against 80 internally-aligned topics. You don't
              have 80 once-in-a-lifetime takes per quarter."
REPLACEMENT: "The actual move: divide the content calendar
              into 'positioning content' (irreplaceable, slow,
              distinctive) and 'coverage content' (commodity,
              fast, indexable). Don't conflate them and don't
              try to make every piece both."
PRACTICAL:   "Reserve 20% of capacity for irreplaceable. The
              other 80% is allowed to be table-stakes — it just
              has to ship and be tagged."
CLOSE:       "Curious how teams who've moved off keyword-led
              programs are balancing this in practice."
```

**Skip this framework when:**
- The opposing view doesn't have a real steel-man — sometimes the consensus is just wrong, and a frame-break is cleaner.
- The user hasn't done the work to genuinely understand the view they're arguing against.
- The replacement view isn't materially different.

---

### Framework: changed-my-mind

**Origin:** Public-thinking tradition; common in modern essay writing (Tyler Cowen, Patrick Collison).

**Best for:** Thought-leadership. Adjacent to Personal when the shift is biographical.

**Avoid for:** Promotional (concedes too much).

**Default arc:** Classic or Frame-Break.

**Compatible hooks:** `changed-my-mind`, `temporal-jump-cut`, `mistake-confession`.

**Length sweet spot:** 220–360 words.

**Shape:**
1. **What I used to believe** (2–3 sentences) — The old view, stated as the user genuinely held it.
2. **Why I believed it** (2–3 sentences) — The actual reasons — experience, training, peer norms.
3. **What shifted** (3–5 sentences) — The specific evidence, conversation, or experience that broke it.
4. **What I believe now** (3–4 sentences) — The updated view, with the specific addition or subtraction.
5. **What I'm still unsure about** (1–2 sentences) — Honest residual uncertainty.
6. **Close** (1 sentence) — Often inviting others to share their shifts.

**Must have:**
- An old view stated honestly, not strawmanned for the rhetorical setup.
- A specific shift trigger, not "over time."
- Genuine residual uncertainty — the new view isn't certain either.

**Must not have:**
- "Plot-twist" framing where the shift is invented for the post.
- Self-praise for being "willing to change my mind."
- A new view that's identical to the old view in a different costume.

**Anti-pattern:** Performative humility. The shift only lands if the original belief was honest and the new one is meaningfully different.

**Worked spine** (Magician/Hero archetype, growth):
```
USED TO:     "I used to believe push notifications were a low-ROI
              channel — interrupt-driven, low click-through, easy
              to opt out of."
WHY:         "Most of the data I'd seen was on consumer apps
              fighting for attention against TikTok. The CTRs
              were always 1-3%, and that didn't pencil out for
              the work."
SHIFTED:     "Then I spent two years inside a B2B SaaS that used
              push as a re-engagement layer for accounts that had
              gone dormant. CTR was still 2%. But the 30-day
              return rate for accounts that received push was
              22% higher than those that didn't, even controlling
              for engagement at receive time."
NOW:         "Push isn't a click-driven channel. It's an ambient-
              recall channel. The job isn't to get the tap — it's
              to make sure the brand is in the user's head when
              they next have the problem. That changes how you
              measure it, how often you send, and what you send."
UNSURE:      "Still unsure if this generalizes outside long-cycle
              B2B. For B2C with high-frequency intent, the click-
              driven model might still be right."
CLOSE:       "Curious if anyone running B2C lifecycle has seen
              the ambient-recall pattern there too."
```

**Skip this framework when:**
- The user hasn't actually changed their mind — invented shifts read as performative.
- The "shift" is too recent to be settled into.
- The user already used this framework in the last 6 posts — it's a high-credibility move but loses force with repetition.

---

## Educational (15%)

**What it's for:** Teaching. Pure signal, no performance.

**Length target:** 250–500 words.

**Must have:**
- A clearly-scoped "thing" being taught.
- Structure — usually 3–5 numbered or bulleted sub-points.
- A specific before/after — what the reader can do after reading that they couldn't before.

**Must not have:**
- Listicles with no connecting argument. "10 things about X" where the 10 things don't build on each other.
- Oversimplification that will mislead the reader.
- Teaching-to-teach ("Let me walk you through...") — get to the substance.

### Framework: pmrg

**Origin:** Academic write-up tradition (Problem / Method / Result / Generalize).

**Best for:** Educational. Some Work when teaching is the goal.

**Avoid for:** Personal, Promotional.

**Default arc:** Classic.

**Compatible hooks:** `broken-thing`, `mistake-confession`, `stat-anchored`.

**Length sweet spot:** 280–420 words.

**Shape:**
1. **Problem** (2–3 sentences) — The specific thing the reader hits. Not abstract — a concrete situation.
2. **Method** (4–6 sentences) — What you tried. The actual steps.
3. **Result** (2–4 sentences) — What happened. Numbers if possible.
4. **Generalize** (2–4 sentences) — What rule this points to. The transferable insight.
5. **Close** (1 sentence) — Often a question or invitation to share counter-cases.

**Must have:**
- One specific case, not a synthesis of "I've seen many cases."
- A method specific enough another practitioner could try it.
- A result that's checkable — numbers, before/after, or named outcome.
- A generalization that doesn't overreach the single case.

**Must not have:**
- Multiple parallel cases — PMRG is for one example, deeply.
- A method too generic to test ("I focused on the user").
- A generalization that the single case doesn't support.

**Anti-pattern:** PMRG-as-listicle. If the post is "I tried 5 things, here's what worked," that's a different framework. PMRG is one case, dissected fully.

**Worked spine** (Sage/Magician archetype, ops/marketing):
```
PROBLEM:     "Our content team was producing 4 articles a week
              but our editorial review queue had a 3-week backlog.
              Articles were either shipping late, or shipping
              without proper review."
METHOD:      "We separated the review step into 'structural'
              and 'editorial.' Structural review (does it follow
              the brief, hit the target keyword, have the right
              CTAs) was reduced to a checklist anyone could do.
              Editorial review (voice, clarity, factuality)
              stayed with the editor. We moved structural to
              the writers as self-review with a peer spot-check."
RESULT:      "Editorial backlog went from 3 weeks to 4 days.
              Quality complaints from the editor didn't go up.
              Writers report higher autonomy in our quarterly
              survey."
GENERALIZE:  "When a review process bottlenecks, ask whether
              the reviewer is doing one job or two. The boring
              half can almost always move to the writer or
              a peer. The non-boring half is what the reviewer
              is uniquely good at."
CLOSE:       "Curious if anyone's hit this with design review
              or PR review — same shape, probably?"
```

**Skip this framework when:**
- The user doesn't have one specific case to anchor in.
- The result wasn't measured.
- The generalization would overreach.

---

### Framework: anti-pattern-catalog

**Origin:** Software engineering tradition; "Refactoring" (Fowler) treats anti-patterns as first-class objects.

**Best for:** Educational. Adjacent to Thought-leadership when the anti-pattern is industry-wide.

**Avoid for:** Personal, Promotional.

**Default arc:** Classic.

**Compatible hooks:** `bad-advice`, `mistake-confession`, `stat-anchored`.

**Length sweet spot:** 280–460 words.

**Shape:**
1. **Name the anti-pattern** (1–2 sentences) — Give it a memorable name if you can.
2. **What it looks like** (3–5 sentences) — Concrete description, not abstract.
3. **Why people do it** (2–4 sentences) — Not "they're lazy" — the actual reasonable-feeling reason.
4. **What it costs** (2–4 sentences) — Specific consequences, not "bad outcomes."
5. **The fix** (3–5 sentences) — Concrete replacement behavior.
6. **Close** (1 sentence) — Often a wry aside or open invitation.

**Must have:**
- A specific name for the anti-pattern (memorable enough to use again).
- An honest "why people do it" — anti-patterns survive because they look reasonable from inside.
- A fix that's actually doable, not "just don't."

**Must not have:**
- Anti-pattern that's just "things bad people do." The genuine ones are subtle.
- A fix that's harder than the original behavior.
- Punching at specific people who exhibit the pattern.

**Anti-pattern:** Anti-pattern-as-flex (look how smart I am for spotting this). The framework lands when written from inside the pattern, with empathy for why people fall in.

**Worked spine** (Sage/Magician archetype, product):
```
NAME:        "I call this the 'feature parity trap' — when a
              product team adds features only because a competitor
              has them."
LOOKS LIKE:  "Sales says 'we lost the deal because we don't have
              X.' Product adds X. Six months later, sales says
              'we lost a deal because we don't have Y.' Product
              adds Y. Two years in, the roadmap is competitors'
              feature lists."
WHY:         "Because individual deals feel concrete in a way that
              roadmap drift doesn't. Saying yes to a feature
              feels responsive. Saying no feels arrogant. So
              every feature gets added 'just in case.'"
COSTS:       "The product accumulates surface area without
              cohesion. New users feel overwhelmed. The team
              spends maintenance time on features 4% of customers
              use. Worst: the product loses its point of view —
              it's defined by what it lacks, not what it stands for."
FIX:         "Two things. (1) Track feature usage on a 6-month
              lag. Features below 5% sustained usage either get
              elevated or sunset. (2) Reframe lost-deal feedback:
              'we lost because we don't have X' is data about
              what one buyer wanted, not about what the product
              should do."
CLOSE:       "Mostly I notice this in B2B SaaS where the buyer
              isn't the user. Curious if it shows up the same way
              in consumer."
```

**Skip this framework when:**
- The "anti-pattern" is just "things you shouldn't do." Real anti-patterns are subtle.
- The user can't articulate why people fall into it.
- The fix isn't tested.

---

### Framework: curse-of-knowledge-unwind

**Origin:** Chip & Dan Heath, *Made to Stick*.

**Best for:** Educational. Sometimes Thought-leadership when the topic is genuinely contested.

**Avoid for:** Personal, Promotional.

**Default arc:** Classic or Quiet Reveal.

**Compatible hooks:** `bad-advice`, `mistake-confession`, `inverted-truism`.

**Length sweet spot:** 260–420 words.

**Shape:**
1. **What the reader probably believes** (2–4 sentences) — The folk understanding, stated charitably.
2. **Where it's incomplete** (2–4 sentences) — The piece they're missing, not "you're wrong."
3. **The corrected mental model** (4–6 sentences) — Build it up piece by piece. Use an example.
4. **Why the folk view persists** (1–2 sentences) — Not condescension — the actual reason.
5. **What changes for the reader** (1–2 sentences) — Behavioral takeaway.
6. **Close** (1 sentence) — Open invitation.

**Must have:**
- A folk understanding stated charitably — most readers should recognize it as theirs.
- A corrected model built up incrementally, not dropped in.
- Acknowledgment of why the folk view exists.

**Must not have:**
- "Actually," voice. Curse-of-knowledge unwind only works without condescension.
- A "corrected model" that's just a different folk understanding.
- An overcomplicated correction.

**Anti-pattern:** Expert-flex disguised as teaching. The test: does a reader emerge feeling smart, or feeling lectured?

**Worked spine** (Sage/Magician archetype, marketing/data):
```
PROBABLY     "If you've never had to think about LinkedIn's
BELIEVES:    algorithm, the natural model is 'good content
              gets more reach.' Make better posts → bigger
              audience."
INCOMPLETE:  "What that model misses is that reach happens in
              two phases: an initial test push to a small slice
              of your network, then expansion based on the test
              push's engagement-rate."
CORRECTED:   "Imagine LinkedIn drops your post into a sample of
              ~5% of your followers. If they engage above some
              threshold in the first hour, it goes to another
              slice. And so on, in waves. Each wave is gated by
              the previous wave's engagement-rate.
              That means: a post seen by 200 people with 30
              comments can outperform a post seen by 200 with
              5 comments — because the first triggered the next
              wave, the second didn't."
WHY          "Folk view persists because the dominant feedback
PERSISTS:    you see — your view count — is the *outcome* of
              the wave model. The mechanism is invisible."
CHANGES:     "Optimizing for engagement-rate in the first hour
              matters more than optimizing for any single later
              metric. That's why thoughtful framing of openers
              and timing of the publish actually beats 'better
              content' on the margin."
CLOSE:       "Same shape probably true for Twitter — anyone
              with hard numbers on it?"
```

**Skip this framework when:**
- The folk understanding is too varied — different readers hold different views.
- The corrected model is too technical for the post format.
- The user is too close to the topic and can't see the folk view honestly.

---

### Framework: cookbook

**Origin:** Recipe-writing tradition; software-engineering "cookbook" reference style.

**Best for:** Educational. Some Promotional when the recipe is the product's value.

**Avoid for:** Personal, Thought-leadership.

**Default arc:** Classic.

**Compatible hooks:** `stat-anchored`, `bad-advice`, `mistake-confession`.

**Length sweet spot:** 300–500 words.

**Shape:**
1. **What this gets you** (1–2 sentences) — The outcome, plainly. Reader knows whether to keep reading.
2. **Ingredients** (3–6 lines) — What the reader needs to have before starting.
3. **Steps** (5–9 lines, numbered) — Specific. Each step has a verb.
4. **Variations** (2–4 lines) — When to deviate, and what to substitute.
5. **Common mistake** (1–2 sentences) — The one place readers go wrong.
6. **Close** (1 sentence) — Where to find the next thing.

**Must have:**
- An outcome stated upfront — no bait-and-switch.
- Steps specific enough another person could follow without asking questions.
- A variation section — recipes that don't acknowledge variation are too rigid.

**Must not have:**
- Steps that hide judgment calls ("use the right tool"). Specify.
- A "common mistake" that's just a restatement of a step.
- Vagueness anywhere — cookbook is the framework that punishes vagueness most.

**Anti-pattern:** Cookbook-as-essay. The framework reads as instructions. If a "step" needs three sentences of context, it's two steps.

**Worked spine** (Sage/Creator archetype, ops):
```
GETS YOU:    "A one-page weekly update that takes you 15 minutes
              to write and that your leadership team will actually
              read."
INGREDIENTS: "- A list of the 3-7 things your team did this week
              - Your team's roadmap for the current quarter
              - The single number you're tracking this week
              - 25 minutes (you'll only use 15, but block 25)"
STEPS:       "1. Open with the metric, and whether it moved.
              2. Below it, write 'What we did' — 3-5 bullets,
                 each one sentence. Past tense. No 'we worked on.'
              3. Below that, write 'What we didn't do' — 1-2 things
                 you planned but cut. Be specific about why.
              4. Below that, write 'What we need from you' — 0 or
                 1 thing. Most weeks, leave this blank.
              5. Below that, write 'Next week.' Three bullets.
                 Future tense. Concrete.
              6. Read it aloud. If any sentence has 'continued'
                 or 'ongoing,' rewrite it.
              7. Send."
VARIATIONS:  "- If you have multiple sub-teams, repeat the structure
              under sub-headers. Don't add prose between sections.
              - If your number is hard to read, add one sentence
              of context — never a paragraph."
MISTAKE:     "Skipping 'What we didn't do.' Updates without
              tradeoffs read as task lists. The tradeoff is what
              makes the update strategic."
CLOSE:       "Want the version with attached templates? Comment
              and I'll share."
```

**Skip this framework when:**
- The thing being taught doesn't decompose into steps.
- The user can't be specific about ingredients.
- The audience already knows how to do the thing — cookbook for experts is condescending.

---

## Promotional (10%)

**What it's for:** Directly promoting a product, feature, hire, event, or case study.

**Length target:** 150–300 words.

**Must have:**
- A genuine audience problem, not a product feature dressed as one.
- A specific thing being promoted.
- A clear, low-friction ask.

**Must not have:**
- Generic "we're excited to announce" openers.
- Feature lists without context.
- Begging for engagement.

### Framework: story-first-promo

**Origin:** Indie-creator marketing tradition; opposite of feature-list announcements.

**Best for:** Promotional. Some Work when the launch is the work.

**Avoid for:** Personal, Thought-leadership.

**Default arc:** Classic.

**Compatible hooks:** `origin-first`, `counter-anti-promo`, `temporal-jump-cut`.

**Length sweet spot:** 180–280 words.

**Shape:**
1. **A real story** (60–80% of the post) — A specific situation, person, or problem. Has to be valuable even if the reader never converts.
2. **The natural pivot** (1–2 sentences) — Where the story connects to the thing being launched.
3. **What we built** (2–3 sentences) — Brief, focused on the problem it solves, not the feature list.
4. **One specific proof** (1–2 sentences) — A customer outcome, a metric, a use case.
5. **The ask** (1 sentence) — Low-friction. Link in comments often beats inline link.
6. **Close** (1 sentence) — Often a question or invitation, not "buy now."

**Must have:**
- A story or insight that holds up on its own.
- A pivot that doesn't feel like a sales tactic.
- An ask that respects the reader's time.

**Must not have:**
- Three paragraphs of story followed by a five-paragraph pitch.
- A story invented to make the launch fit.
- Multiple asks ("DM me / comment / sign up").

**Anti-pattern:** Story-as-bait. Reader engages with the story, gets blindsided by a sales pitch. The pivot has to feel honest.

**Worked spine** (Magician/Creator archetype, launch):
```
STORY:       "Last quarter I watched a customer's lifecycle
              marketer run a campaign across three tools. The
              triggers lived in one. The send logic in another.
              The reporting in a third. She kept a Google Doc
              open just to remember which tool controlled what.
              Halfway through the campaign, she found a logic
              error that she'd missed because the three tools
              showed it differently. She fixed it in tool one
              and tool two said the campaign was running fine.
              Tool three said it hadn't fired in 48 hours."
PIVOT:       "Most lifecycle work today is like this — the work
              isn't building the campaign. It's tracking what
              your tools think is happening."
BUILT:       "We just shipped PushEngage Workflows — one canvas
              for triggers, logic, branching, A/B, exits.
              All in the same view. All sharing one data model."
PROOF:       "Our beta customer running 11 active campaigns moved
              everything to Workflows in two weeks. Her Google
              Doc is gone."
ASK:         "Try it: link in comments."
CLOSE:       "Curious to hear what tool-juggling pattern you're
              still living with."
```

**Skip this framework when:**
- The user has no real story to lead with — invented stories read false.
- The launch is small enough that a story arc bloats it.
- The audience already knows the launch is coming — direct framing wins.

---

### Framework: i-built-this-because

**Origin:** Maker tradition (Indie Hackers / build-in-public).

**Best for:** Promotional. Some Personal when the build is identity-defining.

**Avoid for:** Thought-leadership (too inward), Educational.

**Default arc:** Classic.

**Compatible hooks:** `origin-first`, `mistake-confession`, `temporal-jump-cut`.

**Length sweet spot:** 180–280 words.

**Shape:**
1. **The original problem** (2–4 sentences) — The personal pain that prompted the build.
2. **What I tried first** (2–3 sentences) — Existing tools, workarounds. Honest about why they failed.
3. **What I built** (3–4 sentences) — The thing being promoted, but framed as the solution to *that* problem.
4. **What's true now that wasn't before** (1–2 sentences) — A specific concrete difference.
5. **The ask** (1 sentence) — Low-friction.
6. **Close** (1 sentence) — Often inviting others' workarounds.

**Must have:**
- A real, personal problem — not "many of us face the challenge of…"
- An honest accounting of what existed before.
- A "what's true now" that's a specific change, not a feature list.

**Must not have:**
- Pretending no other tools exist.
- An origin story so dramatic it overshadows the launch.
- "I built it for me — and now you can use it too" without showing the path.

**Anti-pattern:** Origin-story as marketing copy. The "why I built this" should feel like an explanation, not a sales angle.

**Worked spine** (Creator/Hero archetype, launch):
```
PROBLEM:     "For three years I ran lifecycle campaigns where
              the trigger lived in one tool and the send lived
              in another. Every campaign meant context-switching
              between dashboards and trusting that two systems
              agreed on what 'fired' meant."
TRIED:       "I tried building automations in Zapier to bridge
              them. It worked for simple campaigns. Anything
              with branching logic became its own debugging
              project."
BUILT:       "So we built Workflows — one canvas, one data model,
              one place where triggers and logic and sends and
              exits all live. The mental model is what a marketer
              would draw on a whiteboard. Now it runs."
NOW TRUE:    "I haven't opened a second tool to verify a campaign
              fired correctly in two months."
ASK:         "Try it: link in comments."
CLOSE:       "If anyone has a tool-juggling story worse than mine,
              I want to hear it."
```

**Skip this framework when:**
- The user wasn't actually the builder, or the "I" in "I built this" is misleading.
- The original pain is generic.
- The thing being promoted isn't really a solution to the stated problem.

---

### Framework: receipt-stack-soft-ask

**Origin:** Indie-creator monetization tradition; "social proof first, ask after."

**Best for:** Promotional. Especially for cohort launches, courses, paid products.

**Avoid for:** Personal, Thought-leadership.

**Default arc:** Classic.

**Compatible hooks:** `stat-anchored`, `origin-first`, `counter-anti-promo`.

**Length sweet spot:** 150–250 words.

**Shape:**
1. **A clear opener** (1 sentence) — What's being offered.
2. **Receipt 1** — A specific outcome with numbers, named cohort, or quote.
3. **Receipt 2** — Different angle (customer type, use case, metric).
4. **Receipt 3** *(optional)* — Pattern proof.
5. **The soft ask** (1–2 sentences) — "We're opening to X more." Specific, limited.
6. **Close** (1 sentence) — Often a follow-up question or instruction.

**Must have:**
- Receipts specific enough to be checkable.
- A limit on the ask (cohort size, time-bound, etc.).
- Soft framing — never "buy now."

**Must not have:**
- Fake limits ("only 47 spots left!" when actually unlimited).
- Receipts that are just praise without outcomes.
- Multiple asks.

**Anti-pattern:** Receipt-stack-as-flex. The stack has to support the soft ask, not stand alone as humble-brag.

**Worked spine** (Magician/Hero archetype, cohort launch):
```
OPENER:      "We're opening 30 spots in the next cohort of the
              push-notification audit program."
RECEIPT 1:   "Last cohort: 14 teams. 11 increased engagement-rate
              above 4% within 60 days of the audit. 3 didn't —
              two were too early-stage, one had a different
              problem entirely."
RECEIPT 2:   "Average engagement gain across the 11: 38%.
              Average cost recovery from cleanup: $12K in
              annualized list-cleanup savings."
RECEIPT 3:   "One team replaced their entire push stack 6 months
              later. The audit was where the decision started."
SOFT ASK:    "30 spots. Starts the week of [date]. Comment 'audit'
              if you want details."
CLOSE:       "If you're not ready to commit, the post-mortem
              from cohort 1 is linked in my bio — read that
              first."
```

**Skip this framework when:**
- The receipts aren't real, or can't be shared publicly.
- The user is uncomfortable with social-proof-driven asks (tonally off-brand).
- The ask is too small for the receipt stack — overkill.

---

### Framework: anti-launch

**Origin:** Counter-cultural marketing tradition; "tell people who this is NOT for."

**Best for:** Promotional. Especially good for opinionated products.

**Avoid for:** Personal, Educational.

**Default arc:** Frame-Break or Classic.

**Compatible hooks:** `counter-anti-promo`, `bad-advice`, `inverted-truism`.

**Length sweet spot:** 180–280 words.

**Shape:**
1. **What we just shipped** (1–2 sentences) — Plain, no hype.
2. **Who it's NOT for** (3–5 sentences) — Honest disqualification. Audience signals removed.
3. **Who it IS for** (3–4 sentences) — Specific. Often more selective than expected.
4. **Why we made it this opinionated** (2–3 sentences) — The point of view.
5. **The ask** (1 sentence) — Low-friction. Usually requires action that filters.
6. **Close** (1 sentence) — Sometimes an unsentimental sign-off.

**Must have:**
- A real disqualification — at least one named audience that should NOT use it.
- An honest "why we're being opinionated" — point of view, not flexing.
- A selective ask — filtering out the wrong-fit at the door.

**Must not have:**
- Fake disqualification ("not for people who don't want to grow") — that's everyone.
- "Who it's NOT for" that doubles as humble-brag ("not for casual users").
- An ask that contradicts the filtering.

**Anti-pattern:** Anti-launch as marketing tactic. If the disqualifications are insincere, the audience smells it.

**Worked spine** (Magician/Outlaw archetype, product launch):
```
SHIPPED:     "We just shipped Workflows v2 — visual lifecycle
              canvas with branching, A/B, and conditional logic."
NOT FOR:     "If you send fewer than 5 campaigns a year, this
              won't help. The mental-overhead it saves only
              matters if you're juggling. If you only need
              broadcast push (single send, no follow-up), use
              the basic builder — Workflows will feel like
              overkill. If your team has a dedicated lifecycle
              engineer, you'll outgrow this — go custom."
IS FOR:      "Marketers running 5+ campaigns at once who don't
              have a lifecycle engineer. Teams where the
              marketer designs and the engineer doesn't ship
              for them. Cases where the campaign logic is in
              the marketer's head and needs to live in a tool
              instead."
WHY:         "We could have built a generic automation tool.
              We picked a narrow lane — opinionated about who
              this is for — so we could nail the experience
              for that group rather than be mediocre for
              everyone."
ASK:         "Fit description? Reply 'workflows' for early access."
CLOSE:       "If you're not in that lane, we'll point you to
              what is."
```

**Skip this framework when:**
- The product genuinely IS for everyone — the framework will feel forced.
- The user's brand isn't comfortable with strong filtering.
- The "who it's not for" is too narrow to actually filter.

---

## Length discipline summary

| Type | Min | Max | Typical |
|---|---|---|---|
| Personal | 80 | 300 | 180 |
| Work | 200 | 400 | 270 |
| Thought-leadership | 220 | 400 | 300 |
| Educational | 260 | 500 | 350 |
| Promotional | 150 | 300 | 220 |

Framework-specific sweet spots above are guidance. If a draft lands outside the type's Min–Max window, rewrite before emitting. Length isn't arbitrary — each type's weight in the mix needs its typical range to land.

## Framework rotation rule

When generating a post, after the type is selected:

1. Read the active persona's `history.yaml`. Note frameworks used in the last 4 posts (configurable).
2. Filter the catalog for the chosen type to frameworks NOT in that recent list.
3. Rank remaining candidates by archetype fit (each framework's `Skip when` clauses are the filter) and by topic fit (frameworks that need receipts skip topics that are abstract).
4. Pick the top candidate. If user passed `--framework <name>`, use that instead.
5. Log the framework name to the new post's `history.yaml` entry.

Full algorithm in `content-mix.md`.
