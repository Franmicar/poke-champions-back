/**
 * extract-champions-pokemon.ts
 * Parses the Wikidex Champions Pokemon list HTML
 */
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = 'C:/Users/dj_ra/.gemini/antigravity-ide/brain/ca987281-7fbf-4419-b388-1aff544b1aad/.system_generated/steps/3025/content.md';
const content = fs.readFileSync(filePath, 'utf-8');

console.log('File size:', content.length, 'chars');
console.log('Has DOCTYPE:', content.includes('<!DOCTYPE html>'));
console.log('Has tabpokemon:', content.includes('tabpokemon'));
console.log('Has Venusaur:', content.includes('Venusaur'));

// Use regex to extract all Pokemon links from table rows
// Pattern: links to /wiki/PokemonName that are inside td elements
// The links look like: href="/wiki/Venusaur" title="Venusaur">Venusaur</a>
const linkRegex = /href="\/wiki\/([^"]+)"\s+title="([^"]+)">([^<]+)<\/a>/g;
const seen = new Set<string>();
const pokemon: { name: string; slug: string; url: string }[] = [];

let match;
// Only process the table section
const tableStart = content.indexOf('tabpokemon');
const tableEnd = content.indexOf('</table>', tableStart);
const tableContent = tableStart > 0 ? content.slice(tableStart, tableEnd > 0 ? tableEnd : undefined) : content;

console.log('\nTable section found:', tableStart > 0, '| Length:', tableContent.length);

while ((match = linkRegex.exec(tableContent)) !== null) {
  const slug = match[1];
  const name = match[3].trim();
  
  // Skip type links, file links, category links, redirect links
  if (slug.startsWith('Tipo_') || slug.startsWith('tipo_') || 
      slug.startsWith('Archivo:') || slug.startsWith('Categoría') ||
      slug.startsWith('Especial:') || slug.startsWith('WikiDex') ||
      slug.startsWith('Lista_') || slug.startsWith('Primera') ||
      slug.includes('generación') || slug.includes('generacion') ||
      name.length === 0 || name.includes('Tipo')) {
    continue;
  }
  
  if (!seen.has(name)) {
    seen.add(name);
    pokemon.push({ name, slug, url: `https://www.wikidex.net/wiki/${slug}` });
  }
}

console.log(`\nTotal unique Pokemon found: ${pokemon.length}`);
console.log('\nFirst 20:');
pokemon.slice(0, 20).forEach((p, i) => console.log(`  ${(i+1).toString().padStart(3)}. ${p.name} → /wiki/${p.slug}`));
console.log('\nLast 10:');
pokemon.slice(-10).forEach((p, i) => console.log(`  ${(pokemon.length - 9 + i).toString().padStart(3)}. ${p.name} → /wiki/${p.slug}`));

// Save list
const outPath = path.join(__dirname, '../../champions_pokemon_list.json');
fs.writeFileSync(outPath, JSON.stringify(pokemon, null, 2));
console.log(`\nSaved ${pokemon.length} Pokemon to: ${outPath}`);
