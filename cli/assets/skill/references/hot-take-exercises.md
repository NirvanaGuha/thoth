# Hot Take & Anti-Voice Exercises

A voice that's built only from "what do I like?" ends up bland. You need **contrast** — what you *don't* want to sound like, what you actively disagree with, the sacred cows you'd poke at. This is where real voice shows up.

These exercises run during the onboarding interview and produce three YAML blocks in `persona.md` (see `references/persona-template.md` for exact structure):

1. `anti_voice` — specific voices / patterns the user refuses to sound like.
2. `contrarian_beliefs` — things the user believes that most of their industry or peer group would push back on.
3. `signature_grievances` — the things that consistently annoy the user about how their field is discussed.

These three sections are consulted during **every** post generation. They're the guard-rails that keep the voice from drifting into industry-average LinkedIn-ese.

---

## Exercise 1 — The "I would never" list

Prompt to the user:

> *"List 3–5 specific LinkedIn or writer personalities you actively don't want to sound like. Could be archetypes ('the productivity influencer who's selling a course'), specific people if you're comfortable naming them, or verbal tics ('posts that start with "Excited to share..."'). The more specific, the better."*

For each one the user names, follow up with:
- *"What specifically bugs you about that voice?"*
- *"If they wrote about the same topic as you, what would they say that you wouldn't?"*

Record in `persona.md` under the `anti_voice:` YAML block (per `references/persona-template.md`) with the **user's own words** for the rejected pattern. These words become the matchers for the voice check.

**Good anti-voice entries (specific, actionable):**
- "Any post that opens with 'I'll be honest' or 'Here's the truth' — if you have to announce you're being honest, you're probably not."
- "The 'I asked 100 founders and here's what I learned' template — never writing that."
- "Humble-brags about failure that are really just wins disguised as lessons."

**Bad anti-voice entries (vague, useless for filtering):**
- "Corporate speak" (too generic)
- "Boring posts" (subjective, not actionable)
- "Too salesy" (captured elsewhere)

Push the user for specifics. If they give a vague answer, ask: *"Can you paste an example or describe what the sentence structure looks like?"*

---

## Exercise 2 — The contrarian-belief elicitation

Prompt:

> *"What do you believe about [your field / your work] that most of your peers would disagree with or find uncomfortable? Not a petty disagreement — something you've been chewing on that you think the conventional wisdom gets wrong. One or two is fine; three or four is great."*

Expect hesitation. Most people don't have these at the front of their mind. If the user stalls, offer scaffolds:

- *"What's something you used to believe that you now think is wrong?"*
- *"What advice do you ignore that you're 'supposed' to follow?"*
- *"What question in your field do you think most people are answering wrongly?"*

For each contrarian belief the user offers, ask:
- *"What evidence or experience makes you believe this?"*
- *"What would change your mind?"*

The "what would change your mind" answer is crucial — it's what keeps the contrarian voice from tipping into Outlaw-shadow-side empty contrarianism. A contrarian who can articulate their own disconfirming evidence sounds credible; one who can't sounds like a crank.

Record in `persona.md` under the `contrarian_beliefs:` YAML block (per `references/persona-template.md`) with:
- the belief (`belief:`)
- the user's supporting experience, one line (`support:`)
- the disconfirming-evidence standard (`would_change_mind:`)

**Good contrarian-belief entries:**
- *Belief:* "Most startup advice is survivorship bias dressed as strategy."
  *Support:* "I've watched three friends fail running the same playbook that worked for [famous founder]."
  *Change my mind:* "Rigorous meta-analysis across failures too."
- *Belief:* "Push notifications as a channel are under-measured because most teams only count opens."
  *Support:* "We've seen 4x downstream LTV from a segment that never opens but always converts."
  *Change my mind:* "A better attribution model that disproves the assisted-conversion pattern."

---

## Exercise 3 — The signature grievance

Prompt:

> *"What's the thing about how your industry or your role is talked about on LinkedIn that makes you roll your eyes the hardest? The phrase, the trope, the annual trend, the performative outrage, whatever."*

This is the lightest exercise — it warms the user up, it's usually funny, and it surfaces a lot of voice texture.

For each grievance, ask:
- *"What do you wish people would say instead?"*

Record in `persona.md` under the `signature_grievances:` YAML block (per `references/persona-template.md`) with both the grievance (`grievance:`) and the replacement (`replacement:`).

**Good grievance entries:**
- *Grievance:* "Anyone calling themselves a 'full-stack growth leader.'"
  *Replacement:* "Say what you actually did. Ran SEO? Say 'did SEO.' "
- *Grievance:* "The annual 'AI will replace X' posts that are really just LinkedIn engagement farming."
  *Replacement:* "Fewer predictions, more specifics about what you're actually building with AI."

Grievances are *optional content fuel* — Thoth can use them as seeds for Thought-leadership posts when the user runs out of other topics.

---

## How these get used

### During every voice check
- **Anti-voice:** Scan the draft for any matcher pattern from `anti_voice`. If found, rewrite. No negotiation.
- **Contrarian-belief:** If the draft contradicts a stated `contrarian_beliefs` entry, rewrite — unless the user has explicitly updated it in their recent inputs.
- **Signature-grievance:** If the draft uses a phrase the user flagged in `signature_grievances`, rewrite.

### As topic seeds
When rotating through the topic bank and nothing fresh is obvious, pull a contrarian belief or grievance and propose a Thought-leadership post around it. Always re-ground the draft in a concrete example before emitting — abstract contrarianism reads as empty.

---

## Re-running these exercises

Voices evolve. Every 3 months of active posting, suggest: *"We've done 60+ posts. Want to revisit your anti-voice and contrarian beliefs? Sometimes the things that annoyed you six months ago have shifted."*

Do not re-run automatically — it's a prompt, not a mandate.

---

## Anti-exploitation note

The contrarian-belief exercise can produce posts that will provoke engagement for the wrong reasons. Before using a contrarian belief as a post seed, silently check:

1. Is this belief something the user could **actually defend** with specifics (their own experience, data, a case study)? If no, don't use it.
2. Would this belief, if taken the wrong way, damage the user's employer, client, or peers? If yes, flag before generating: *"The contrarian belief about X could be read as attacking your current employer. Still want me to draft it?"*
3. Is the contrarian belief *about a person or group* rather than an idea or practice? If yes, reshape it toward the idea/practice before using.

Contrarianism in service of better thinking → good. Contrarianism as algorithm-bait → not what this skill does.
