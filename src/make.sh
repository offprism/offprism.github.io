#!/bin/bash
# usage: make.sh  — builds every src/pages/<path>.html into the site root
cd "$(dirname "$0")"
for f in $(cd pages && find . -name '*.html'); do
  src="pages/$f"; out="../${f#./}"
  title=$(head -1 "$src" | sed 's/^<!-- title: \(.*\) -->$/\1/')
  nav=$(sed -n 2p "$src" | sed -n 's/^<!-- nav: \(.*\) -->$/\1/p')
  mkdir -p "$(dirname "$out")"
  { sed "s|{{TITLE}}|$title|g" head.html | sed "s|data-nav=\"$nav\"|data-nav=\"$nav\" class=\"active\"|"; tail -n +3 "$src"; cat foot.html; } > "$out"
done
echo built
