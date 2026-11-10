// @ts-check

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// Drafts are excluded from production builds, so they don't count as content.
/** @param {string} dir */
const hasContent = (dir) => {
	const base = new URL(`./src/content/${dir}/`, import.meta.url);
	return readdirSync(base, { recursive: true }).some(
		(f) =>
			String(f).endsWith('.md') && !/^draft:\s*true\s*$/m.test(readFileSync(new URL(String(f), base), 'utf8')),
	);
};

// Empty sections render as noindexed placeholders, so keep them out of the sitemap.
const excluded = [
	'/404/',
	...(hasContent('designs') ? [] : ['/designs/']),
	...(hasContent('projects') ? [] : ['/work/']),
];

const lastCommit = (() => {
	try {
		return new Date(execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim());
	} catch {
		return new Date();
	}
})();

// https://astro.build/config
export default defineConfig({
	// Custom domain served by GitHub Pages (see public/CNAME). No `base` is needed
	// because the site lives at the domain root.
	site: 'https://jameskunley.com',
	trailingSlash: 'ignore',
	// Designs were briefly published under /blog/.
	redirects: {
		'/blog': '/designs/',
		'/blog/reference-data-cache': '/designs/reference-data-cache/',
	},
	integrations: [
		sitemap({
			filter: (page) => !excluded.some((path) => new URL(page).pathname === path),
			lastmod: lastCommit,
		}),
	],
	markdown: {
		shikiConfig: { theme: 'vitesse-dark' },
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Newsreader',
			cssVariable: '--font-serif',
			weights: ['200 800'],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['Georgia', 'serif'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Inter',
			cssVariable: '--font-sans',
			weights: ['100 900'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
	],
});
