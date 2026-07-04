/**
 * Rellena power, accuracy y pp en los movimientos de la BD
 * usando el i18n en-US para obtener el nombre inglés y después
 * buscando ese movimiento en el Dex de @smogon/calc.
 *
 * Ejecutar:  npx tsx src/scripts/populate-move-stats.ts
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pkmn from '@pkmn/data';
import { Dex } from '@pkmn/dex';


import Move from '../models/Move.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const I18N_PATH = path.resolve(
  __dirname, '../../../frontend/public/assets/i18n/en-US/moves.json'
);

await mongoose.connect('mongodb://localhost:27017/pokemon_champions');

// Cargamos el mapa key → nombre inglés
const i18n: Record<string, string> = JSON.parse(fs.readFileSync(I18N_PATH, 'utf8'));

// Gen 9 de @pkmn/data (tiene accuracy y pp completos)
const gen9 = new pkmn.Generations(Dex).get(9);

const allMoves = await Move.find({}).lean();
console.log(`Movimientos en BD: ${allMoves.length}`);

let updated = 0, notFound = 0;

for (const dbMove of allMoves) {
  const key        = (dbMove as any).key as string;          // e.g. "move.gigaimpacto"
  const englishName = i18n[key];                              // e.g. "Hyper Beam"

  if (!englishName) {
    console.warn(`⚠️  Sin traducción EN para: ${key}`);
    notFound++;
    continue;
  }

  // El Dex usa IDs sin espacios ni caracteres especiales
  const dexId = englishName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');                              // "hyperbeam"

  const dexMove = gen9.moves.get(dexId);

  if (!dexMove) {
    const dexId2 = englishName.toLowerCase().replace(/['-\s]/g, '');
    const dexMove2 = gen9.moves.get(dexId2);
    if (!dexMove2) {
      console.warn(`❌ No encontrado en Dex: "${englishName}" (key: ${key})`);
      notFound++;
      continue;
    }

    await Move.updateOne(
      { key },
      { $set: {
        power:    (dexMove2 as any).basePower || null,
        accuracy: typeof (dexMove2 as any).accuracy === 'number' ? (dexMove2 as any).accuracy : null,
        pp:       (dexMove2 as any).pp || null,
      }}
    );
    console.log(`✅ ${key}  [${englishName}]  POW:${(dexMove2 as any).basePower}  ACC:${(dexMove2 as any).accuracy}  PP:${(dexMove2 as any).pp}`);
    updated++;
    continue;
  }

  await Move.updateOne(
    { key },
    { $set: {
      power:    dexMove.basePower || null,
      accuracy: typeof dexMove.accuracy === 'number' ? dexMove.accuracy : null,
      pp:       dexMove.pp || null,
    }}
  );
  console.log(`✅ ${key}  [${englishName}]  POW:${dexMove.basePower}  ACC:${dexMove.accuracy}  PP:${dexMove.pp}`);
  updated++;
}

console.log(`
✅ Actualizados: ${updated}  ❌ No encontrados: ${notFound}`);
await mongoose.disconnect();
