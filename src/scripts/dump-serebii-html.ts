/**
 * dump-serebii-html.ts
 * Descarga y guarda el HTML crudo de una página de Serebii para inspeccionar su estructura
 * Run: npx tsx src/scripts/dump-serebii-html.ts
 */
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = 'https://www.serebii.net/attackdex-champions/normal.shtml';

const response = await axios.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
  },
  timeout: 30000,
});

// Guardar HTML crudo
const htmlPath = path.join(__dirname, '../../serebii_normal_raw.html');
fs.writeFileSync(htmlPath, response.data, 'utf-8');
console.log(`HTML guardado en: ${htmlPath}`);
console.log(`Tamaño: ${response.data.length} bytes`);

// Analizar estructura de tablas
const $ = cheerio.load(response.data);
const tables = $('table');
console.log(`\nNúmero de tablas encontradas: ${tables.length}`);

tables.each((i, table) => {
  const rows = $(table).find('tr');
  const classes = $(table).attr('class') || '(sin clase)';
  const id = $(table).attr('id') || '(sin id)';
  // Mostrar las primeras 3 filas de cada tabla
  console.log(`\nTabla ${i}: class="${classes}" id="${id}" rows=${rows.length}`);
  rows.slice(0, 3).each((j, row) => {
    const cells = $(row).find('td, th');
    const texts = cells.map((_, c) => `[${$(c).text().trim().slice(0,30)}]`).get().join(' ');
    console.log(`  Row ${j}: ${cells.length} cells → ${texts}`);
  });
});
