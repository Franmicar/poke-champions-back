/**
 * fix-population-bomb.ts
 * Fixes the Population Bomb / Tail Slap mapping error
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');

const moves: any[] = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'champions_final_moves.json'), 'utf-8')
);

// Check what i18n says about these moves
const esI18n = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/assets/i18n/es-ES/moves.json'), 'utf-8'));
const enI18n = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/assets/i18n/en-US/moves.json'), 'utf-8'));

// Find "Proliferación" in i18n
const prolifKey = Object.entries(esI18n).find(([,v]) => (v as string).includes('Proliferación'));
console.log('Proliferación i18n entry:', prolifKey);

// Find "Golpe de Cola" / "Plumerazo" in i18n
const golpeKey = Object.entries(esI18n).find(([,v]) => (v as string).includes('Plumerazo') || (v as string) === 'Golpe de Cola');
console.log('Golpe de Cola/Plumerazo i18n entry:', golpeKey);

// Find "Tail Slap" in en-US i18n
const tailSlapKey = Object.entries(enI18n).find(([,v]) => (v as string) === 'Tail Slap');
console.log('Tail Slap i18n entry:', tailSlapKey);

// Current populationbomb entry
const popBomb = moves.find(m => m.key === 'populationbomb');
console.log('\nCurrent populationbomb entry:', popBomb?.nameEs, '->', popBomb?.nameEn);

// Fix: update Population Bomb to use correct ES name "Proliferación"
if (popBomb) {
  popBomb.nameEs = 'Proliferación';
  console.log('✓ Fixed Population Bomb ES name to "Proliferación"');
}

// Add Tail Slap if it doesn't exist
const tailSlap = moves.find(m => m.key === 'tailslap');
if (!tailSlap) {
  // Tail Slap: Normal/Physical, Power:25, Accuracy:85, PP:10, multi-hit 2-5
  moves.push({
    nameEs: 'Golpe de Cola', nameEs2: 'Plumerazo',
    nameEn: 'Tail Slap', i18nKey: golpeKey?.[0] ?? 'move.plumerazo',
    key: 'tailslap', type: 'normal', category: 'physical',
    pp: 10, ppStandard: 10, power: 25, powerMin: null, powerMax: null,
    accuracy: 85, minHits: 2, maxHits: 5,
    available: true, moveClass: 'normal',
    flags: { contact: true, sound: false, punch: false, bite: false,
             pulse: false, bullet: false, wind: false, slicing: false,
             dance: false, powder: false, explosive: false, secondary: false }
  });
  console.log('✓ Added Tail Slap');
}

// Sort and save
moves.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
fs.writeFileSync(path.join(ROOT, 'champions_final_moves.json'), JSON.stringify(moves, null, 2));

// Verify
const keys = moves.map(m => m.key);
const dupKeys = keys.filter((k, i) => keys.indexOf(k) !== i);
console.log(`\n✅ Saved ${moves.length} moves | Duplicates: ${dupKeys.length}`);
