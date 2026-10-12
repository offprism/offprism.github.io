#!/bin/bash
# Builds src/pages/<lang>/<path>.html into the site root (en) or /ru/ (ru),
# wrapping every page with head.<lang>.html and foot.<lang>.html.
cd "$(dirname "$0")"
for lang in en ru; do
  for f in $(cd pages/$lang && find . -name '*.html'); do
    rel=${f#./}
    src="pages/$lang/$rel"
    if [ "$lang" = en ]; then out="../$rel"; else out="../ru/$rel"; fi
    # public URL of the page (without the language prefix)
    case "$rel" in
      index.html) path="/";;
      */index.html) path="/${rel%index.html}";;
      *) path="/$rel";;
    esac
    en_url="$path"; ru_url="/ru$path"
    title=$(head -1 "$src" | sed 's/^<!-- title: \(.*\) -->$/\1/')
    nav=$(sed -n 2p "$src" | sed -n 's/^<!-- nav: \(.*\) -->$/\1/p')
    mkdir -p "$(dirname "$out")"
    {
      sed -e "s|{{TITLE}}|$title|g" -e "s|{{EN_URL}}|$en_url|g" -e "s|{{RU_URL}}|$ru_url|g" \
          -e "s|data-nav=\"$nav\"|data-nav=\"$nav\" class=\"active\"|" head.$lang.html
      tail -n +3 "$src"
      cat foot.$lang.html
    } > "$out"
  done
done
echo built
