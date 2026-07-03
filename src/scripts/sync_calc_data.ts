import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PokemonSchema = new mongoose.Schema({
  name: String,
  baseStats: Object,
  abilities: [String]
}, { strict: false });

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

async function run() {
  await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
  console.log('Connected to MongoDB');

  const content = fs.readFileSync('calc_species.js', 'utf8');

  // Regex to find all species definitions
  // Format: 'Name': { ... bs: { hp: X, at: X, ... }, abilities: { 0: 'X' }, ... }
  const speciesRegex = /'([^']+)':\s*\{[^}]*bs:\s*\{[^}]*hp:\s*(\d+),\s*at:\s*(\d+),\s*df:\s*(\d+),\s*sa:\s*(\d+),\s*sd:\s*(\d+),\s*sp:\s*(\d+)\s*\}[^}]*abilities:\s*\{\s*0:\s*'([^']+)'/g;

  let match;
  let count = 0;
  while ((match = speciesRegex.exec(content)) !== null) {
    const [_, name, hp, atk, def, spa, spd, spe, ability] = match;
    
    // Convert Showdown internal names back to our DB names if possible
    let dbName = name!.replace(/-/g, ' ');
    if (name!.endsWith('-Mega')) dbName = 'Mega-' + name!.replace('-Mega', '');
    if (name!.endsWith('-Mega-X')) dbName = 'Mega-' + name!.replace('-Mega-X', '') + ' X';
    if (name!.endsWith('-Mega-Y')) dbName = 'Mega-' + name!.replace('-Mega-Y', '') + ' Y';

    // Search for the pokemon in DB
    // We try multiple variants because our DB names might differ slightly (e.g. "Mega-Raichu X" vs "Mega-Raichu-X")
    const p = await Pokemon.findOne({ 
        $or: [
            { name: dbName },
            { name: name!.replace(/-/g, ' ') },
            { name: name }
        ]
    });

    if (p) {
      await Pokemon.updateOne({ _id: p._id }, { 
        $set: { 
          baseStats: { 
            hp: parseInt(hp!), 
            atk: parseInt(atk!), 
            def: parseInt(def!), 
            spa: parseInt(spa!), 
            spd: parseInt(spd!), 
            spe: parseInt(spe!) 
          },
          abilities: [ability!]
        } 
      });
      console.log(`Synced: ${p.name} (from ${name})`);
      count++;
    }
  }

  console.log(`Finished syncing ${count} species from calculator data.`);
  await mongoose.disconnect();
}

run();
