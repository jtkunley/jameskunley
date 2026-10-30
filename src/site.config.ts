// Personal details and site-wide settings. Long-form content lives in src/content/.
// Homepage sections with no content (empty lists or strings) are hidden.

export const SITE = {
	url: 'https://jameskunley.com',
	title: 'James Kunley',
	description:
		'James Kunley is a software engineer with over 20 years of experience in distributed systems, software architecture, and real-time applications.',
	locale: 'en-US',
};

export const PROFILE = {
	name: 'James Kunley',
	role: 'Software Engineer',
	location: 'Vancouver, WA',
	statement: 'Making complex software systems simpler, faster, and more reliable.',
	intro: 'Software engineer with over 20 years of experience designing, building, and evolving production systems.',
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

export const EXPERTISE: { title: string; icon: Icon; points: string[] }[] = [
	{
		title: 'System Architecture & Evolution',
		icon: 'architecture',
		points: [
			'Distributed systems and service architecture',
			'System decomposition and modernization',
			'Event-driven workflows and state machines',
			'Incremental migration and maintainability',
		],
	},
	{
		title: 'Performance & Reliability',
		icon: 'performance',
		points: [
			'High-throughput systems and concurrency',
			'Database optimization and caching',
			'Bottleneck identification and profiling',
			'Observability and production reliability',
		],
	},
	{
		title: 'Real-Time Systems & Data Integrity',
		icon: 'realtime',
		points: [
			'Event-driven messaging and asynchronous processing',
			'Transactional consistency',
			'Client/server state synchronization',
			'End-to-end design across frontend and backend',
		],
	},
];

export const IMPACT: { title: string; summary: string }[] = [
	{
		title: 'High-Throughput Scheduling',
		summary:
			'Improved provider assignment efficiency, reducing assignment-related idle time by approximately 90% while supporting growing production traffic.',
	},
	{
		title: 'Distributed Platform Modernization',
		summary:
			'Led architectural direction for decomposing complex services into clearer responsibilities, transactional workflows, and modular integrations.',
	},
	{
		title: 'Real-Time Data Synchronization',
		summary:
			'Architected messaging infrastructure supporting millions of daily updates across hundreds of user interfaces, with an emphasis on reliability, efficiency, and data consistency.',
	},
];

export const PHILOSOPHY = {
	statement: 'Good engineering starts with understanding the problem.',
	body: [
		'I believe in measuring before optimizing, simplifying before adding complexity, and evolving systems incrementally rather than rewriting them unnecessarily.',
		'Reliable software comes from clear responsibilities, deliberate tradeoffs, and understanding how systems behave in production.',
	],
};

export const BACKGROUND = {
	summary:
		'Over two decades building production systems in financial technology, enterprise logistics, and healthcare platforms.',
	companies: ['TIBCO', 'HP', 'XPO Logistics', 'DexCare'],
};
