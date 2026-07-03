import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'node:https';
import fs from 'node:fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PokemonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  types: [{ type: String }],
  baseStats: {
    hp: { type: Number, default: 0 },
    atk: { type: Number, default: 0 },
    def: { type: Number, default: 0 },
    spa: { type: Number, default: 0 },
    spd: { type: Number, default: 0 },
    spe: { type: Number, default: 0 }
  },
  abilities: [{ type: String }],
  learnset: [{ type: String }]
});
const Pokemon = mongoose.models.Pokemon || mongoose.model('Pokemon', PokemonSchema);

const MoveSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  power: { type: Number },
  accuracy: { type: Number },
  pp: { type: Number },
  description: { type: String }
});
const Move = mongoose.models.Move || mongoose.model('Move', MoveSchema);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapePokemonMoves(pokemonName) {
  // Normalize name for WikiDex URL
  let normalizedName = pokemonName.split('(')[0].trim();
  const url = `https://www.wikidex.net/wiki/${encodeURIComponent(normalizedName.replace(/ /g, '_'))}`;
  try {
    const { data } = await axios.get(url, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 10000
    });
    const $ = cheerio.load(data);
    const h3 = $('h3').filter((i, el) => $(el).text().includes('Pokémon Champions'));
    if (h3.length === 0) return [];
    const table = h3.nextAll('table.movnivel').first();
    const moves = [];
    table.find('tbody tr').each((i, el) => {
      const cells = $(el).find('td');
      if (cells.length >= 3) {
        let moveName = $(cells[0]).find('.regional-lang-switch span[lang="es-ES"]').text().trim();
        if (!moveName) moveName = $(cells[0]).text().trim();
        const moveType = $(cells[1]).find('img').attr('alt')?.replace('Tipo ', '').trim();
        const moveCategory = $(cells[2]).find('img').attr('alt')?.replace('Clase ', '').trim();
        if (moveName && moveType && moveCategory) {
          moves.push({ name: moveName, type: moveType, category: moveCategory });
        }
      }
    });
    return moves;
  } catch (error) {
    console.error(`Error scraping ${pokemonName}:`, error.message);
    return [];
  }
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not found');
    return;
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  
  const pokemons = await Pokemon.find({}, 'name').lean();
  const names = pokemons.map(p => p.name);
  console.log(`Found ${names.length} Pokemon`);
  
  const allMovesMap = new Map();
  const results = {};

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    
    // Check if already has learnset to avoid re-scraping if interrupted
    const existing = await Pokemon.findOne({ name }, 'learnset').lean();
    if (existing && existing.learnset && existing.learnset.length > 0) {
      console.log(`[${i+1}/${names.length}] Skipping ${name} (already has learnset)`);
      continue;
    }

    console.log(`[${i+1}/${names.length}] Scraping ${name}...`);
    const learnset = await scrapePokemonMoves(name);
    results[name] = learnset;
    if (learnset.length > 0) {
      // Update Pokemon
      await Pokemon.updateOne({ name }, { $set: { learnset: learnset.map(m => m.name) } });
      
      // Save unique moves to Move collection
      const moveOps = learnset.map(m => ({
        updateOne: {
          filter: { name: m.name },
          update: { $set: m },
          upsert: true
        }
      }));
      await Move.bulkWrite(moveOps);
      console.log(`  Added ${learnset.length} moves for ${name}`);
    }
    await delay(200); // Slightly more delay to be safe
  }

  fs.writeFileSync('moves_results.json', JSON.stringify(results, null, 2));
  console.log('Done.');
  await mongoose.disconnect();
}

run().catch(console.error);