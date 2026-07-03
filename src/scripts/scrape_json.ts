import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'node:https';
import fs from 'node:fs';
import mongoose from 'mongoose';
import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapePokemonMoves(pokemonName: string) {
  const url = `https://www.wikidex.net/wiki/${encodeURIComponent(pokemonName)}`;
  try {
    const { data } = await axios.get(url, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 10000
    });
    const $ = cheerio.load(data);
    const h3 = $('h3').filter((i, el) => $(el).text().includes('Pokémon Champions'));
    if (h3.length === 0) return [];
    const table = h3.nextAll('table.movnivel').first();
    const moves: any[] = [];
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
  } catch (error: any) {
    console.error(`Error scraping ${pokemonName}:`, error.message);
    return [];
  }
}

async function run() {
  await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
  console.log('Connected to MongoDB');
  const pokemons = await Pokemon.find({}, 'name').lean();
  const names = pokemons.map(p => p.name);
  console.log(`Found ${names.length} Pokemon`);
  const allMovesMap = new Map();
  const results: any = {};

  for (const name of names) {
    console.log(`Scraping ${name}...`);
    const learnset = await scrapePokemonMoves(name);
    results[name] = learnset;
    if (learnset.length > 0) {
      await Pokemon.updateOne({ name }, { $set: { learnset: learnset.map(m => m.name) } });
      for (const m of learnset) {
        allMovesMap.set(m.name, m);
      }
    }
    await delay(100);
  }

  console.log(`Unique moves found: ${allMovesMap.size}. Saving to DB...`);
  const moveOps = Array.from(allMovesMap.values()).map(m => ({
    updateOne: {
      filter: { name: (m as any).name },
      update: { $set: m },
      upsert: true
    }
  }));

  if (moveOps.length > 0) {
    await Move.bulkWrite(moveOps);
  }

  fs.writeFileSync('moves_results.json', JSON.stringify(results, null, 2));
  console.log('Done.');
  await mongoose.disconnect();
}

run().catch(console.error);
