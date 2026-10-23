import { mkdir, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';

const directory = '.local/menu-source';
await mkdir(directory, { recursive: true });
for (const path of ['hlavne-menu', 'sushi-menu', 'napoje-menu', 'denne-menu']) {
  const url = `https://vietfood.sk/${path}`;
  const response = await fetch(url, { headers: { Cookie: 'mcn_branch_key=br_64a07613' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  const html = await response.text();
  await writeFile(`${directory}/${path}.html`, html);
  const $ = load(html);
  console.log(JSON.stringify({ path, title: $('title').text(), cards: $('.js-product-card').length, branch: $('.p-info-bar_item--branch').text().trim(), images: $('.js-product-card img').length }));
}
