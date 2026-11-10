import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import puppeteer from 'puppeteer';
import { PROFILE } from '../../site.config';
import { designPdfPath } from './paths';
import { serveDirectory } from './serve';

const DESIGN_PAGE = /^designs\/([^/]+)\/$/;

const runningLine = (left: string, right: string) => `
<div style="width: 100%; padding: 0 0.75in; display: flex; justify-content: space-between; font: 8px system-ui, sans-serif; color: #6b665e;">
	<span>${left}</span>
	<span>${right}</span>
</div>`;

const footerTemplate = runningLine(
	'<span class="title"></span>',
	'<span class="pageNumber"></span> / <span class="totalPages"></span>',
);

/** Renders each built design page to a PDF beside it, using the site's print styles. */
export function designPdfs(): AstroIntegration {
	let site = '';
	return {
		name: 'design-pdfs',
		hooks: {
			'astro:config:done': ({ config }) => {
				site = config.site ?? '';
			},
			'astro:build:done': async ({ dir, pages, logger }) => {
				const slugs = pages.flatMap(({ pathname }) => DESIGN_PAGE.exec(pathname)?.[1] ?? []);
				if (slugs.length === 0) return;

				const root = fileURLToPath(dir);
				const headerTemplate = runningLine(`${PROFILE.name} · Engineering Design`, site ? new URL(site).host : '');
				const server = await serveDirectory(root);
				const browser = await puppeteer.launch({ headless: 'shell' });
				try {
					const page = await browser.newPage();
					for (const slug of slugs) {
						await page.goto(`${server.origin}/designs/${slug}/`, { waitUntil: 'networkidle0' });
						await page.evaluate(async (site) => {
							// Lazy images below the fold would otherwise be missing from the PDF.
							const images = [...document.images];
							for (const image of images) image.loading = 'eager';
							await Promise.all(images.map((image) => image.decode().catch(() => {})));
							await document.fonts.ready;
							// Point site links at the public site instead of the local build server; in-page anchors stay internal.
							if (!site) return;
							for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href]')) {
								const url = new URL(link.href);
								const samePage = url.pathname === location.pathname && url.hash !== '';
								if (url.origin === location.origin && !samePage) link.href = new URL(url.pathname + url.hash, site).href;
							}
						}, site);
						await page.pdf({
							path: `${root}${designPdfPath(slug).slice(1)}`,
							format: 'Letter',
							printBackground: true,
							margin: { top: '0.75in', bottom: '0.75in', left: '0.75in', right: '0.75in' },
							displayHeaderFooter: true,
							headerTemplate,
							footerTemplate,
						});
						logger.info(`Generated ${designPdfPath(slug)}`);
					}
				} finally {
					await browser.close();
					await server.close();
				}
			},
		},
	};
}
