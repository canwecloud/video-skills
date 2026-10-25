#!/usr/bin/env bash
# One-time setup: fonts, animation libs, background-removal model, Python deps.
# Everything lands in <skill>/vendor (git-ignored). Safe to re-run.
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
V="$SKILL/vendor"; mkdir -p "$V/fonts" "$HOME/.u2net"
GF=https://raw.githubusercontent.com/google/fonts/main/ofl
get(){ [ -s "$2" ] || curl -sSfL --retry 3 -o "$2" "$1" || echo "WARN: failed $1"; }

# Devanagari + Latin display font library (all SIL OFL — free for commercial video)
for f in \
  "mukta/Mukta-ExtraBold.ttf" "mukta/Mukta-Bold.ttf" "mukta/Mukta-SemiBold.ttf" \
  "baloo2/Baloo2%5Bwght%5D.ttf" \
  "hind/Hind-Bold.ttf" "hind/Hind-SemiBold.ttf" \
  "anekdevanagari/AnekDevanagari%5Bwdth,wght%5D.ttf" \
  "notosansdevanagari/NotoSansDevanagari%5Bwdth,wght%5D.ttf" \
  "tirodevanagarimarathi/TiroDevanagariMarathi-Regular.ttf" \
  "tirodevanagarihindi/TiroDevanagariHindi-Regular.ttf" \
  "yatraone/YatraOne-Regular.ttf" "rozhaone/RozhaOne-Regular.ttf" \
  "khand/Khand-Bold.ttf" "teko/Teko%5Bwght%5D.ttf" "kalam/Kalam-Bold.ttf" \
  "poppins/Poppins-ExtraBold.ttf" "poppins/Poppins-Bold.ttf" "poppins/Poppins-SemiBold.ttf" ; do
  name=$(basename "$f" | sed 's/%5B.*%5D//; s/\.ttf$//'); get "$GF/$f" "$V/fonts/$name.ttf"
done

# Remotion (React video) + React Three Fiber (3D)
(cd "$SKILL/remotion" && [ -d node_modules/remotion ] || npm install --no-audit --no-fund)

# Background removal (rembg + U2-Net, Apache-2.0) — runs locally, no API key
python3 -c "import rembg" 2>/dev/null || pip install -q --break-system-packages "rembg[cpu]"
get https://huggingface.co/tomjackson2023/rembg/resolve/main/u2net.onnx "$HOME/.u2net/u2net.onnx"

command -v ffmpeg >/dev/null || echo "WARN: ffmpeg missing"
echo "setup done → $V"; ls "$V/fonts" | sed 's/^/  font: /'
