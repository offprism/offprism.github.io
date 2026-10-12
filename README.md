# offprism.github.io

Website of [OffPrism](https://github.com/offprism/launcher) — https://offprism.github.io (English) and https://offprism.github.io/ru/ (Russian).

- Pages live in `src/pages/en/` and `src/pages/ru/`. `bash src/make.sh` wraps them with `src/head.<lang>.html` / `src/foot.<lang>.html` and writes English pages to the site root and Russian pages to `/ru/`.
- The first two lines of every page are `<!-- title: ... -->` and `<!-- nav: ... -->`.
- `feed/feed.xml` is the Atom feed shown in the launcher's news bar — add an `<entry>` for every news post.
- Download links, file sizes and the version label are filled from the latest GitHub release by `assets/site.js`.
