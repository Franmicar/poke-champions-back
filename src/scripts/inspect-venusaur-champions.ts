/**
 * inspect-venusaur-champions.ts
 * Find the Pokémon Champions moves section in the cached Venusaur page
 */
import * as fs from 'fs';

const content = fs.readFileSync(
  'C:/Users/dj_ra/.gemini/antigravity-ide/brain/ca987281-7fbf-4419-b388-1aff544b1aad/.system_generated/steps/3039/content.md',
  'utf-8'
);

// Find the Champions section anchor (it appears twice - once in TOC, once in content)
const anchor = 'id="Pok';
let pos = 0;
let found: number[] = [];
while ((pos = content.indexOf(anchor, pos)) !== -1) {
  const ctx = content.slice(pos, pos + 60);
  if (ctx.includes('Champions')) found.push(pos);
  pos++;
}
console.log('Champions anchors found at positions:', found);

// Use the LAST occurrence (the actual section, not the TOC)
const sectionStart = found[found.length - 1] ?? -1;
if (sectionStart === -1) {
  console.log('Champions section not found!');
  process.exit(1);
}

// Get the section content
const sectionContent = content.slice(sectionStart, sectionStart + 8000);
console.log('\n=== Raw section (stripping most tags) ===');

// Strip most tags but keep table structure
const stripped = sectionContent
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/tr>/gi, '\n')
  .replace(/<\/td>/gi, ' | ')
  .replace(/<\/th>/gi, ' | ')
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#160;/g, ' ')
  .replace(/\n\s*\n/g, '\n')
  .trim();

console.log(stripped.slice(0, 4000));
