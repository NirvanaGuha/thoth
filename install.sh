#!/usr/bin/env bash
# Thoth one-line installer.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/NirvanaGuha/thoth/main/install.sh | bash
#
# Env vars:
#   THOTH_REPO   override the GitHub repo (default: NirvanaGuha/thoth)
#   THOTH_AI     claude | cursor | windsurf | codex (default: claude)
#   THOTH_SCOPE  home | local (default: home; local installs to ./<ai>/skills/thoth)
#   THOTH_REF    git ref to install (default: latest release, falls back to main)
#
# No Node required. Uses curl + tar only.

set -euo pipefail

REPO="${THOTH_REPO:-NirvanaGuha/thoth}"
AI="${THOTH_AI:-claude}"
SCOPE="${THOTH_SCOPE:-home}"
REF="${THOTH_REF:-}"

case "$AI" in
  claude)   AI_DIR=".claude/skills" ;;
  cursor)   AI_DIR=".cursor/skills" ;;
  windsurf) AI_DIR=".windsurf/skills" ;;
  codex)    AI_DIR=".codex/skills" ;;
  *) echo "Unknown THOTH_AI=$AI — supported: claude, cursor, windsurf, codex" >&2; exit 1 ;;
esac

if [ "$SCOPE" = "local" ]; then
  ROOT="$PWD"
else
  ROOT="$HOME"
fi

TARGET="$ROOT/$AI_DIR/thoth"

# Pick the ref.
if [ -z "$REF" ]; then
  LATEST=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
    | sed -n 's/.*"tag_name":[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1 || true)
  REF="${LATEST:-main}"
fi

echo "Thoth installer"
echo "  repo:   $REPO"
echo "  ref:    $REF"
echo "  target: $TARGET"
echo

# Pre-install: rescue legacy persona data if the user had v1.0.x installed.
# v1.1+ stores persona data at ~/.thoth/ (outside the skill folder), but earlier
# versions kept it inside the skill at $TARGET/personas/. A reinstall would
# destroy it — so move it out of harm's way before we touch $TARGET.
LEGACY_PERSONAS="$TARGET/personas"
NEW_DATA_ROOT="$HOME/.thoth"
if [ -d "$LEGACY_PERSONAS" ]; then
  # Heuristic: legacy data is present if there's a persona subfolder beyond just
  # README.md / .active / the v1.1 placeholder structure.
  HAS_USER_DATA=0
  for entry in "$LEGACY_PERSONAS"/*/; do
    [ -d "$entry" ] && HAS_USER_DATA=1 && break
  done
  if [ "$HAS_USER_DATA" = "1" ] && [ ! -d "$NEW_DATA_ROOT/personas" ]; then
    echo "  found legacy persona data at $LEGACY_PERSONAS"
    echo "  migrating to $NEW_DATA_ROOT/personas/ before reinstall…"
    mkdir -p "$NEW_DATA_ROOT"
    mv "$LEGACY_PERSONAS" "$NEW_DATA_ROOT/personas"
    echo "  ✓ migrated."
    echo
  fi
fi

if [ -d "$TARGET" ]; then
  echo "  $TARGET already exists."
  echo "  Remove it first, or set THOTH_SCOPE=local for a project-local install."
  exit 1
fi

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# Fetch + extract only the skill/ subfolder.
if [[ "$REF" =~ ^v ]] || [ "$REF" != "main" ]; then
  URL="https://codeload.github.com/$REPO/tar.gz/refs/tags/$REF"
else
  URL="https://codeload.github.com/$REPO/tar.gz/refs/heads/$REF"
fi

echo "  fetching $URL"
curl -fsSL "$URL" | tar -xz -C "$TMP"

# The tarball top-level dir is "<user>-<repo>-<sha>". Find it.
TOP=$(ls "$TMP" | head -n1)
if [ ! -d "$TMP/$TOP/skill" ]; then
  echo "  expected skill/ folder inside tarball — aborting."
  exit 1
fi

mkdir -p "$(dirname "$TARGET")"
cp -R "$TMP/$TOP/skill" "$TARGET"

cat <<EOF

  ✓ Installed Thoth to $TARGET

Quick start — in Claude, type:
  /thoth <your-name>      activate / create your persona
  /thoth onboard          run the 20-min interview
  /thoth                  generate your first post
  /thoth help             full command list

Docs: https://github.com/$REPO
EOF
