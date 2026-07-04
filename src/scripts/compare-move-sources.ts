/**
 * compare-move-sources.ts
 * Compara los movimientos de Serebii Champions (scraped_moves.json)
 * con los de Showdown (moves.json local)
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Cargar Showdown moves ─────────────────────────────────────────────────────
const psRaw = fs.readFileSync(
  'C:/Users/dj_ra/.gemini/antigravity-ide/brain/ca987281-7fbf-4419-b388-1aff544b1aad/.system_generated/steps/3009/content.md',
  'utf-8'
);
const jsonStart = psRaw.indexOf('{');
const psData: Record<string, any> = JSON.parse(psRaw.slice(jsonStart, psRaw.lastIndexOf('}') + 1));

// Moves disponibles en Showdown (no Z, no Max, no nonstandard)
const psAvailable = Object.values(psData).filter(m =>
  !m.isZ && !m.isMax && !m.isNonstandard && m.num > 0
);

// Normalizar nombre para comparar
const normalize = (name: string) =>
  name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();

const psNames = new Set(psAvailable.map(m => normalize(m.name)));
const psByNorm: Record<string, any> = {};
psAvailable.forEach(m => { psByNorm[normalize(m.name)] = m; });

console.log(`Showdown available moves: ${psAvailable.length}`);

// ── Cargar Serebii scraped ────────────────────────────────────────────────────
const serebii: any[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../scraped_moves.json'), 'utf-8')
);
const serebiiNormal = serebii.filter(m => m.moveClass === 'normal');
console.log(`Serebii normal moves: ${serebiiNormal.length}`);

// ── Comparación ───────────────────────────────────────────────────────────────

// En Serebii PERO NO en Showdown (posibles movimientos exclusivos de Champions)
const serebiiOnly = serebiiNormal.filter(m => !psNames.has(normalize(m.nameEn)));
console.log(`\n⚡ In Serebii but NOT in Showdown (${serebiiOnly.length} moves):`);
serebiiOnly.forEach(m => console.log(`   [${m.type.padEnd(10)}] ${m.nameEn} PP:${m.pp} pow:${m.power ?? '--'}`));

// En Showdown PERO NO en Serebii (movimientos que Serebii no tiene de Champions)
const psOnly = psAvailable.filter(m => {
  const n = normalize(m.name);
  return !serebiiNormal.some(s => normalize(s.nameEn) === n);
});
console.log(`\n⚡ In Showdown but NOT in Serebii (${psOnly.length} moves):`);
psOnly.slice(0, 30).forEach(m => console.log(`   [${m.type.padEnd(10)}] ${m.name} PP:${m.pp} pow:${m.basePower}`));
if (psOnly.length > 30) console.log(`   ... and ${psOnly.length - 30} more`);

// En ambos (intersección)
const inBoth = serebiiNormal.filter(m => psNames.has(normalize(m.nameEn)));
console.log(`\n✅ In both datasets: ${inBoth.length}`);

// PP comparison for moves in both
let ppDiffs = 0;
inBoth.forEach(s => {
  const ps = psByNorm[normalize(s.nameEn)];
  if (ps && s.pp !== null && ps.pp !== s.pp) {
    ppDiffs++;
  }
});
console.log(`   PP differences (Serebii vs Showdown): ${ppDiffs}`);

// Summary
console.log(`
─────────────── SUMMARY ───────────────
Showdown available:    ${psAvailable.length}
Serebii normal:        ${serebiiNormal.length}
In both:               ${inBoth.length}
Serebii only:          ${serebiiOnly.length}  ← possible Champions exclusives or scraping noise
Showdown only:         ${psOnly.length}  ← possibly removed/unavailable in Champions
PP differences:        ${ppDiffs}
`);
