import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			heroImage: image().optional(),
			heroImageAlt: z.string().default(''),
			// Drafts are visible in `npm run dev` but excluded from production builds.
			draft: z.boolean().default(false),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		tech: z.array(z.string()),
		repo: z.url().optional(),
		demo: z.url().optional(),
		// Featured projects also appear on the homepage.
		featured: z.boolean().default(false),
		// Lower numbers are listed first.
		order: z.number().default(100),
	}),
});

export const collections = { blog, projects };
