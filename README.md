# Orbe Studio — creative-tech agency homepage

A dark, editorial homepage for **Orbe Studio**, a fictional creative-tech agency, in the style of modern agency sites. Built with **Astro**, plain CSS and a little vanilla JavaScript.

> Orbe Studio, its clients, people and copy are invented placeholders. Imagery is free stock photography (see `public/CREDITS.txt`).

## Features

- **Hero**: big headline with a looping, muted showreel set inside the text, plus a pause/play control
- **Live office clocks**: Paris, Montréal, Tunis and Tokyo, via `Intl.DateTimeFormat` and IANA time zones
- **Pinned showreel**: the video starts as a small window between two words and zooms to full screen as you scroll
- **About**: stats that count up on scroll, and a captioned photo gallery
- **Scroll rows**: bands of large type and photos that slide sideways in opposite directions as you scroll
- **Services**: four disciplines with bullet lists
- **Work**: case-study cards with industry filters stored in the URL (`/en/?industry=fintech`)
- **Testimonials**: an accessible "01 / 05" carousel and a scrolling client logo ticker
- **News**: Markdown articles with their own localised pages
- **FAQ**: an accordion built on native `<details>`
- **English and French** at `/en/` and `/fr/` (the root redirects by browser language)
- **Dark and light themes**, remembered across visits
- **Scroll-linked motion**: images zoom out and drift as they pass, and the hero zooms out as you leave it. A small engine (`src/scripts/scroll.ts`) gives every `data-scroll` element a `--progress` value from 0 to 1, and CSS does the rest
- **SEO**: canonical URLs, hreflang, Open Graph and Twitter cards, JSON-LD, `sitemap.xml` and `robots.txt`
- **Accessibility**: skip link, keyboard support, `prefers-reduced-motion` support, no axe violations

## Getting started

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve the build
npm run check    # type-check .astro and .ts files
```

Before deploying, set `site` in `astro.config.mjs` and the sitemap URL in `public/robots.txt` to your domain.

## Editing content

All copy lives in plain files. Each language has its own copy, and the two must keep the same keys.

| What | Where |
| --- | --- |
| Meta tags, menu, hero, footer | `src/data/{en,fr}/site.json` |
| About text, stats, gallery | `src/data/{en,fr}/about.json` |
| Services | `src/data/{en,fr}/services.json` |
| Case studies and industries | `src/data/{en,fr}/work.json` |
| Testimonials | `src/data/{en,fr}/testimonials.json` |
| FAQ | `src/data/{en,fr}/faq.json` |
| Office cities and time zones | `src/data/shared/offices.json` |
| Logo ticker clients | `src/data/shared/clients.json` |
| News articles | `src/content/news/{en,fr}/*.md` |

**Adding a news article:** create one Markdown file per language. Give both files the same `key` in their frontmatter so they link to each other in the language switcher and hreflang tags. The frontmatter is validated by `src/content.config.ts`.

**Adding an industry filter:** add the label under `industries` in both `work.json` files, then use that key as the `industry` of a project.

## Project structure

```
src/
├── components/   One .astro file per section, each with scoped CSS and its script
├── content/      Markdown news articles (content collection)
├── data/         JSON content (en, fr, shared)
├── layouts/      BaseLayout: <head>, SEO tags, theme script, skip link
├── lib/i18n.ts   Locales, content loaders, formatting helpers
├── pages/        /, /[lang]/, /[lang]/news/[slug]/, 404, sitemap.xml
├── scripts/      Shared client scripts (scroll reveal, scroll progress)
└── styles/       Global tokens, reset and utilities
```

## Credits

Designed and built by **Akrem Medimagh**.
