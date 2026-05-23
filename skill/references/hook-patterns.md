# Hook Patterns

The first 1–2 lines of a LinkedIn post determine whether anyone reads the rest. Hooks are independent of post-frameworks — a Heretical-Claim framework can open with several different hook patterns, depending on the persona's archetype and the topic.

This file catalogs 12 named hook patterns. Each generator pass picks **one framework** (from `post-types.md`) and **one compatible hook pattern** (from this file).

## How to use this file

When `/thoth` (generate a post) reaches the "pick hook" step:

1. Read the chosen framework's `compatible_hooks:` list.
2. Cross-reference the active persona's archetype against each candidate's `archetype_fit`.
3. Pick one hook the persona hasn't used in the last N posts (default N=3, read from `history.yaml`).
4. After generation, log the hook name to `history.yaml` so rotation works next time.

User override: `/thoth <type> --hook <name>`.

---

## Glossary

| Hook | One-line shape |
|---|---|
| `micro-confession` | "I almost didn't post this." |
| `temporal-jump-cut` | "Six months ago, I was…" |
| `anti-credential` | "Nobody asked me to do this." |
| `constraint-reveal` | "We had 3 weeks and one engineer." |
| `broken-thing` | "Last Tuesday at 2am, prod went down." |
| `inverted-truism` | "Everyone says X. They're wrong." |
| `conviction-with-receipts` | "I've watched 50 teams fail at X. There's one pattern." |
| `changed-my-mind` | "I used to believe X. I don't anymore." |
| `bad-advice` | "Most advice on X is wrong because it ignores Y." |
| `mistake-confession` | "I made this mistake 4 times before I understood it." |
| `stat-anchored` | "73% of teams do X. It's the wrong move." |
| `origin-first` | "Three years ago I had this problem. I just shipped the answer." |
| `counter-anti-promo` | "I don't normally do launch posts. Here's why this one is different." |

(13 listed — the catalog is officially 12 but `counter-anti-promo` is a sibling of `origin-first` and the rotation treats them as the same pattern slot.)

---

## Personal/Work-leaning hooks

### micro-confession

**Shape:** Open by admitting hesitance about the post itself or a small private discomfort. Earns trust immediately by lowering performative stakes.

**Example:** *"I almost didn't post this. It feels too small to share. But it's been on my mind all week."*

**Best with frameworks:** `quiet-reveal`, `the-confession`, `gratitude-specific`.

**Avoid with:** `heretical-claim-receipts-stake`, `first-principles-reframe`, `pmrg` — undercuts the conviction those need.

**Archetype fit:** Strong for Caregiver, Everyman, Innocent. Decent for Hero, Lover. Weak for Outlaw, Ruler.

**Failure mode:** Hesitance becomes performative ("I'm nervous to share…" when the post is clearly polished). Reads as humble-brag.

---

### temporal-jump-cut

**Shape:** Drop the reader into a moment in time, then jump back to the present. The contrast does the work.

**Example:** *"Six months ago, I was rage-quitting at 2am over a build that wouldn't deploy. Last night I shipped without thinking about it."*

**Best with frameworks:** `then-now-because`, `quiet-reveal`, `the-confession`, `decision-log`.

**Avoid with:** `cookbook`, `anti-pattern-catalog` — temporal framing fights structured teaching.

**Archetype fit:** Universal. Especially strong for Hero (transformation arc) and Magician (epiphany arc).

**Failure mode:** The "then" state is vague ("a year ago I struggled with…"). The "then" needs to be specific enough that the reader can picture it.

---

### anti-credential

**Shape:** Open by undermining your own authority on the topic. Makes what follows more credible because it isn't "expert pronouncement."

**Example:** *"Nobody asked me to write this. I'm not the smartest person in the room on this topic. But I've spent enough nights staring at the problem to have an opinion."*

**Best with frameworks:** `quiet-reveal`, `the-confession`, `changed-my-mind`.

**Avoid with:** `heretical-claim-receipts-stake`, `cookbook`, `receipt-stack-soft-ask` — credentials matter for those.

**Archetype fit:** Strong for Magician, Sage (when used as deliberate counter-positioning), Outlaw, Explorer. Weak for Ruler, Hero in their direct mode.

**Failure mode:** False modesty. If the author IS the expert, this reads as fishing for "actually, your take is great."

---

### constraint-reveal

**Shape:** Open with the constraint, not the achievement. The constraint makes any subsequent decision interesting.

**Example:** *"We had three weeks. One engineer. And a board demo on the calendar."*

**Best with frameworks:** `decision-log`, `failed-experiment`, `constraint-driven-story`, `i-built-this-because`.

**Avoid with:** `quiet-reveal`, `confession` — constraints set up problem-solving energy that quiet arcs deflate.

**Archetype fit:** Strong for Creator, Hero, Magician, Explorer. Weak for Lover, Innocent (sounds too engineering-flavored).

**Failure mode:** Bragging dressed as constraint ("we had only $10M and a team of 30 to ship this"). Constraints have to feel tight to the reader's intuition.

---

### broken-thing

**Shape:** Open in the middle of a failure or crisis moment. Specific, sensory, low-tech.

**Example:** *"Last Tuesday at 2am, prod went down. The on-call channel had seventeen unread messages by the time I rolled over and saw my phone."*

**Best with frameworks:** `failed-experiment`, `pre-mortem`, `decision-log`, `pmrg`.

**Avoid with:** `quiet-reveal`, `the-confession`, `i-built-this-because` — the crisis energy mismatches.

**Archetype fit:** Strong for Hero, Magician, Outlaw, Sage (forensic-mode). Weak for Caregiver, Innocent.

**Failure mode:** Catastrophizing minor things. "Prod went down" beats "I had a difficult Slack thread."

---

## Thought-leadership-leaning hooks

### inverted-truism

**Shape:** State the consensus your audience holds, then announce you disagree, all in 1–2 lines.

**Example:** *"Everyone says push notification open rates are the metric to optimize. I think open rate is the wrong frame entirely."*

**Best with frameworks:** `heretical-claim-receipts-stake`, `first-principles-reframe`, `steel-man-then-dismantle`.

**Avoid with:** `quiet-reveal`, `gratitude-specific`, `cookbook` — wrong energy.

**Archetype fit:** Strong for Magician, Outlaw, Ruler, Sage. Weak for Caregiver, Innocent.

**Failure mode:** Inverting a truism nobody actually believes. The consensus must be one your audience *holds*, not a strawman. Test: would three peers in your field nod at the "everyone says" line before disagreeing with the inversion?

---

### conviction-with-receipts

**Shape:** Open with the pattern you've seen (number, breadth, repetition), then a sharp claim about what it means.

**Example:** *"I've audited 50+ push programs in the last two years. There's one pattern that separates the ones that work from the ones that don't, and almost nobody is doing it."*

**Best with frameworks:** `heretical-claim-receipts-stake`, `first-principles-reframe`, `anti-pattern-catalog`.

**Avoid with:** `quiet-reveal`, `i-built-this-because` — sets up too much expectation for those frames.

**Archetype fit:** Strong for Sage, Magician, Ruler. Decent for Hero. Weak for Explorer, Innocent.

**Failure mode:** The number is made up or unfalsifiable. "I've worked with countless teams" is invisible. "47 teams in the last 18 months" is checkable, even if nobody checks.

---

### changed-my-mind

**Shape:** Announce a belief you used to hold and have since updated. The shift itself is the hook.

**Example:** *"For five years I thought push notifications were a low-ROI channel. I've spent the last 18 months disproving my own argument."*

**Best with frameworks:** `the-confession`, `then-now-because`, `first-principles-reframe`, `i-built-this-because`.

**Avoid with:** `cookbook`, `pmrg`, `anti-pattern-catalog` — those need stable conviction, not a public flip.

**Archetype fit:** Strong for Sage, Magician, Explorer. Decent for everyone — it's the single most credibility-building move on LinkedIn.

**Failure mode:** The original belief was a strawman you never actually held. The shift only lands if the original belief was honest.

---

## Educational-leaning hooks

### bad-advice

**Shape:** Name the prevailing advice and explain why it's wrong, all in 1–2 lines.

**Example:** *"Most advice on hiring your first marketer is wrong because it assumes the marketer's first month is about strategy. It's not."*

**Best with frameworks:** `anti-pattern-catalog`, `first-principles-reframe`, `curse-of-knowledge-unwind`.

**Avoid with:** `quiet-reveal`, `gratitude-specific` — wrong energy.

**Archetype fit:** Strong for Sage, Magician, Outlaw, Ruler. Weak for Caregiver, Innocent.

**Failure mode:** Punching down at named individuals or specific posts. Critique the pattern, not the person.

---

### mistake-confession

**Shape:** Open by admitting a specific mistake you made repeatedly. Names it concretely.

**Example:** *"I made this mistake four times before I understood it. Costing me about six months of progress each round."*

**Best with frameworks:** `pmrg`, `the-confession`, `anti-pattern-catalog`, `failed-experiment`.

**Avoid with:** `heretical-claim-receipts-stake`, `receipt-stack-soft-ask` — credibility tone mismatch.

**Archetype fit:** Strong for Everyman, Sage (when self-aware), Magician, Hero (vulnerable mode). Weak for Ruler.

**Failure mode:** The "mistake" is humble-brag in disguise ("I cared too much"). Real mistakes have specific costs.

---

### stat-anchored

**Shape:** Open with a striking number that frames the problem space.

**Example:** *"73% of B2B marketers say content is their top channel. Only 14% can name a single piece that drove revenue last quarter."*

**Best with frameworks:** `pmrg`, `cookbook`, `anti-pattern-catalog`, `first-principles-reframe`.

**Avoid with:** `quiet-reveal`, `the-confession`, `gratitude-specific` — stats puncture intimate frames.

**Archetype fit:** Strong for Sage, Ruler. Decent for Magician. Weak for Lover, Innocent, Caregiver.

**Failure mode:** Stat without source the reader could chase, or stat from a clearly biased survey. The number has to be defensible if asked. Also: stat that's surprising for no reason — every stat needs a stake attached.

---

## Promotional-leaning hooks

### origin-first

**Shape:** Anchor the promotion in the personal problem that prompted the build. Feature comes last, or implicitly.

**Example:** *"Three years ago I had this problem with push campaigns. I just shipped the answer."*

**Best with frameworks:** `i-built-this-because`, `story-first-promo`, `receipt-stack-soft-ask`.

**Avoid with:** `heretical-claim-receipts-stake`, `cookbook` — those are content-mode, not promo-mode.

**Archetype fit:** Strong for Creator, Hero, Magician, Lover. Weak for Sage (sounds too auto-bio).

**Failure mode:** The "three years ago" origin is invented or padded. The arc has to track an honest motivation.

---

### counter-anti-promo

**Shape:** Open by acknowledging promotional posts are usually skippable, then explain why this one is different.

**Example:** *"I don't normally do launch posts. The last one I wrote was eight months ago. Here's why this is different."*

**Best with frameworks:** `anti-launch`, `story-first-promo`, `i-built-this-because`.

**Avoid with:** `receipt-stack-soft-ask` — the two are slightly different anti-promo moves; using both reads as overthought.

**Archetype fit:** Strong for Sage, Magician, Outlaw, Everyman. Weak for Hero (sounds falsely modest).

**Failure mode:** This becomes a tic if used more than ~once per quarter. Reader picks up the move and it stops working.

---

## Compatibility matrix (skim view)

| Hook | Personal | Work | Thought | Educational | Promotional |
|---|---|---|---|---|---|
| micro-confession | ●●● | ● | — | — | — |
| temporal-jump-cut | ●●● | ●● | ●● | ● | ●● |
| anti-credential | ●● | ● | ●● | ● | — |
| constraint-reveal | ● | ●●● | ● | — | ●● |
| broken-thing | ● | ●●● | ● | ● | — |
| inverted-truism | — | — | ●●● | ●● | — |
| conviction-with-receipts | — | ● | ●●● | ●● | — |
| changed-my-mind | ●● | ● | ●●● | ●● | ● |
| bad-advice | — | — | ●● | ●●● | — |
| mistake-confession | ●● | ●● | ● | ●●● | — |
| stat-anchored | — | ● | ●● | ●●● | ●● |
| origin-first | ● | ●● | — | — | ●●● |
| counter-anti-promo | — | ● | ● | — | ●●● |

`●●●` = native fit, `●●` = works, `●` = possible but unusual, `—` = avoid.

This matrix is for fast lookup. The per-hook entries above are the source of truth.
