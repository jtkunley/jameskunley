import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getDesigns } from '../lib/content';
import { PROFILE, SITE } from '../site.config';

export async function GET(context: APIContext) {
	const designs = await getDesigns();
	return rss({
		title: `${SITE.title} · Designs`,
		description: `Engineering design documents by ${PROFILE.name}.`,
		site: context.site ?? SITE.url,
		items: designs.map((design) => ({
			title: design.data.title,
			description: design.data.description,
			pubDate: design.data.pubDate,
			categories: design.data.tags,
			link: `/designs/${design.id}/`,
		})),
	});
}
