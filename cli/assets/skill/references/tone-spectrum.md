# Tone of Voice — Nielsen Norman 4-Dimensional Model

Based on Nielsen Norman Group's empirically-derived tone-of-voice model (Kate Moran et al., NN/g UX research, 2016). Any written voice can be plotted on four orthogonal axes. These four dimensions capture almost all of the perceived "tone" differences readers report.

Thoth records each user's **target position** on all four dimensions during onboarding, and uses those targets during the voice check.

---

## The four dimensions

```
    Formal  ←──────────────────→  Casual
   Serious  ←──────────────────→  Funny
Respectful  ←──────────────────→  Irreverent
   Matter-  ←──────────────────→  Enthusiastic
  of-fact
```

Each dimension is a continuous 1–5 spectrum, not a binary. Most real voices sit somewhere between the poles and move slightly depending on topic. The *target* is the user's home position — where the voice should default unless the topic pulls it elsewhere.

---

## Dimension 1 — Formal ↔ Casual

**Formal:** Complete sentences. Proper names. Measured pacing. No slang. "It would appear that..."
**Casual:** Fragments allowed. First names. Contractions. Light slang. "Yeah, this is weird — here's why."

**Formal readers perceive:** Authority, seriousness, caution.
**Casual readers perceive:** Accessibility, warmth, movement.

**For LinkedIn:** Pure formal reads stiff on this platform. Pure casual reads unserious for some roles (CFO, doctor, lawyer). Most strong voices sit between 2 and 4 on a 5-point scale, with 3 being a common sweet spot.

**Archetype pull:** Sage and Ruler tend more formal; Everyman and Jester more casual.

---

## Dimension 2 — Serious ↔ Funny

**Serious:** No jokes. No puns. Measured weight on the topic.
**Funny:** Active humor — wordplay, absurdity, irony, observational jokes.

**Serious readers perceive:** Gravity, trustworthiness, competence on weighty topics.
**Funny readers perceive:** Intelligence, humanity, approachability.

**For LinkedIn:** Humor works but is higher risk — a joke that misses reads as trying too hard. Users who aren't confident in their humor should target 2 (light wit) rather than 4 (active humor). Users whose personality is genuinely funny should target 4–5 but keep the humor in service of a point.

**Important:** Funny ≠ Jester archetype. A Sage can be funny (Matt Levine, David Sedaris). An Everyman can be dead serious. Keep these decoupled.

---

## Dimension 3 — Respectful ↔ Irreverent

**Respectful:** Honors conventions, authorities, and counterparts. Disagrees politely.
**Irreverent:** Willing to mock norms, call out dumb practices, use sharp language about ideas (not people).

**Respectful readers perceive:** Safety, diplomacy, professionalism.
**Irreverent readers perceive:** Confidence, realness, edge.

**For LinkedIn:** Irreverence does well algorithmically but carries employer/brand risk. A senior IC can often go harder than a founder whose company customers are reading. Calibrate against the user's actual job situation — ask during onboarding.

**Rule:** Irreverence is always about *ideas, practices, norms* — never about *specific people*. Punching down on a competitor or ex-colleague violates this dimension's spirit and is a Thoth hard-rule violation.

---

## Dimension 4 — Matter-of-fact ↔ Enthusiastic

**Matter-of-fact:** Flat affect. States what happened. Trusts the facts to carry weight. Few intensifiers.
**Enthusiastic:** Active energy. Uses words like "incredible," "love," "amazing." Exclamation points (sparingly). Expresses felt emotion.

**Matter-of-fact readers perceive:** Credibility, substance, quiet competence.
**Enthusiastic readers perceive:** Energy, passion, movement.

**For LinkedIn:** The platform defaults to enthusiastic — too much "🔥 HUGE NEWS 🔥" fatigue in feeds. A matter-of-fact voice on LinkedIn can actually stand out. But some archetypes (Hero, Explorer, Lover) need a little more energy than flat to land.

**Rule of thumb for target setting:** default 2 (quietly warm) unless the user's archetype pulls strongly toward enthusiastic (Hero-dominant Lover-secondary might land at 4).

---

## How Thoth uses the targets

During the interview, elicit a 1–5 target for each dimension. Record in `persona.md` as:

```yaml
tone:
  formal_casual: 3         # 1=formal, 5=casual
  serious_funny: 2         # 1=serious, 5=funny
  respectful_irreverent: 3 # 1=respectful, 5=irreverent
  matter_of_fact_enthusiastic: 2  # 1=matter-of-fact, 5=enthusiastic
  drift_rules:
    promotional: "+1 enthusiasm, -1 casual"  # promos lean slightly more formal/energetic
    personal:    "+1 casual"                 # personal stories warm up
```

### During voice check

For each dimension, score the draft 1–5 using the heuristics below, and compare to the target. Each axis can drift ±1 freely. Drifts of ±2 or more are **rewrite triggers**.

#### Quick scoring heuristics

**Formal ↔ Casual**
- 1: "One must consider..." "The company has announced that..."
- 2: Full sentences, no contractions, proper names.
- 3: Mix of full sentences and fragments, contractions fine, first names.
- 4: Lots of fragments, conversational tangents, "yeah," "so anyway."
- 5: Texting-style. "omg this is wild"

**Serious ↔ Funny**
- 1: Zero humor. All signal.
- 2: A single light turn of phrase, maybe. Wry, not comedic.
- 3: Occasional clearly-funny moment. Not the main vehicle.
- 4: Humor is a core vehicle. At least one joke or bit per post.
- 5: Comedic identity — the post IS the joke.

**Respectful ↔ Irreverent**
- 1: "With respect to my colleagues in..." Extremely diplomatic.
- 2: Polite, measured disagreement allowed.
- 3: Direct. Willing to call a bad practice bad, but kindly.
- 4: Sharp. Willing to mock ideas. Uses some strong language.
- 5: Full contrarian snark. "This whole discipline is a cargo cult."

**Matter-of-fact ↔ Enthusiastic**
- 1: No intensifiers. Flat, clean, reportorial.
- 2: Quiet warmth. Occasional "I like..." "What's interesting is..."
- 3: Visible enthusiasm when warranted. No "AMAZING!!!" though.
- 4: Active energy. Intensifiers present. Some exclamation points.
- 5: Hype tone. "INSANE growth. BLEW my mind. Game-changing."

---

## Combining archetype + tone

The archetype tells you *what* the voice is reaching for. Tone tells you *how* it sounds on the way there. The pairing matters:

- **Sage + matter-of-fact + serious:** Benedict Evans, Matt Levine (when analytical).
- **Sage + funny + irreverent:** Matt Levine (when riffing), David Graeber.
- **Hero + enthusiastic + respectful:** David Goggins stripped of the profanity.
- **Jester + casual + irreverent:** Alex Lieberman, Morgan Brown's more casual posts.
- **Caregiver + formal + matter-of-fact:** Many senior engineering managers with a service bent.

A single archetype can produce very different voices depending on tone targets. Onboarding captures both precisely for this reason.

---

## Attribution

Model adapted from: Moran, K. "The Four Dimensions of Tone of Voice" (Nielsen Norman Group, 2016). The empirical grounding of these four axes is the reason this model is preferred over looser "formal vs. friendly" binaries.
