import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'node:https';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';
dotenv.config();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function scrapePokemonMoves(pokemonName) {
    const url = `https://www.wikidex.net/wiki/${encodeURIComponent(pokemonName)}`;
    try {
        const { data } = await axios.get(url, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            timeout: 15000
        });
        const $ = cheerio.load(data);
        const h3 = $('h3').filter((i, el) => $(el).text().includes('Pokémon Champions'));
        if (h3.length === 0)
            return [];
        const table = h3.nextAll('table.movnivel').first();
        const moves = [];
        table.find('tbody tr').each((i, el) => {
            const cells = $(el).find('td');
            if (cells.length >= 3) {
                let moveName = $(cells[0]).find('.regional-lang-switch span[lang="es-ES"]').text().trim();
                if (!moveName)
                    moveName = $(cells[0]).text().trim();
                const moveType = $(cells[1]).find('img').attr('alt')?.replace('Tipo ', '').trim();
                const moveCategory = $(cells[2]).find('img').attr('alt')?.replace('Clase ', '').trim();
                if (moveName && moveType && moveCategory) {
                    moves.push({ name: moveName, type: moveType, category: moveCategory });
                }
            }
        });
        return moves;
    }
    catch (error) {
        console.error(`Error scraping ${pokemonName}:`, error.message);
        return [];
    }
}
async function test() {
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
    }
    try {
        const pokemons = await Pokemon.find({}, 'name').lean();
        console.log(`Found ${pokemons.length} Pokémon`);
        const allMovesMap = new Map();
        for (let i = 0; i < pokemons.length; i++) {
            const p = pokemons[i];
            console.log(`[${i + 1}/${pokemons.length}] Fetching ${p.name}...`);
            const learnset = await scrapePokemonMoves(p.name);
            if (learnset.length > 0) {
                await Pokemon.updateOne({ name: p.name }, { $set: { learnset: learnset.map(m => m.name) } });
                for (const m of learnset) {
                    allMovesMap.set(m.name, m);
                }
                console.log(`${learnset.length} moves.`);
            }
            else {
                console.log(`No moves.`);
            }
            await delay(100);
        }
        console.log(`Unique moves: ${allMovesMap.size}`);
        const moveOps = Array.from(allMovesMap.values()).map(m => ({
            updateOne: {
                filter: { name: m.name },
                update: { $set: m },
                upsert: true
            }
        }));
        if (moveOps.length > 0) {
            await Move.bulkWrite(moveOps);
            console.log('Moves saved.');
        }
    }
    catch (err) {
        console.error("Error in loop:", err.message);
    }
    await mongoose.disconnect();
}
test().catch(err => {
    console.error("Fatal error:", err);
});
//# sourceMappingURL=test_scrape_moves.js.map