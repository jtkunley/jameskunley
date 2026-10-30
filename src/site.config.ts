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
		'Over 20 years designing and evolving production software — from real-time applications to distributed backend systems.',
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
			'Designing service boundaries, transactional workflows, and event-driven systems — while evolving tightly coupled platforms through incremental change.',
	},
	{
		title: 'Performance Engineering',
		icon: 'performance',
		description:
			'Investigating production bottlenecks, eliminating unnecessary I/O, and improving critical data paths through profiling, optimization, and caching.',
	},
	{
		title: 'Real-Time Systems & Data Integrity',
		icon: 'realtime',
		description:
			'Keeping distributed services and browser applications synchronized while preserving consistency through concurrent state changes and asynchronous updates.',
	},
];

export const IMPACT: { title: string; summary: string }[] = [
	{
		title: 'Provider Assignment at Scale',
		summary:
			'Reduced assignment-related provider idle time by approximately 90% through targeted scheduling optimizations on a healthcare platform handling roughly 10,000 visits per business day.',
	},
	{
		title: 'Real-Time Messaging at Scale',
		summary:
			'Owned browser notification architecture supporting millions of messages daily across hundreds of provider interfaces, introducing delta-based updates to reduce unnecessary message traffic.',
	},
	{
		title: 'Core Platform Modernization',
		summary:
			'Led cross-team architectural work to modernize a central healthcare service, defining clearer boundaries for transaction processing, lifecycle management, and downstream integrations.',
	},
];

export const PHILOSOPHY = {
	statement: 'Understand the system before changing it.',
	body: 'I start with how systems actually behave in production, identify the constraints that matter, and favor focused, incremental improvements over unnecessary rewrites.',
};

export const BACKGROUND = {
	summary: 'Experience across financial technology, enterprise logistics, and healthcare platforms.',
	companies: ['TIBCO', 'HP', 'XPO Logistics', 'DexCare'],
};
