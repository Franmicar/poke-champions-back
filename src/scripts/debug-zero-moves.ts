/**
 * debug-zero-moves.ts
 * Diagnoses why some Pokemon return 0 moves
 */
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Test with Umbreon (known 0-move case) and Venusaur (known working case)
const TEST_URLS = [
  { name: 'Umbreon',  url: 'https://www.wikidex.net/wiki/Umbreon' },
  { name: 'Scizor',   url: 'https://www.wikidex.net/wiki/Scizor' },
  { name: 'Venusaur', url: 'https://www.wikidex.net/wiki/Venusaur' },
];

for (const { name, url } of TEST_URLS) {
  console.log(`\n=== ${name} ===`);
  const response = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120', 'Accept-Language': 'es-ES' },
    timeout: 30000,
  });
  const html: string = response.data;
  fs.writeFileSync(path.join(__dirname, `../../debug_${name.toLowerCase()}.html`), html);
  
  // Check for Champions section markers
  const markers = [
    'Pokémon_Champions',
    'Pok.C3.A9mon_Champions',
    'Champions',
    'movnivel',
    'movimiento'
  ];
  
  for (const m of markers) {
    const count = (html.match(new RegExp(m, 'g')) || []).length;
    const pos = html.lastIndexOf(m);
    console.log(`  "${m}": count=${count}, last pos=${pos}`);
  }
  
  // Show context around the Champions section
  const champPos = html.lastIndexOf('Champions');
  if (champPos > 0) {
    console.log(`  Context (Champions last occurrence):`);
    console.log('  ' + html.slice(champPos - 100, champPos + 200).replace(/\n/g, ' ').slice(0, 300));
  }
  
  // Check for movnivel after the last Champions occurrence
  const afterChamp = html.slice(champPos);
  const tableIdx = afterChamp.indexOf('<table class="movnivel"');
  console.log(`  movnivel table after last Champions: ${tableIdx > 0 ? tableIdx : 'NOT FOUND'}`);
  
  await new Promise(r => setTimeout(r, 2000));
}
