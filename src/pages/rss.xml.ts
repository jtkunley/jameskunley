import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/content';
import { PROFILE, SITE } from '../site.config';

export async function GET(context: APIContext) {
	const posts = await getPosts();
	return rss({
		title: `${SITE.title} · Writing`,
		description: `Technical writing by ${PROFILE.name}.`,
		site: context.site ?? SITE.url,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			categories: post.data.tags,
			link: `/blog/${post.id}/`,
		})),
	});
}
