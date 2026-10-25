import { chromium } from '@playwright/test';
import { mkdir, readFile, readdir } from 'node:fs/promises';

const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PREVIEW_BROWSER_CHANNEL || undefined,
});
try {
  await mkdir('.local/previews', { recursive: true });
  const expected = JSON.parse(await readFile('data/menu/dolny-stal.json', 'utf8')).filter(item => item.active).map(item => item.id);
  const ids = new Set();
  for (const name of (await readdir('preview')).filter(name => /^menu.*\.html$/.test(name))) {
    const html = await readFile(`preview/${name}`, 'utf8');
    for (const [, id] of html.matchAll(/data-item-id="([^"]+)"/g)) ids.add(id);
  }
  const missing = expected.filter(id => !ids.has(id));
  if (missing.length) throw new Error(`Static menu is missing ${missing.length} active items: ${missing.slice(0, 5).join(', ')}`);
  const headers = await readFile('preview/_headers', 'utf8');
  const policy = headers.match(/^  Content-Security-Policy: (.+)$/m)?.[1];
  if (!headers.includes('X-Robots-Tag: noindex') || !policy) throw new Error('Cloudflare Pages headers are missing');
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const problems = [];
    page.on('pageerror', error => problems.push(error.message));
    page.on('requestfailed', request => problems.push(`${request.url()}: ${request.failure()?.errorText}`));
    for (const path of ['index.html', 'menu.html', 'menu-sushi-5.html', 'informacie.html']) {
      const response = await page.goto(`${url}/${path}`, { waitUntil: 'networkidle' });
      if (response?.status() !== 200) problems.push(`${path}: HTTP ${response?.status()}`);
      const details = await page.evaluate(async () => {
        await Promise.all([...document.images].map(async img => {
          img.loading = 'eager';
          try { await img.decode(); } catch { /* Report below. */ }
        }));
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          missingImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
          stylesheet: [...document.styleSheets].some(style => style.href?.endsWith('/assets/style.css')),
        };
      });
      if (details.overflow) problems.push(`${width}px ${path}: horizontal overflow`);
      if (!details.stylesheet) problems.push(`${width}px ${path}: missing stylesheet`);
      problems.push(...details.missingImages.map(image => `${width}px ${path}: image ${image}`));
      if (path === 'index.html' || path === 'menu.html') {
        await page.screenshot({ path: `.local/previews/static-${width}-${path}.png`, fullPage: true });
      }
    }
    await page.goto(`${url}/menu.html`);
    await page.locator('.vf-groups button').nth(4).click();
    await page.waitForURL('**/menu-sushi.html');
    await page.locator('.vf-pagination button').last().click();
    await page.waitForURL('**/menu-sushi-2.html');
    await page.locator('.vf-menu-item .vf-add').first().click();
    if (!(await page.locator('#preview-toast.is-visible').count())) problems.push(`${width}px: preview-only action notice missing`);
    if (width === 390) {
      await page.locator('.vf-mobile-nav-button').click();
      if (!(await page.locator('.vf-mobile-nav').count())) problems.push('Mobile navigation did not open');
    }
    if (problems.length) throw new Error(problems.join('\n'));
    await page.close();
  }
  const protectedPage = await browser.newPage();
  const violations = [];
  protectedPage.on('console', message => {
    if (message.type() === 'error' && /content security policy/i.test(message.text())) violations.push(message.text());
  });
  await protectedPage.route('**/*', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': policy } });
  });
  await protectedPage.goto(`${url}/menu.html`);
  await protectedPage.locator('.vf-groups button').nth(4).click();
  await protectedPage.waitForURL('**/menu-sushi.html');
  if (violations.length) throw new Error(`Cloudflare CSP blocked preview assets: ${violations.join('; ')}`);
  await protectedPage.close();
  console.log(`Static preview: ${ids.size} menu items, desktop/mobile pages, assets and browser errors verified.`);
} finally {
  await browser.close();
}
