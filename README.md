# jameskunley.com

Personal website and technical blog, built with [Astro](https://astro.build) and deployed to GitHub Pages at [jameskunley.com](https://jameskunley.com).

Fully static, no client-side JavaScript, no backend.

## Commands

| Command           | Action                                          |
| :---------------- | :---------------------------------------------- |
| `npm install`     | Install dependencies                            |
| `npm run dev`     | Start the dev server at `http://localhost:4321` |
| `npm run check`   | Type-check Astro and TypeScript files           |
| `npm run build`   | Build the production site to `./dist/`          |
| `npm run preview` | Serve the production build locally              |

## Editing content

| What                                | Where                                            |
| :---------------------------------- | :----------------------------------------------- |
| Profile, expertise, experience, contact links, nav | `src/site.config.ts` |
| Profile photo                       | `src/assets/profile.jpg` (portrait, ~4:5 ratio)  |
| Social share image                  | `src/assets/og-default.png` (1200×630)           |
| Résumé                              | `public/resume.pdf`                              |
| Blog posts                          | `src/content/blog/*.md` or `*.mdx`               |
| Projects                            | `src/content/projects/*.md`                      |

Search for `PLACEHOLDER` to find content that still needs real information.

### Add a blog post

Create `src/content/blog/my-post.md`; the filename becomes the URL (`/blog/my-post/`).

```md
---
title: My post
description: One-sentence summary used in listings and search results.
pubDate: 2026-11-01
tags: [go, databases]
draft: true # optional: shown in dev, excluded from production
---

Post content in Markdown.
```

Optional fields: `updatedDate`, `heroImage` (relative path to an image), `heroImageAlt`.

### Add a project

Create `src/content/projects/my-project.md`. It's listed on `/work/`, and the body becomes the detail page at `/work/my-project/`.

```md
---
title: My Project
summary: One-sentence description of the system and the problem it solved.
role: Technical lead # optional
period: 2024–2025 # optional
stack: [TypeScript, PostgreSQL, AWS]
repo: https://github.com/jtkunley/my-project # optional
link: https://example.com # optional
featured: true # show under "Selected work" on the homepage (first three)
order: 1 # lower numbers appear first
---

## Context
## Architecture
## Challenges
## Outcome
```

Frontmatter for both collections is validated in `src/content.config.ts`, so mistakes fail the build.

## Project structure

```text
public/                 Static files copied as-is (CNAME, robots.txt, resume.pdf, favicon)
src/
  assets/               Images processed by Astro
  components/           Reusable UI components
  content/              Markdown content (blog, projects)
  layouts/              Page shells (BaseLayout, BlogPost)
  lib/content.ts        Collection queries (sorting, draft filtering)
  pages/                Routes
  styles/global.css     Design tokens and base styles
  site.config.ts        Personal details and site settings
.github/workflows/      GitHub Pages deployment
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site with the official [Astro GitHub Action](https://github.com/withastro/action) and deploys it to GitHub Pages. `public/CNAME` sets the custom domain.

### One-time setup

1. Create the GitHub repository `jtkunley/jtkunley.github.io` and push `main`.
2. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. In **Settings → Pages → Custom domain**, enter `jameskunley.com` and save.
4. In Namecheap, under **Domain List → jameskunley.com → Advanced DNS**, remove any parking or URL redirect records and add:

   | Type  | Host | Value                |
   | :---- | :--- | :------------------- |
   | A     | @    | 185.199.108.153      |
   | A     | @    | 185.199.109.153      |
   | A     | @    | 185.199.110.153      |
   | A     | @    | 185.199.111.153      |
   | CNAME | www  | jtkunley.github.io.  |

   Optional IPv6 `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

5. Once DNS resolves and GitHub issues the certificate, check **Enforce HTTPS** in **Settings → Pages**.
6. Recommended: verify the domain under your GitHub account's **Settings → Pages** to prevent domain takeover.
