# GitHub "About" sidebar — copy-paste ready

Paste the fields below into the repo's **About** settings (top-right of the repo page, gear icon).

---

## Description (short, 350 chars max)

> An open-source Claude skill that builds a unique, consistent LinkedIn voice. Framework-driven persona interview (Jungian archetypes + NN/g tone model + anti-voice) → daily post generation on a 30/25/20/15/10 content mix. Works for one person or a whole team. Install with one npx command.

## Website

```
https://nirvanaguha.github.io/thoth
```

*(or whatever landing page / docs site you set up — a `thoth.sh` / `usethoth.dev` style domain also reads well)*

---

## Topics (tags)

Paste these one at a time in the Topics field — GitHub limits to 20 tags, use all 20 for discovery:

```
claude
claude-skill
claude-code
claude-desktop
ai-skills
linkedin
linkedin-posts
personal-brand
thought-leadership
content-calendar
writing-assistant
ai-writing
creator-economy
voice-design
brand-archetypes
jungian-archetypes
tone-of-voice
npm
open-source
mit-license
```

---

## Preview — how the About sidebar will look

```
┌──────────────────────────────────────────────────┐
│  About                                           │
│                                                  │
│  An open-source Claude skill that builds a       │
│  unique, consistent LinkedIn voice.              │
│  Framework-driven persona interview (Jungian     │
│  archetypes + NN/g tone model + anti-voice)      │
│  → daily post generation on a 30/25/20/15/10     │
│  content mix. Works for one person or a whole    │
│  team. Install with one npx command.             │
│                                                  │
│  🔗 nirvanaguha.github.io/thoth                     │
│                                                  │
│  Topics                                          │
│  claude  claude-skill  claude-code  ai-skills    │
│  linkedin  linkedin-posts  personal-brand        │
│  thought-leadership  content-calendar            │
│  writing-assistant  ai-writing  creator-economy  │
│  voice-design  brand-archetypes                  │
│  jungian-archetypes  tone-of-voice  npm          │
│  open-source  mit-license                        │
│                                                  │
│  📄 Readme                                       │
│  ⚖  MIT License                                  │
│  ⭐ N stars                                      │
│  🍴 N forks                                      │
└──────────────────────────────────────────────────┘
```

---

## Social-card image (optional but high-leverage)

Drop a 1280×640 PNG into `docs/social-card.png` and set it in repo → Settings → Social preview. Good composition:

- Large "**Thoth**" wordmark left
- Tagline: "**A LinkedIn voice that's actually yours.**"
- Right side: a stylized ASCII box showing `archetype: sage / tone: 3-2-3-2 / mix: 30/25/20/15/10`
- Bottom-right: `github.com/NirvanaGuha/thoth`
- Background: calm gradient (avoid AI-generated purple/pink — that's the opposite of what you'd recommend)

---

## Release notes template (for v1.0.0)

```
## v1.0.0 — Thoth

The first open-source release of Thoth, a Claude skill for building
a unique, consistent LinkedIn voice.

### Frameworks
- 12 Jungian brand archetypes (Pearson / Mark)
- Nielsen Norman 4-D tone-of-voice model
- Contrarian-belief elicitation + anti-voice matchers

### Features
- 20-minute onboarding interview
- Multi-user personas (one install, one persona per person)
- 30/25/20/15/10 content mix with ratio-aware post selection
- /thoth daily, /thoth schedule, /thoth regenerate, /thoth calendar
- Git as optional POV source, with strict redaction rules

### Install
- `npx thoth-skill init` or `curl | bash`
- Also available via Claude plugin marketplace
```
