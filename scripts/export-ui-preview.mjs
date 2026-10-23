import { chromium } from '@playwright/test';
import { copyFile, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const origin = process.env.PREVIEW_SOURCE || 'http://127.0.0.1:3000';
const output = resolve('preview');
const groupIds = ['predjedla', 'pho-rezance', 'hlavne', 'bento-bowls', 'sushi', 'dezerty', 'napoje'];
const fileFor = (group, page = 1) => group === 'pho-rezance' && page === 1
  ? 'menu.html'
  : `menu-${group}${page > 1 ? `-${page}` : ''}.html`;

async function snapshot(page, source, target, group = '', number = 1) {
  await page.goto(new URL(source, origin).href, { waitUntil: 'domcontentloaded' });
  if (group) {
    await page.locator('.vf-menu-item').first().waitFor();
    await page.waitForFunction(expected => document.querySelector('.vf-pagination strong')?.textContent === String(expected), number);
  } else if (source === '/') {
    await page.locator('.vf-gemini-card').first().waitFor();
  } else {
    await page.locator('.legal .panel').first().waitFor();
  }

  const result = await page.evaluate(({ group, number }) => {
    const sourceRoot = document.querySelector('.vf-public');
    if (!sourceRoot) throw new Error('Customer interface not found');
    const root = sourceRoot.cloneNode(true);
    root.querySelectorAll('.vf-overlay,.vf-toast,[role="dialog"]').forEach(node => node.remove());
    const demo = root.querySelector('.vf-demo') || document.createElement('div');
    demo.className = 'vf-demo';
    demo.textContent = 'UKÁŽKA DIZAJNU · Objednávanie, košík a administrácia nie sú v tomto náhľade zapnuté.';
    if (!demo.parentNode) root.querySelector('.vf-header')?.after(demo);
    root.querySelector('.vf-status')?.replaceChildren(document.createTextNode('Ukážka menu'));
    root.querySelector('.vf-footer-bottom a[href="/admin"]')?.remove();
    root.querySelectorAll('img').forEach(img => {
      const raw = img.getAttribute('src') || '';
      const url = new URL(raw, location.origin);
      const asset = url.pathname === '/_next/image' ? url.searchParams.get('url') : url.pathname;
      if (asset?.startsWith('/menu/') || asset?.startsWith('/fonts/')) img.setAttribute('src', `./assets${asset}`);
      img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.removeAttribute('fetchpriority');
    });
    root.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('/')) return;
      const url = new URL(href, location.origin);
      const hash = url.hash;
      const next = url.pathname === '/' ? 'index.html'
        : url.pathname === '/informacie' ? 'informacie.html'
        : url.pathname === '/menu' ? 'menu.html'
        : 'menu.html';
      link.setAttribute('href', `./${next}${hash}`);
    });
    root.querySelectorAll('.vf-search input').forEach(input => {
      input.value = ''; input.setAttribute('readonly', '');
      input.setAttribute('placeholder', 'Vyhľadávanie je dostupné v plnej verzii');
    });
    root.querySelectorAll('select').forEach(select => select.setAttribute('disabled', ''));
    root.querySelectorAll('.vf-groups button').forEach((button, index) => button.dataset.previewGroup = String(index));
    const countText = document.querySelector('.vf-pagination')?.textContent || '';
    const pageCount = Number(countText.match(/\bz\s+(\d+)/)?.[1] || 1);
    return { html: root.outerHTML, pageCount, group, number };
  }, { group, number });

  const title = group ? 'Menu' : source === '/' ? 'Domov' : 'Informácie';
  const html = `<!doctype html>\n<html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} · VietFood — ukážka dizajnu</title><link rel="stylesheet" href="./assets/style.css"></head><body data-preview-group="${group}" data-preview-page="${number}" data-preview-pages="${result.pageCount}">${result.html}<div id="preview-toast" role="status" aria-live="polite"></div><script src="./assets/preview.js" defer></script></body></html>`;
  await writeFile(join(output, target), html, 'utf8');
  return result.pageCount;
}

async function main() {
  await mkdir(join(output, 'assets'), { recursive: true });
  await cp(resolve('public/fonts'), join(output, 'assets/fonts'), { recursive: true });
  for (const license of ['OFL-CormorantGaramond.txt', 'OFL-PlusJakartaSans.txt']) {
    const path = join(output, 'assets/fonts', license);
    await writeFile(path, (await readFile(path, 'utf8')).replace(/[ \t]+$/gm, ''), 'utf8');
  }
  await cp(resolve('public/menu'), join(output, 'assets/menu'), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await snapshot(page, '/', 'index.html');
    const stylesheet = await page.locator('link[rel="stylesheet"]').first().getAttribute('href');
    if (!stylesheet) throw new Error('Compiled customer stylesheet not found');
    const css = await page.evaluate(async href => (await fetch(href)).text(), stylesheet);
    await writeFile(join(output, 'assets/style.css'), css.replace(/url\((['"]?)\/fonts\//g, 'url($1./fonts/'), 'utf8');
    await snapshot(page, '/informacie', 'informacie.html');
    let total = 2;
    for (const group of groupIds) {
      const count = await snapshot(page, `/menu?group=${group}`, fileFor(group), group);
      total++;
      for (let number = 2; number <= count; number++) {
        await snapshot(page, `/menu?group=${group}&page=${number}`, fileFor(group, number), group, number);
        total++;
      }
    }
    await copyFile(resolve('scripts/ui-preview.js'), join(output, 'assets/preview.js'));
    await writeFile(join(output, '.nojekyll'), '');
    console.log(`Static Gemini UI preview exported: ${total} pages in ${output}`);
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
