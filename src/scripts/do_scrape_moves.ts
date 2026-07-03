import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'node:https';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';

dotenv.config();

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
  if (!process.env.MONGO_URI) return;
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  
  const pokemons = await Pokemon.find({}, 'name').lean();
  console.log(`Found ${pokemons.length} Pokémon`);
  
  const allMovesMap = new Map();

  for (let i = 0; i < pokemons.length; i++) {
    const p = pokemons[i];
    console.log(`[${i+1}/${pokemons.length}] ${p.name}`);
    const learnset = await scrapePokemonMoves(p.name);
    if (learnset.length > 0) {
      await Pokemon.updateOne({ _id: p._id }, { $set: { learnset: learnset.map(m => m.name) } });
      for (const m of learnset) {
        allMovesMap.set(m.name, m);
      }
    }
    await delay(100);
  }

  console.log(`Unique moves: ${allMovesMap.size}`);
  const moveOps = Array.from(allMovesMap.values()).map(m => ({
    updateOne: {
      filter: { name: (m as any).name },
      update: { $set: m },
      upsert: true
    }
  }));

  if (moveOps.length > 0) {
    await Move.bulkWrite(moveOps);
    console.log('Moves saved.');
  }

  await mongoose.disconnect();
}

run().catch(console.error);
