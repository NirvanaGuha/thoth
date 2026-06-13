# Brand Template

Each persona has a `brand.yaml` file at `<data-root>/personas/<name>/brand.yaml`. This defines the persona's visual identity — colors, palette, typography, card style, handle — for any image/GIF/PDF/carousel Thoth renders for that persona.

**`brand.yaml` is auto-derived from the persona's personality.** When a persona has no `brand.yaml`, the default is to derive one automatically — no interview — by running `scripts/derive-brand.js` against the persona's `persona.md`. It reads the dominant/secondary archetype + tone sliders and computes accent/ink/background + 5 palette swatches + card style + gradient. **Explicit branding always wins:** if the user supplies colours (or branding instructions), pass them as `--accent` / `--bg` / `--ink` / `--primary` flags and those override the derived values; with none, the palette is pure-derived. The 5-question interview (below) is the explicit-override path, not the default — run it via `/thoth brand setup` when a user wants to set colours by hand.

If `brand.yaml` is still missing at render time, the renderer falls back to defaults from `skill/templates/single-image/_shared/tokens.css`.

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
#    AUTO-DERIVED from the persona's dominant archetype by derive-brand.js, so the
#    typeface matches personality (Magician/Hero → Futura, Sage → Georgia, Ruler →
#    Baskerville, Jester → Chalkboard SE, Caregiver/Innocent → Avenir Next, …).
#    All are macOS system faces; the CSS stack falls back to Inter/-apple-system
#    if one is absent. Override with derive-brand's --display-font / --body-font,
#    or by editing the values here.
typography:
  display_font: "Futura"
  body_font: "Avenir Next"

# 3. Handle — appears in the canvas-footer of every rendered image.
#    Use the LinkedIn handle exactly as it appears in your profile URL,
#    prefixed with @ for readability.
handle: "@NirvanaGuha"

# 4. Aspect ratio — portrait (4:5) is now the default: it claims the most
#    vertical real estate in the LinkedIn feed. The renderer canvas is
#    1080×1350, and the default output is an ANIMATED GIF held inside
#    LinkedIn's envelope (<5 MB, <400 frames). A static PNG is still
#    available by passing a `.png` output to render.js.
aspect_ratio: "4:5"

# 5. Palette — 5 sticker-fill swatches used by the animated templates
#    (steps-card stickers, bar-chart bars, layers-card rings). Auto-derived
#    as an analogous spread off the accent hue plus a pop from the secondary
#    archetype. Override individual swatches by editing them here.
palette:
  swatch1: "#E7E4FF"
  swatch2: "#E4ECFF"
  swatch3: "#F1E4FF"
  swatch4: "#E4FFF6"
  swatch5: "#FFE9E4"

# 6. Style — card chrome the templates read as CSS variables.
#      header     header lockup style (e.g. "pill")
#      card_radius   corner radius (derived rounder for more casual tones)
#      card_stroke   sticker/card outline colour (usually the ink colour)
#      background_gradient   the canvas background gradient
style:
  header: "pill"
  card_radius: "20px"
  card_stroke: "#16161F"
  background_gradient: "linear-gradient(150deg, #FBFBFF 0%, #EEF0FF 52%, #F4ECFF 100%)"
```

## Interview defaults (`/thoth brand setup` — explicit override)

The 5-question interview is the **explicit-override path**, not the no-brand default — by default a missing `brand.yaml` is auto-derived (see the top of this file). Run the interview via `/thoth brand setup` when a user wants to set colours by hand. Each question has a sensible default the user can skip with empty input.

| Q | Prompt | Default |
|---|---|---|
| 1 | "Primary color (headline + body text)? Hex like `#191A35`, or 'default' for neutral navy." | `#191A35` |
| 2 | "Accent color (numbers, bars, highlights)? Hex, or 'default' for indigo blue." | `#3B43FF` |
| 3 | "Background color (card background)? Hex, or 'default' for white." | `#FFFFFF` |
| 4 | "Display font name? (Inter / IBM Plex Sans / Helvetica Neue / Arial / system) 'default' for Inter." | `Inter` |
| 5 | "LinkedIn handle, with @? Used in image footers." | `(none — leave footer blank)` |

After the answers, write the file and confirm. Show the user a one-line preview describing what each image will look like:

> *"Saved. Your single-image cards will render navy text (`#191A35`) on white, with an indigo blue (`#3B43FF`) accent. Inter typeface. Footer attribution: `@NirvanaGuha`."*

Offer to run a test render: *"Want me to render a sample card now so you can see what it looks like?"* — on yes, generate a stat-card GIF from a recent post.

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
