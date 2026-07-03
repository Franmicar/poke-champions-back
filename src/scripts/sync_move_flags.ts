import { Dex } from '@pkmn/dex';
import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const MoveSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  flags: Object,
  priority: Number
}, { strict: false });

const Move = mongoose.model('Move', MoveSchema);

async function run() {
  await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
  console.log('Connected to MongoDB');

  // Load translations
  const moveNamesCsv = fs.readFileSync('move_names.csv', 'utf8').split('\n');
  const movesPokeapiCsv = fs.readFileSync('moves_pokeapi.csv', 'utf8').split('\n');

  const idToEnglish: Record<string, string> = {};
  for (const line of movesPokeapiCsv) {
    const parts = line.split(',');
    if (parts[0] && parts[1]) {
      idToEnglish[parts[0]] = parts[1].replace(/-/g, ' '); // identifier
    }
  }

  const spanishToEnglish: Record<string, string> = {};
  for (const line of moveNamesCsv) {
    const parts = line.split(',');
    if (parts[1] === '7') { // Spanish
      const moveId = parts[0];
      const spanishName = parts[2]!.trim();
      if (idToEnglish[moveId!]) {
        spanishToEnglish[spanishName.toLowerCase()] = idToEnglish[moveId!]!.toLowerCase();
      }
    }
  }

  // Manual overrides or fixes
  spanishToEnglish['ataque rápido'] = 'quick attack';
  spanishToEnglish['furia dragón'] = 'dragon rage';
  spanishToEnglish['terremoto'] = 'earthquake';
  spanishToEnglish['protección'] = 'protect';
  spanishToEnglish['danza espada'] = 'swords dance';

  const moves = await Move.find();
  console.log(`Syncing ${moves.length} moves...`);

  const dex = Dex.forGen(9);
  let count = 0;

  for (const m of moves) {
    const spanishName = m.name.toLowerCase();
    const englishName = spanishToEnglish[spanishName] || m.name; // Fallback to current name
    
    const data = dex.moves.get(englishName);
    if (data && data.exists) {
      await Move.updateOne({ _id: m._id }, {
        $set: {
          priority: data.priority || 0,
          flags: {
            contact: !!data.flags.contact,
            sound: !!data.flags.sound,
            punch: !!data.flags.punch,
            bite: !!data.flags.bite,
            pulse: !!data.flags.pulse,
            bullet: !!data.flags.bullet,
            wind: !!data.flags.wind,
            slicing: !!data.flags.slicing,
            dance: !!data.flags.dance,
            powder: !!data.flags.powder,
            explosive: !!data.flags.explosive || m.name === 'Explosión' || m.name === 'Autodestrucción' || m.name === 'Misty Explosion',
            secondary: !!data.secondaries || !!data.secondary
          }
        }
      });
      count++;
    } else {
        console.log(`Not found in Dex: ${m.name} (searched as ${englishName})`);
    }
  }

  console.log(`Synced: ${count} moves.`);
  await mongoose.disconnect();
  console.log('Done.');
}

run();
