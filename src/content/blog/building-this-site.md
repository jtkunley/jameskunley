---
title: How this site is built
description: A static Astro site with typed Markdown content, zero client-side JavaScript, and automatic deploys to GitHub Pages.
pubDate: 2026-10-29
tags: [astro, web, devops]
---

This site is deliberately simple: no database, no backend, and no client-side framework. Here’s how it fits together.

## Content as data

Blog posts and projects are Markdown files under `src/content/`. Each collection has a schema, so a typo in frontmatter fails the build instead of shipping a broken page:

```ts
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tech: z.array(z.string()),
    repo: z.url().optional(),
  }),
});
```

Adding a post is just adding a file.

## Static by default

Astro renders every page to HTML at build time. Fonts are self-hosted, images are optimized during the build, and no JavaScript is sent to the browser.

## Deployment

A GitHub Actions workflow builds the site on every push to `main` and publishes it to GitHub Pages, which serves it on a custom domain with HTTPS.

> The best infrastructure is the infrastructure you don’t have to think about.
