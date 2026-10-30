// Personal details and site-wide settings. Edit this file to update the
// information shown across the site; long-form content lives in src/content/.
// Values marked PLACEHOLDER still need real information.

export const SITE = {
	url: 'https://jameskunley.com',
	title: 'James Kunley',
	description:
		'James Kunley is a software engineer working on software architecture, complex systems, and technical leadership.', // PLACEHOLDER
	locale: 'en-US',
};

export const PROFILE = {
	name: 'James Kunley',
	role: 'Software Engineer',
	location: 'City, State', // PLACEHOLDER
	// PLACEHOLDER: one sentence that captures how you approach engineering.
	statement: 'I design software systems that stay clear, dependable, and adaptable as they grow.',
	// PLACEHOLDER
	intro:
		'I work across architecture, backend systems, and the infrastructure beneath them. Most of my time goes to the parts of a system where careful decisions compound: boundaries, data, and failure modes.',
	photoAlt: 'Portrait of James Kunley',
	resume: '/resume.pdf',
};

export const LINKS = {
	github: 'https://github.com/jtkunley',
	linkedin: 'https://www.linkedin.com/in/jameskunley', // PLACEHOLDER
	email: 'hello@jameskunley.com', // PLACEHOLDER
};

export const CONTACT = [
	{ label: 'Email', value: LINKS.email, href: `mailto:${LINKS.email}` },
	{ label: 'LinkedIn', value: 'linkedin.com/in/jameskunley', href: LINKS.linkedin }, // PLACEHOLDER
	{ label: 'GitHub', value: 'github.com/jtkunley', href: LINKS.github },
	{ label: 'Résumé', value: 'Download (PDF)', href: PROFILE.resume },
];

export const NAV = [
	{ href: '/work/', label: 'Work' },
	{ href: '/blog/', label: 'Writing' },
	{ href: '/#connect', label: 'Connect' },
];

// PLACEHOLDER: refine these to reflect how you actually work.
export const EXPERTISE = [
	{
		title: 'Software architecture',
		body: 'Drawing boundaries that match how a system changes, so teams can move independently without the design eroding.',
	},
	{
		title: 'Complex systems',
		body: 'Distributed services, data pipelines, and integrations where correctness, consistency, and failure handling matter.',
	},
	{
		title: 'Problem solving',
		body: 'Working from first principles on ambiguous problems: measuring before optimizing, and simplifying before adding.',
	},
	{
		title: 'Technical leadership',
		body: 'Setting direction through design reviews, clear writing, and mentoring, and owning outcomes past the first release.',
	},
];

// PLACEHOLDER: replace with your actual roles, most recent first.
export const EXPERIENCE = [
	{
		period: '20XX — Present',
		role: 'Role Title',
		org: 'Company Name',
		summary: 'One or two sentences on scope and responsibility: the systems you owned and the decisions you led.',
	},
	{
		period: '20XX — 20XX',
		role: 'Role Title',
		org: 'Company Name',
		summary: 'A concise description of the work and what changed because of it.',
	},
	{
		period: '20XX — 20XX',
		role: 'Role Title',
		org: 'Company Name',
		summary: 'A concise description of the work and what changed because of it.',
	},
];
