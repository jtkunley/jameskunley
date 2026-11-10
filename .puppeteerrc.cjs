// Design PDFs only need the headless shell, so skip downloading full Chrome.
/** @type {import('puppeteer').Configuration} */
module.exports = {
	chrome: { skipDownload: true },
	'chrome-headless-shell': { skipDownload: false },
};
