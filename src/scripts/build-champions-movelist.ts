/**
 * build-champions-movelist.ts  v2
 *
 * Strategy:
 *  - Spanish move names from Wikidex (champions_moves_es.json)
 *  - i18n es-ES/moves.json: key → Spanish name
 *  - i18n en-US/moves.json: key → English name
 *  - Build ES_name → EN_name map via shared keys
 *  - Then enrich with Showdown data (flags, type, category, base PP)
 *  - Override PP with Serebii Champions PP
 *
 * Run: npx tsx src/scripts/build-champions-movelist.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');

// ── Load data ────────────────────────────────────────────────────────────────

const movesEs: string[] = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'champions_moves_es.json'), 'utf-8')
);

const esI18n: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'public/assets/i18n/es-ES/moves.json'), 'utf-8')
);
const enI18n: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'public/assets/i18n/en-US/moves.json'), 'utf-8')
);

const psRaw = fs.readFileSync(
  'C:/Users/dj_ra/.gemini/antigravity-ide/brain/ca987281-7fbf-4419-b388-1aff544b1aad/.system_generated/steps/3009/content.md',
  'utf-8'
);
const psJsonStart = psRaw.indexOf('{');
const psData: Record<string, any> = JSON.parse(psRaw.slice(psJsonStart, psRaw.lastIndexOf('}') + 1));

const serebiiMoves: any[] = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'scraped_moves.json'), 'utf-8')
);

// ── Build ES name → i18n key map ─────────────────────────────────────────────

const normalize = (s: string) => s.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove accents
  .replace(/[^a-z0-9]/g, '');

// ES name → key
const esNameToKey: Record<string, string> = {};
for (const [key, esName] of Object.entries(esI18n)) {
  esNameToKey[normalize(esName)] = key;
}

// key → EN name
const keyToEnName: Record<string, string> = {};
for (const [key, enName] of Object.entries(enI18n)) {
  keyToEnName[key] = enName;
}

// ── Build Showdown lookup by normalized EN name ───────────────────────────────

const psByNormEn: Record<string, any> = {};
Object.values(psData).forEach((m: any) => {
  psByNormEn[normalize(m.name)] = m;
});

// ── Build Serebii lookup by normalized EN name ───────────────────────────────

const serebiiByNormEn: Record<string, any> = {};
serebiiMoves.forEach(m => {
  serebiiByNormEn[normalize(m.nameEn)] = m;
});

// ── Process each move from Wikidex ───────────────────────────────────────────

function toKey(en: string): string {
  return en.toLowerCase()
    .replace(/['''\-]/g, '_').replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_').replace(/^_|_$/g, '');
}

interface FinalMove {
  nameEs: string;
  nameEs2?: string;
  nameEn: string;
  i18nKey: string;
  key: string;
  type: string;
  category: string;
  pp: number | null;
  ppStandard: number | null;
  power: number | null;
  powerMin: number | null;
  powerMax: number | null;
  accuracy: number | null;
  minHits: number | null;
  maxHits: number | null;
  available: boolean;
  moveClass: string;
  flags: Record<string, boolean>;
}

const results: FinalMove[] = [];
const unmatched: string[] = [];

for (const rawName of movesEs) {
  const parts = rawName.split('/').map((s: string) => s.trim());
  const nameEs  = parts[0];
  const nameEs2 = parts[1];

  // Find i18n key using normalized ES names
  let i18nKey = '';
  for (const part of parts) {
    const norm = normalize(part);
    if (esNameToKey[norm]) { i18nKey = esNameToKey[norm]; break; }
  }

  if (!i18nKey) { unmatched.push(rawName); continue; }

  const enName = keyToEnName[i18nKey];
  if (!enName) { unmatched.push(rawName + ' (no EN)'); continue; }

  // Showdown data
  const psMove = psByNormEn[normalize(enName)];
  // Serebii data (Champions PP)
  const serebiiMove = serebiiByNormEn[normalize(enName)];

  const champPP  = serebiiMove?.pp ?? psMove?.pp ?? null;
  const stdPP    = psMove?.pp ?? null;

  results.push({
    nameEs,
    nameEs2,
    nameEn: enName,
    i18nKey,
    key: toKey(enName),
    type:     (psMove?.type ?? '').toLowerCase(),
    category: (psMove?.category ?? 'status').toLowerCase(),
    pp:       champPP,
    ppStandard: stdPP,
    power:    (psMove?.basePower > 0 ? psMove.basePower : null) ?? serebiiMove?.power ?? null,
    powerMin: serebiiMove?.powerMin ?? null,
    powerMax: serebiiMove?.powerMax ?? null,
    accuracy: psMove?.accuracy === true ? null : (psMove?.accuracy || null),
    minHits:  serebiiMove?.minHits ?? null,
    maxHits:  serebiiMove?.maxHits ?? null,
    available: true,
    moveClass: 'normal',
    flags: {
      contact:   !!psMove?.flags?.contact,
      sound:     !!psMove?.flags?.sound,
      punch:     !!psMove?.flags?.punch,
      bite:      !!psMove?.flags?.bite,
      pulse:     !!psMove?.flags?.pulse,
      bullet:    !!psMove?.flags?.bullet,
      wind:      !!psMove?.flags?.wind,
      slicing:   !!psMove?.flags?.slicing,
      dance:     !!psMove?.flags?.dance,
      powder:    !!psMove?.flags?.powder,
      explosive: !!psMove?.flags?.explosive,
      secondary: false,
    }
  });
}

results.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
fs.writeFileSync(path.join(ROOT, 'champions_final_moves.json'), JSON.stringify(results, null, 2));

// ── Summary ─────────────────────────────────────────────────────────────────

const ppDiffs = results.filter(m => m.pp !== m.ppStandard && m.pp !== null);
console.log('\n─────────────── SUMMARY ───────────────');
console.log(`Wikidex moves input:     ${movesEs.length}`);
console.log(`Matched (with EN name):  ${results.length}`);
console.log(`Unmatched:               ${unmatched.length}`);
console.log(`PP differences vs std:   ${ppDiffs.length}`);

if (unmatched.length > 0) {
  console.log('\n⚠  Unmatched (need manual mapping):');
  unmatched.slice(0, 30).forEach(m => console.log(`   ${m}`));
  if (unmatched.length > 30) console.log(`   ... and ${unmatched.length - 30} more`);
}

console.log('\nSample output:');
results.slice(0, 5).forEach(m => {
  console.log(`  [${m.i18nKey.padEnd(25)}] ${m.nameEs.padEnd(20)} → ${m.nameEn.padEnd(20)} PP:${m.pp} (std:${m.ppStandard})`);
});
console.log(`\n📁 champions_final_moves.json (${results.length} moves)`);
