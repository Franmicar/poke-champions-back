import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(__dirname, '../../serebii_normal_raw.html'), 'utf-8');
const $ = cheerio.load(html);
const rows = $('table.dextable tr');

console.log('Total rows in dextable:', rows.length);
console.log('\n--- First 5 data rows ---');

rows.slice(0, 6).each((i, r) => {
  const cells = $(r).find('td, th');
  console.log(`\nRow ${i} (${cells.length} cells):`);
  cells.each((j, c) => {
    const img = $(c).find('img').first().attr('src') || '';
    const txt = $(c).text().trim().slice(0, 50);
    const link = $(c).find('a').first().text().trim().slice(0, 50);
    console.log(`  Cell ${j}: text="${txt}" img="${img}" link="${link}"`);
  });
});
