/**
 * finalize-moves.ts
 * Adds the 4 unmatched moves and writes the final champions_final_moves.json
 * Also updates i18n files with these new moves
 * Run: npx tsx src/scripts/finalize-moves.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');

// Load current final moves
const moves: any[] = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'champions_final_moves.json'), 'utf-8')
);

// 4 missing moves data (verified from Wikidex)
const missingMoves = [
  {
    nameEs: 'Cañón Batidor', nameEs2: undefined,
    nameEn: 'Matcha Gotcha', i18nKey: 'move.canon_batidor',
    key: 'matcha_gotcha', type: 'grass', category: 'special',
    pp: 15, ppStandard: 15, power: 80, powerMin: null, powerMax: null,
    accuracy: 90, minHits: null, maxHits: null,
    available: true, moveClass: 'normal',
    flags: { contact: false, sound: false, punch: false, bite: false,
             pulse: false, bullet: false, wind: false, slicing: false,
             dance: false, powder: false, explosive: false, secondary: false }
  },
  {
    nameEs: 'Asalto Barrera', nameEs2: undefined,
    nameEn: 'Psyshield Bash', i18nKey: 'move.asalto_barrera',
    key: 'psyshield_bash', type: 'psychic', category: 'physical',
    pp: 10, ppStandard: 10, power: 90, powerMin: null, powerMax: null,
    accuracy: 90, minHits: null, maxHits: null,
    available: true, moveClass: 'normal',
    flags: { contact: true, sound: false, punch: false, bite: false,
             pulse: false, bullet: false, wind: false, slicing: false,
             dance: false, powder: false, explosive: false, secondary: false }
  },
  {
    nameEs: 'Moluscañón', nameEs2: undefined,
    nameEn: 'Shell Side Arm', i18nKey: 'move.moluscanon',
    key: 'shell_side_arm', type: 'poison', category: 'special',
    pp: 10, ppStandard: 10, power: 90, powerMin: null, powerMax: null,
    accuracy: 100, minHits: null, maxHits: null,
    available: true, moveClass: 'normal',
    flags: { contact: false, sound: false, punch: false, bite: false,
             pulse: false, bullet: false, wind: false, slicing: false,
             dance: false, powder: false, explosive: false, secondary: false }
  },
  {
    nameEs: 'Roca Veloz', nameEs2: undefined,
    nameEn: 'Accelerock', i18nKey: 'move.roca_veloz',
    key: 'accelerock', type: 'rock', category: 'physical',
    pp: 20, ppStandard: 20, power: 40, powerMin: null, powerMax: null,
    accuracy: 100, minHits: null, maxHits: null,
    available: true, moveClass: 'normal',
    flags: { contact: true, sound: false, punch: false, bite: false,
             pulse: false, bullet: false, wind: false, slicing: false,
             dance: false, powder: false, explosive: false, secondary: false }
  },
];

// Add them
for (const m of missingMoves) {
  if (!moves.find(x => x.key === m.key)) {
    moves.push(m);
    console.log(`✓ Added: ${m.nameEs} / ${m.nameEn}`);
  } else {
    console.log(`⏭  Already exists: ${m.nameEn}`);
  }
}

// Sort
moves.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
fs.writeFileSync(path.join(ROOT, 'champions_final_moves.json'), JSON.stringify(moves, null, 2));

// Update i18n files
const I18N_DIR = path.join(ROOT, 'public/assets/i18n');
const LOCALES = ['es-ES', 'es-LA', 'en-US'];

const translations: Record<string, Record<string, string>> = {
  'es-ES': {
    'move.canon_batidor': 'Cañón Batidor',
    'move.asalto_barrera': 'Asalto Barrera',
    'move.moluscanon': 'Moluscañón',
    'move.roca_veloz': 'Roca Veloz',
  },
  'es-LA': {
    'move.canon_batidor': 'Cañón Batidor',
    'move.asalto_barrera': 'Asalto Barrera',
    'move.moluscanon': 'Moluscañón',
    'move.roca_veloz': 'Roca Veloz',
  },
  'en-US': {
    'move.canon_batidor': 'Matcha Gotcha',
    'move.asalto_barrera': 'Psyshield Bash',
    'move.moluscanon': 'Shell Side Arm',
    'move.roca_veloz': 'Accelerock',
  },
};

for (const locale of LOCALES) {
  const filePath = path.join(I18N_DIR, locale, 'moves.json');
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const toAdd = translations[locale] || translations['en-US'];
  let added = 0;
  for (const [key, val] of Object.entries(toAdd)) {
    if (!existing[key]) { existing[key] = val; added++; }
  }
  // Sort by key
  const sorted = Object.fromEntries(Object.entries(existing).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`  ${locale}/moves.json: +${added} keys`);
}

console.log(`\n✅ Final move list: ${moves.length} moves`);
console.log(`   Normal moves: ${moves.filter(m => m.moveClass === 'normal').length}`);
