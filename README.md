# jameskunley.com

Personal website of James Kunley. Built with [Astro](https://astro.build), deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev     # http://localhost:4321
npm run check   # type-check
npm run build   # output in dist/
```

## Content

- **Profile, contacts, expertise, experience:** `src/site.config.ts`. Empty sections are hidden.
- **Photo:** `src/assets/profile.jpg`
- **Résumé:** add a PDF to `public/` and set `PROFILE.resume` (e.g. `'/resume.pdf'`).
- **Blog posts:** `src/content/blog/<slug>.md`
- **Projects:** `src/content/projects/<slug>.md`

Frontmatter is validated by `src/content.config.ts`.

```md
---
title: Post title
description: One-sentence summary.
pubDate: 2026-11-01
tags: [architecture]
draft: false
---
```

```md
---
title: Project title
summary: One-sentence summary.
role: Technical lead
period: 2024–2025
stack: [TypeScript, PostgreSQL]
repo: https://github.com/jtkunley/example
featured: true
order: 1
---
```

## Deploy

Pushing to `main` builds and deploys via `.github/workflows/deploy.yml`. The custom domain is set in `public/CNAME`; DNS points `jameskunley.com` at GitHub Pages (A records `185.199.108–111.153`, `www` CNAME `jtkunley.github.io`).
