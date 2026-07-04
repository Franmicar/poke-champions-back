/**
 * migrate-learnsets.ts
 * Updates each Pokémon's learnset in MongoDB with the Champions move keys (English slugs).
 *
 * Strategy:
 * 1. Build a Spanish-name → English-key lookup from champions_final_moves.json
 *    (indexing both nameEs and nameEs2, and both parts of dual-name entries)
 * 2. For each entry in champions_learnsets.json:
 *    a. Find the Pokémon in DB by name
 *    b. Map each Spanish move name to its English key (trying dual-name parts)
 *    c. Update the `learnset` field in MongoDB
 */

import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalize Spanish text for matching: lowercase, remove accents, trim */
function normalize(s: string): string {
  if (!s) return '';
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/\s+/g, ' ');           // normalize spaces
}

// ── Load data ─────────────────────────────────────────────────────────────────

const finalMoves: any[] = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'champions_final_moves.json'), 'utf-8')
);
const learnsets: Array<{ pokemon: string; url: string; moves: string[] }> = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'champions_learnsets.json'), 'utf-8')
);

// ── Build Spanish → key lookup ────────────────────────────────────────────────

const esToKey = new Map<string, string>();

for (const m of finalMoves) {
  // Index primary name
  if (m.nameEs) esToKey.set(normalize(m.nameEs), m.key);
  // Index secondary name
  if (m.nameEs2) esToKey.set(normalize(m.nameEs2), m.key);
}

// Manual fixes for known mismatches
esToKey.set(normalize('Marcha Espectral'), 'lastrespects');

console.log(`✅ Loaded ${finalMoves.length} moves, ${esToKey.size} Spanish name entries`);

/** Resolve a learnset move string (possibly "Name1/Name2") to an English key */
function resolveMove(rawName: string): string | null {
  // Try the full string first
  const fullKey = esToKey.get(normalize(rawName));
  if (fullKey) return fullKey;

  // Try splitting by "/"
  const parts = rawName.split('/').map(p => p.trim());
  for (const part of parts) {
    const k = esToKey.get(normalize(part));
    if (k) return k;
  }

  return null;
}

// ── Connect and migrate ───────────────────────────────────────────────────────

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pokemon_champions';

await mongoose.connect(MONGO_URI);
console.log('✅ Connected to MongoDB\n');

const db = mongoose.connection.db!;
const col = db.collection('pokemons');

let updated = 0;
let notFoundCount = 0;
const unmatchedMoves = new Map<string, number>(); // Spanish name → count of Pokémon missing it

for (const entry of learnsets) {
  // Find the Pokémon in DB
  // 1. Try exact match
  let poke = await col.findOne({
    name: { $regex: `^${entry.pokemon}$`, $options: 'i' }
  });

  // 2. Try prefix match (for variants like Basculegion(Hembra) or Mega-Pyroar)
  if (!poke) {
    poke = await col.findOne({
      $or: [
        { name: { $regex: `^${entry.pokemon}\\(`, $options: 'i' } }, // e.g. "Basculegion("
        { name: { $regex: `^Mega-${entry.pokemon}$`, $options: 'i' } }, // e.g. "Mega-Pyroar"
        { name: { $regex: `^${entry.pokemon}`, $options: 'i' } } // Fallback: starts with
      ]
    });
  }

  if (!poke) {
    console.warn(`  ⚠  Pokémon not found in DB: "${entry.pokemon}"`);
    notFoundCount++;
    continue;
  }

  // Map Spanish move names to English keys
  const learnset: string[] = [];
  for (const rawMove of entry.moves) {
    const key = resolveMove(rawMove);
    if (key) {
      learnset.push(key);
    } else {
      // Track unmatched
      unmatchedMoves.set(rawMove, (unmatchedMoves.get(rawMove) || 0) + 1);
    }
  }

  // Update the learnset
  await col.updateOne({ _id: poke._id }, { $set: { learnset } });
  updated++;

  if (updated <= 5 || updated % 50 === 0) {
    console.log(`  ↑ ${poke.name}: ${learnset.length}/${entry.moves.length} moves resolved`);
  }
}

console.log(`\n────── LEARNSET MIGRATION COMPLETE ──────`);
console.log(`  Pokémon updated:  ${updated}`);
console.log(`  Not found in DB:  ${notFoundCount}`);
console.log(`  Unmatched moves:  ${unmatchedMoves.size} unique`);

if (unmatchedMoves.size > 0) {
  console.log('\n⚠  Unmatched Spanish move names (not in champions_final_moves.json):');
  const sorted = [...unmatchedMoves.entries()].sort((a, b) => b[1] - a[1]);
  for (const [name, count] of sorted.slice(0, 30)) {
    console.log(`  ${count.toString().padStart(3)}x  "${name}"`);
  }
  if (sorted.length > 30) {
    console.log(`  ... and ${sorted.length - 30} more`);
  }
}

await mongoose.disconnect();
console.log('\n✅ Done');
