# Persona Template

When a new persona folder is created, populate `persona.md` with this template. Placeholder values are in `<angle-brackets>`. The onboarding interview fills them in.

The file mixes markdown prose with fenced YAML blocks for structured data. Thoth reads the whole file and extracts both. Keep the YAML field names exactly as shown — `SKILL.md`'s generate-flow and voice-check both depend on these names.

```markdown
---
STATUS: DRAFT    # Change to ACTIVE when onboarding completes
username: <name>
created: <YYYY-MM-DD>
last_updated: <YYYY-MM-DD>
---

# <name>'s LinkedIn Voice Persona

## Role & audience

**Role:** <job title and the specific thing they're responsible for>

**Primary audience:** <peers / hiring managers / customers / community / other>

**12-month goal:** <what they want to be known for>

---

## Archetype

```yaml
archetype:
  dominant: <one of: hero, outlaw, magician, everyman, lover, jester, caregiver, creator, ruler, innocent, sage, explorer>
  secondary: <one of the 12 (must be from a different orientation than dominant)>
  dominant_notes: |
    <one paragraph paraphrase from brand-archetypes.md, tailored to this user>
```

**Sounds like (user-approved example):**
> <a 2-sentence example the user reacted positively to during onboarding>

---

## Tone

```yaml
tone:
  formal_casual: <1-5>         # 1 = formal, 5 = casual
  serious_funny: <1-5>         # 1 = serious, 5 = funny
  respectful_irreverent: <1-5> # 1 = respectful, 5 = irreverent
  matter_of_fact_enthusiastic: <1-5>  # 1 = matter-of-fact, 5 = enthusiastic
  drift_rules:
    personal: "<e.g., '+1 casual, +1 enthusiastic'>"
    work: "<drift rules or 'none'>"
    thought_leadership: "<drift rules or 'none'>"
    educational: "<drift rules or 'none'>"
    promotional: "<drift rules or 'none'>"
```

---

## Anti-voice

Voices and patterns explicitly to avoid. Matchers run during voice check.

```yaml
anti_voice:
  - "<specific pattern 1>"
  - "<specific pattern 2>"
  - "<specific pattern 3>"
```

---

## Contrarian beliefs

Beliefs the user holds that most of their peer group would push back on. Used as seeds for Thought-leadership posts.

```yaml
contrarian_beliefs:
  - belief: "<one-line belief>"
    support: "<one-line supporting experience>"
    would_change_mind: "<disconfirming standard>"
  - belief: "<...>"
    support: "<...>"
    would_change_mind: "<...>"
```

---

## Signature grievances

Phrases, tropes, or trends in the user's industry the user would push back on. Used to guard against drift and as optional topic seeds.

```yaml
signature_grievances:
  - grievance: "<...>"
    replacement: "<what should be said instead>"
```

---

## Output preferences

```yaml
output_preferences:
  length: <short | standard | long | vary>
  hashtags: <always | sparingly | never | case-by-case>  # never exceed 4 regardless
  emojis: <none | light | moderate | heavy>
  first_person: <I | we | varies>
  sign_off: <question | reflection | cta | none>
```

---

## Free-form notes

<anything else the user wants Thoth to remember — quirks, constraints, running jokes, specific phrases they love, specific phrases they hate>
```

## Reading this file

When Thoth loads `persona.md`:

1. Parse the top-level YAML frontmatter for `STATUS`, `username`, `created`, `last_updated`.
2. For each section, read the fenced YAML block where present and extract the keys exactly as named. Markdown prose sections are read as-is.
3. The canonical field names — `archetype.dominant`, `archetype.secondary`, `archetype.dominant_notes`, `tone.formal_casual`, etc. — are what SKILL.md's voice-check references. Don't rename them.
