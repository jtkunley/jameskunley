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
		'Over 20 years building and evolving production software, from browser clients to the backend services behind them.',
	specialties: ['Distributed Systems', 'Software Architecture', 'Real-Time Applications'],
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
		title: 'Provider Scheduling',
		summary:
			'Cut assignment-related provider idle time by about 90% through scheduling optimizations on a healthcare platform handling roughly 10,000 visits each business day.',
	},
	{
		title: 'Real-Time Provider Messaging',
		summary:
			'Owned the browser notification architecture carrying millions of messages a day to hundreds of provider interfaces, and introduced delta-based updates to cut redundant traffic.',
	},
	{
		title: 'Core Platform Modernization',
		summary:
			'Led architecture across teams to modernize a central platform service, separating transaction processing, lifecycle management, and downstream integrations behind clear boundaries.',
	},
];

export const PHILOSOPHY = {
	statement: 'Understand the system before changing it.',
	body: 'I start with how a system actually behaves in production, find the constraints that matter, and prefer small, deliberate changes to rewrites.',
};

export const BACKGROUND = {
	summary: 'Experience across financial technology, enterprise logistics, and healthcare platforms.',
	companies: ['TIBCO', 'HP', 'XPO Logistics', 'DexCare'],
};
