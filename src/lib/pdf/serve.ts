import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, normalize } from 'node:path';

const TYPES: Record<string, string> = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp',
	'.woff2': 'font/woff2',
	'.xml': 'application/xml',
};

/** Serves a built site over HTTP so pages load their root-relative assets. */
export async function serveDirectory(root: string) {
	const server = createServer(async (req, res) => {
		const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
		let file = join(root, normalize(pathname));
		if (!file.startsWith(root)) {
			res.writeHead(403).end();
			return;
		}
		try {
			if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
			const body = await readFile(file);
			res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
		} catch {
			res.writeHead(404).end();
		}
	});
	await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
	const { port } = server.address() as AddressInfo;
	return {
		origin: `http://127.0.0.1:${port}`,
		close: () => new Promise<void>((resolve) => server.close(() => resolve())),
	};
}
