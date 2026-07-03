import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import https from 'node:https';
dotenv.config();
import Pokemon from '../models/Pokemon.js';
import Item from '../models/Item.js';
const POKEMON_LIST_URL = 'https://www.wikidex.net/wiki/Lista_de_Pok%C3%A9mon_de_Pok%C3%A9mon_Champions';
const ITEMS_LIST_URL = 'https://www.wikidex.net/wiki/Lista_de_objetos_de_Pok%C3%A9mon_Champions';
async function scrapePokemon() {
    try {
        const { data } = await axios.get(POKEMON_LIST_URL, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        const $ = cheerio.load(data);
        const pokemonList = [];
        $('.tabpokemon tbody tr').each((i, el) => {
            const cells = $(el).find('td');
            if (cells.length >= 5) {
                const name = $(cells[2]).text().trim();
                const type1 = $(cells[3]).find('img').attr('alt')?.replace('Tipo ', '').trim();
                const type2 = $(cells[4]).find('img').attr('alt')?.replace('Tipo ', '').trim();
                if (name && name !== 'Nombre') {
                    const types = [type1];
                    if (type2)
                        types.push(type2);
                    pokemonList.push({
                        name,
                        types: types.filter(t => t)
                    });
                }
            }
        });
        console.log(`Found ${pokemonList.length} Pokémon. Saving...`);
        for (const p of pokemonList) {
            await Pokemon.findOneAndUpdate({ name: p.name }, p, { upsert: true });
        }
        return pokemonList;
    }
    catch (error) {
        console.error('Error scraping Pokémon:', error);
        return [];
    }
}
async function scrapeObjects() {
    try {
        const { data } = await axios.get(ITEMS_LIST_URL, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        const $ = cheerio.load(data);
        const itemList = [];
        $('.tabpokemon tbody tr').each((i, el) => {
            const cells = $(el).find('td');
            if (cells.length >= 3) {
                const name = $(cells[1]).text().trim();
                const description = $(cells[2]).text().trim();
                if (name && name !== 'Nombre') {
                    itemList.push({ name, description });
                }
            }
        });
        console.log(`Found ${itemList.length} Items. Saving...`);
        for (const item of itemList) {
            await Item.findOneAndUpdate({ name: item.name }, item, { upsert: true });
        }
        return itemList;
    }
    catch (error) {
        console.error('Error scraping Items:', error);
        return [];
    }
}
async function run() {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI not found in .env');
        return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await scrapePokemon();
    await scrapeObjects();
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}
run();
//# sourceMappingURL=scrape.js.map