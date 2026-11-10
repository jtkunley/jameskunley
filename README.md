# jameskunley.com

[![jameskunley.com](src/assets/og-default.jpg)](https://jameskunley.com)

Source for [jameskunley.com](https://jameskunley.com), the personal website of James Kunley, a software engineer focused on distributed systems, software architecture, and real-time applications.

## Stack

- [Astro](https://astro.build) with TypeScript, statically generated
- Hand-written CSS with no framework, and no client-side JavaScript
- Self-hosted fonts via the Astro Fonts API (Newsreader and Inter)
- Markdown content collections with typed frontmatter
- GitHub Actions deploying to GitHub Pages on a custom domain

## Project structure

```text
src/
├── site.config.ts      Profile, expertise, impact, philosophy, background, contacts
├── pages/              Routes (homepage, 404, RSS, optional designs and work pages)
├── components/         Header, footer, section layout, lists
├── layouts/            Base page shell and design document layout
├── lib/                Content queries and build-time design PDF generation
├── content/            Markdown for design documents and projects
├── styles/global.css   Design tokens and base styles
└── assets/             Profile photo and social preview image
public/                 CNAME, robots.txt, favicon
```

## Development

Requires Node.js 22.23 or later.

```sh
npm install
npm run dev     # http://localhost:4321
npm run check   # type-check
npm run build   # production build in dist/
```

## Editing content

Most content lives in [`src/site.config.ts`](src/site.config.ts). Homepage sections with no content are hidden automatically.

Engineering design documents (`src/content/designs/*.md`) and projects (`src/content/projects/*.md`) are optional. Their pages and navigation links appear once the first file is added, and frontmatter is validated by [`src/content.config.ts`](src/content.config.ts).

`npm run build` also renders each design to `/designs/<slug>.pdf` with headless Chrome (Puppeteer) using the site's print styles. PDFs exist only in build output, so use `npm run preview` to try the Export to PDF link locally.

## Deployment

Every push to `main` builds and deploys the site via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The custom domain is configured in `public/CNAME`.

## Usage

The code is shared for reference. The written content and photographs are © James Kunley and may not be reused without permission.
