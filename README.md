# offprism.github.io

Website of [OffPrism](https://github.com/offprism/launcher) — https://offprism.github.io

- Pages are written in `src/pages/` and wrapped with `src/head.html` / `src/foot.html` by `src/make.sh` (run `bash src/make.sh`, the result is written to the site root).
- `feed/feed.xml` is the Atom feed shown in the launcher's news bar — add an `<entry>` for every news post.
- Download links are filled from the latest GitHub release by `assets/site.js`.
