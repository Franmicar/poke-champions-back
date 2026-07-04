/**
 * inspect-venusaur-final.ts - Extract all Champions moves correctly
 */
import * as fs from 'fs';
import * as cheerio from 'cheerio';

const content = fs.readFileSync(
  'C:/Users/dj_ra/.gemini/antigravity-ide/brain/ca987281-7fbf-4419-b388-1aff544b1aad/.system_generated/steps/3039/content.md',
  'utf-8'
);

// Find the real Champions section (position 748153 from previous run)
// We look for the table class "movnivel" after the Champions heading
const SECTION_POS = 748153;

// Find table AFTER this position
const afterSection = content.slice(SECTION_POS);
const tableStart = afterSection.indexOf('<table class="movnivel"');
if (tableStart === -1) {
  // Try alternative class
  const alt = afterSection.indexOf('<table');
  console.log('No movnivel table. Next table at offset:', alt);
  console.log('HTML at that point:', afterSection.slice(alt, alt + 200));
  process.exit(1);
}

// Find the end of this table
const tableEnd = afterSection.indexOf('</table>', tableStart) + '</table>'.length;
const tableHtml = afterSection.slice(tableStart, tableEnd);
console.log('Table class: movnivel, length:', tableHtml.length);

// Parse with cheerio
const $ = cheerio.load(tableHtml);
const moves: { nameEs: string; link: string }[] = [];

$('tr').each((i, row) => {
  const firstTd = $(row).find('td').first();
  const link = firstTd.find('a').first();
  const nameEs = link.text().trim();
  const href = link.attr('href') || '';
  if (nameEs && nameEs.length > 1) {
    moves.push({ nameEs, link: `https://www.wikidex.net${href}` });
  }
});

console.log(`\n✅ Total moves for Venusaur in Champions: ${moves.length}`);
moves.forEach((m, i) => console.log(`  ${(i+1).toString().padStart(3)}. ${m.nameEs}`));

// Check: count of table rows
console.log('\nTable row count:', $('tr').length);
