# Brand Template

Each persona has a `brand.yaml` file at `<data-root>/personas/<name>/brand.yaml`. This defines the persona's visual identity — colors, typography, handle — for any image/PDF/carousel Thoth renders for that persona.

If the file is missing, the renderer uses defaults from `skill/templates/single-image/_shared/tokens.css`. The first `/thoth image` invocation should offer to run `/thoth brand` to set up real values.

## Schema

```yaml
# ~/.thoth/personas/<name>/brand.yaml

# 1. Colors — used as CSS variable overrides for the templates.
#    Hex values only. Templates use these names:
#      primary    headline + body text on light backgrounds
#      accent     numbers, accent bars, dots, highlights
#      ink        same as primary in most cases; use to differ if needed
#      background card background
colors:
  primary: "#191A35"
  accent: "#3B43FF"
  ink: "#191A35"
  background: "#FFFFFF"

# 2. Typography — display font is for headlines/numbers, body for everything else.
#    Use names that are likely installed on the OS (system stack falls back).
#    Common choices:
#      "Inter"            — modern, clean, very web-readable
#      "IBM Plex Sans"    — strong, distinct
#      "Helvetica Neue"   — neutral classic (default macOS)
#      "Arial"            — universal fallback
typography:
  display_font: "Inter"
  body_font: "Inter"

# 3. Handle — appears in the canvas-footer of every rendered image.
#    Use the LinkedIn handle exactly as it appears in your profile URL,
#    prefixed with @ for readability.
handle: "@NirvanaGuha"

# 4. Aspect ratio — square (1:1) is the LinkedIn default and most
#    forgiving. Portrait (4:5) gets more vertical real estate in feed.
#    Landscape (1.91:1) is used for link-preview-style cards.
#    Single-image renderer in v1.4.0 supports 1:1 only.
aspect_ratio: "1:1"
```

## Interview defaults

When `/thoth brand` runs for a persona without an existing `brand.yaml`, walk through 5 questions. Each has a sensible default the user can skip with empty input.

| Q | Prompt | Default |
|---|---|---|
| 1 | "Primary color (headline + body text)? Hex like `#191A35`, or 'default' for neutral navy." | `#191A35` |
| 2 | "Accent color (numbers, bars, highlights)? Hex, or 'default' for indigo blue." | `#3B43FF` |
| 3 | "Background color (card background)? Hex, or 'default' for white." | `#FFFFFF` |
| 4 | "Display font name? (Inter / IBM Plex Sans / Helvetica Neue / Arial / system) 'default' for Inter." | `Inter` |
| 5 | "LinkedIn handle, with @? Used in image footers." | `(none — leave footer blank)` |

After the answers, write the file and confirm. Show the user a one-line preview describing what each image will look like:

> *"Saved. Your single-image cards will render navy text (`#191A35`) on white, with an indigo blue (`#3B43FF`) accent. Inter typeface. Footer attribution: `@NirvanaGuha`."*

Offer to run a test render: *"Want me to render a sample card now so you can see what it looks like?"* — on yes, generate a headline-card from a recent post.

## Brand variants (future)

Reserved for later releases:

```yaml
# v1.6.0+ — multiple variants the renderer can choose between
variants:
  - name: light
    colors: { primary: "#191A35", background: "#FFFFFF" }
  - name: dark
    colors: { primary: "#FFFFFF", background: "#0B0C1F" }
  - name: brand
    colors: { primary: "#FFFFFF", background: "#3B43FF" }
```

For v1.4.0, only the flat schema above is supported.

## Validation rules

The renderer (`skill/scripts/render.js`) accepts a `brand.yaml` with any subset of these fields. Missing fields fall back to `tokens.css` defaults.

Hex colors must be 6-digit (`#RRGGBB`). The renderer doesn't validate — it just substitutes into CSS variables, so an invalid value will render as the CSS default (usually unstyled).
