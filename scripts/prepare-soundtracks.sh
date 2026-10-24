#!/bin/sh
# Trims and compresses soundtrack files for LOCAL playback only.
# Output goes to public/soundtracks-local/, which is gitignored, so these
# files are never committed or deployed. The live site falls back to YouTube.
#
# Usage: scripts/prepare-soundtracks.sh <slug> <source-audio> [minutes]
#   slug: noir | frontier | night-city | yotei
# Needs macOS (avconvert + afconvert).
set -eu

slug="$1"
src="$2"
minutes="${3:-30}"
out_dir="$(dirname "$0")/../public/soundtracks-local"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

mkdir -p "$out_dir"
# 1. Cut the first N minutes into a high-quality intermediate.
avconvert --source "$src" --output "$tmp/cut.m4a" --preset PresetAppleM4A \
  --duration "$((minutes * 60))" --replace >/dev/null
# 2. Re-encode with Apple's AAC encoder at 128 kbps, best quality setting.
afconvert "$tmp/cut.m4a" "$out_dir/$slug.m4a" -f m4af -d aac -b 128000 -q 127
echo "$slug: $(du -h "$out_dir/$slug.m4a" | cut -f1)"
