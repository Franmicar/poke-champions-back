/**
 * migrate-moves.ts
 *
 * Migrates the Move collection in MongoDB using champions_final_moves.json:
 *  - Updates existing moves: new English key, type, category, Champions PP, flags
 *  - Adds new fields: nameEn, powerMin, powerMax, minHits, maxHits, available, moveClass
 *  - Inserts moves missing from DB
 *  - Marks moves NOT in Champions list as available: false
 *
 * Run: npx tsx src/scripts/migrate-moves.ts
 */

import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');

const MONGO_URI = 'mongodb://localhost:27017/pokemon_champions';

// ── Load data ────────────────────────────────────────────────────────────────

const champMoves: any[] = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'champions_final_moves.json'), 'utf-8')
);

// Load current i18n to find all existing move i18n keys
const esI18n: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'public/assets/i18n/es-ES/moves.json'), 'utf-8')
);

// Build map: i18nKey → champMove
const byI18nKey: Record<string, any> = {};
champMoves.forEach(m => { byI18nKey[m.i18nKey] = m; });

// ── Connect ─────────────────────────────────────────────────────────────────

await mongoose.connect(MONGO_URI);
console.log('✅ Connected to MongoDB\n');

const db = mongoose.connection.db;
if (!db) throw new Error('No DB connection');
const col = db.collection('moves');

const dbMoves = await col.find({}).toArray();
console.log(`DB moves found: ${dbMoves.length}`);
console.log(`Champions moves (new): ${champMoves.length}\n`);

// ── Migration stats ──────────────────────────────────────────────────────────

let updated = 0, inserted = 0, disabled = 0, skipped = 0;

// ── Clean rebuild: drop and reinsert all moves ───────────────────────────────

console.log('⚠  Dropping existing moves collection and rebuilding from scratch...\n');
await col.deleteMany({});
console.log('  Existing moves deleted.\n');

const toInsert = champMoves.map(cm => ({
  key:       cm.key,
  nameEn:    cm.nameEn,
  name:      cm.nameEs,
  type:      cm.type,
  category:  cm.category,
  pp:        cm.pp,
  power:     cm.power,
  accuracy:  cm.accuracy,
  powerMin:  cm.powerMin,
  powerMax:  cm.powerMax,
  minHits:   cm.minHits,
  maxHits:   cm.maxHits,
  available: true,
  moveClass: cm.moveClass,
  priority:  0,
  flags:     cm.flags,
}));

const insertResult = await col.insertMany(toInsert, { ordered: true });
inserted = insertResult.insertedCount;

console.log(`✅ Inserted ${inserted} moves\n`);

// ── Disable moves NOT in Champions list ───────────────────────────────────────

const champI18nKeys = new Set(champMoves.map(m => m.i18nKey));
const champEnKeys   = new Set(champMoves.map(m => m.key));

// After update, the DB now has English keys for updated ones
// We need to find any remaining moves with OLD i18n keys that are NOT in Champions
const allMoves = await col.find({}).toArray();
const toDisable = allMoves.filter(d => {
  // Move has old-style key AND not in our champions list
  const isOldKey = d.key?.startsWith('move.');
  const isNewKey = champEnKeys.has(d.key);
  return isOldKey && !champI18nKeys.has(d.key);
});

if (toDisable.length > 0) {
  console.log(`\n⚠  Disabling ${toDisable.length} moves not in Champions:`);
  for (const d of toDisable) {
    console.log(`  ✗ Disabled: ${d.key} (${d.name})`);
    await col.updateOne({ _id: d._id }, { $set: { available: false, moveClass: 'disabled' } });
    disabled++;
  }
}

// ── Final stats ───────────────────────────────────────────────────────────────

const finalCount = await col.countDocuments();
const availableCount = await col.countDocuments({ available: true });

console.log('\n─────────────── MIGRATION COMPLETE ───────────────');
console.log(`  Updated:    ${updated}`);
console.log(`  Inserted:   ${inserted}`);
console.log(`  Disabled:   ${disabled}`);
console.log(`  Total in DB: ${finalCount} (${availableCount} available)`);

await mongoose.disconnect();
console.log('\n✅ Done');
