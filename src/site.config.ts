// Personal details and site-wide settings. Edit this file to update the
// information shown across the site; page content lives in src/content/.
// Values marked PLACEHOLDER still need real information.

export const SITE = {
	url: 'https://jameskunley.com',
	title: 'James Kunley',
	description:
		'James Kunley is a software engineer who builds reliable, well-designed systems. Projects, writing, and resume.', // PLACEHOLDER
	locale: 'en-US',
};

export const PROFILE = {
	name: 'James Kunley',
	role: 'Software Engineer',
	location: 'City, State', // PLACEHOLDER
	tagline: 'I build reliable software and the systems that keep it running.', // PLACEHOLDER
	intro: [
		// PLACEHOLDER
		'I’m a software engineer focused on backend services, developer tooling, and the infrastructure that ties them together. I care about clear interfaces, boring reliability, and code the next person can understand.',
		'I’m currently looking for my next role on a team that values thoughtful engineering and ownership.',
	],
	availability: 'Open to new opportunities', // PLACEHOLDER
	photoAlt: 'Portrait of James Kunley',
	resume: '/resume.pdf',
};

export const LINKS = {
	github: 'https://github.com/jtkunley',
	linkedin: 'https://www.linkedin.com/in/jameskunley', // PLACEHOLDER
	email: 'hello@jameskunley.com', // PLACEHOLDER
};

export const NAV = [
	{ href: '/', label: 'Home' },
	{ href: '/projects/', label: 'Projects' },
	{ href: '/blog/', label: 'Writing' },
];

// PLACEHOLDER: replace with your actual areas of expertise.
export const EXPERTISE = [
	{
		area: 'Backend & APIs',
		detail: 'Designing services and data models that are easy to reason about and hard to misuse.',
		skills: ['TypeScript', 'Python', 'Go', 'PostgreSQL', 'REST', 'gRPC'],
	},
	{
		area: 'Infrastructure & Reliability',
		detail: 'Shipping safely with automation, observability, and well-understood failure modes.',
		skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Observability'],
	},
	{
		area: 'Frontend & Product',
		detail: 'Building fast, accessible interfaces and working closely with product and design.',
		skills: ['React', 'Astro', 'HTML & CSS', 'Accessibility', 'Performance'],
	},
];
