// Personal details and site-wide settings. Long-form content lives in src/content/.
// Homepage sections with no content (empty lists or strings) are hidden.

export const SITE = {
	url: 'https://jameskunley.com',
	title: 'James Kunley',
	description: 'James Kunley is a software engineer based in Vancouver, WA.',
	locale: 'en-US',
};

export const PROFILE = {
	name: 'James Kunley',
	role: 'Software Engineer',
	location: 'Vancouver, WA',
	// One sentence on how you approach engineering.
	statement: '',
	intro: '',
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

// Core strengths, e.g. { title: 'Software architecture', body: '...' }.
export const EXPERTISE: { title: string; body: string }[] = [];

// Roles, most recent first, e.g. { period: '2020 — Present', role: '...', org: '...', summary: '...' }.
export const EXPERIENCE: { period: string; role: string; org: string; summary: string }[] = [];
