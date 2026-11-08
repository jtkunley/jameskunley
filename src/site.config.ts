// Personal details and site-wide settings. Long-form content lives in src/content/.
// Homepage sections with no content (empty lists or strings) are hidden.

export const SITE = {
	url: 'https://jameskunley.com',
	title: 'James Kunley',
	description:
		'James Kunley is a software engineer with over 20 years of experience in distributed systems, performance engineering, software architecture, and real-time applications.',
	locale: 'en-US',
};

export const PROFILE = {
	name: 'James Kunley',
	role: 'Software Engineer',
	location: 'Vancouver, WA',
	statement: 'Making complex software systems simpler, faster, and more reliable.',
	intro:
		'Over 20 years building and modernizing production software across financial technology, enterprise logistics, and healthcare. I work across the stack, from real-time browser applications to distributed backend services, with a focus on architectural simplicity, data integrity, and solving difficult performance problems.',
	specialties: ['Distributed Systems', 'Architecture & Performance', 'Real-Time Applications'],
	photoAlt: 'Portrait of James Kunley',
	// Path to a PDF in public/, e.g. '/resume.pdf'.
	resume: '',
};

export const LINKS = {
	github: 'https://github.com/jtkunley',
	linkedin: 'https://www.linkedin.com/in/jameskunley',
	email: 'jameskunley@gmail.com',
};

export const CONTACT = [
	{ label: 'Email', value: LINKS.email, href: `mailto:${LINKS.email}` },
	{ label: 'LinkedIn', value: 'linkedin.com/in/jameskunley', href: LINKS.linkedin },
	{ label: 'GitHub', value: 'github.com/jtkunley', href: LINKS.github },
	...(PROFILE.resume ? [{ label: 'Résumé', value: 'Download (PDF)', href: PROFILE.resume }] : []),
];

export type Icon = 'architecture' | 'performance' | 'realtime';

export const EXPERTISE: { title: string; icon: Icon; description: string }[] = [
	{
		title: 'Architecture & Modernization',
		icon: 'architecture',
		description:
			'Drawing service boundaries, designing transactional and event-driven workflows, and untangling tightly coupled platforms while they stay in service.',
	},
	{
		title: 'Performance Engineering',
		icon: 'performance',
		description:
			'Profiling slow systems under real load, removing wasted I/O, and caching where it pays off on the paths that matter most.',
	},
	{
		title: 'Real-Time Systems & Data Integrity',
		icon: 'realtime',
		description:
			'Keeping services and browser clients in sync, and keeping data correct when updates arrive concurrently or out of order.',
	},
];

export const IMPACT: { title: string; summary: string }[] = [
	{
		title: 'Provider Scheduling & Operational Efficiency',
		summary:
			'Improved time-sensitive scheduling workflows by identifying and resolving assignment bottlenecks, reducing provider idle time and improving operational throughput on a large-scale healthcare platform.',
	},
	{
		title: 'Core Platform Modernization',
		summary:
			'Led cross-team architecture initiatives to modernize tightly coupled backend systems, establishing clearer service boundaries and separating transactional responsibilities from workflow coordination and integrations.',
	},
	{
		title: 'Real-Time Messaging & Data Synchronization',
		summary:
			'Owned real-time notification architecture connecting distributed services with browser applications. Introduced incremental update strategies to reduce redundant traffic, improve responsiveness, and keep client state synchronized with backend changes.',
	},
	{
		title: 'Transactional Integrity & Concurrency',
		summary:
			'Designed transactional workflows and concurrency-control mechanisms to preserve data consistency under heavy load, addressing conflicting updates and race conditions across asynchronous processes.',
	},
	{
		title: 'Performance Engineering & Scalability',
		summary:
			'Improved backend performance through targeted database optimizations, smarter caching strategies, and more efficient data-access patterns, reducing unnecessary processing and improving system responsiveness.',
	},
	{
		title: 'Cross-Team Architecture & Engineering Standards',
		summary:
			'Drove architectural alignment across engineering teams, establishing shared service patterns and data models that reduced fragmentation, improved maintainability, and made complex platforms easier to evolve.',
	},
];

export const PHILOSOPHY = {
	statement: 'Understand the system before changing it.',
	body: 'I start with how a system actually behaves in production, find the constraints that matter, and prefer small, deliberate changes to rewrites.',
};

export const BACKGROUND = {
	summary:
		'Over two decades of engineering experience across financial technology, enterprise logistics, healthcare platforms, and enterprise software — from real-time user interfaces to distributed backend architecture.',
	companies: ['TIBCO', 'HP', 'XPO Logistics', 'J2 Interactive', 'DexCare'],
	personal: {
		title: 'Beyond Engineering',
		body: 'Outside of engineering, I’m usually spending time with my two kids, catching waves, or exploring backroads on my motorcycle.',
	},
};
