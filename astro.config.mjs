// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Custom domain served by GitHub Pages (see public/CNAME). No `base` is needed
	// because the site lives at the domain root.
	site: 'https://jameskunley.com',
	trailingSlash: 'ignore',
	integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
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
