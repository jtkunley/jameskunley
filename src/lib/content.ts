import { getCollection } from 'astro:content';

export async function getDesigns() {
	const designs = await getCollection('designs', ({ data }) => import.meta.env.DEV || !data.draft);
	return designs.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getDesignTags() {
	const counts = new Map<string, number>();
	for (const design of await getDesigns()) {
		for (const tag of design.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function getProjects() {
	const projects = await getCollection('projects');
	return projects.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}
