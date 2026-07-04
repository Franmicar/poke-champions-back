import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const PokemonSchema = new mongoose.Schema({
  name: String,
  learnset: [String]
}, { strict: false });

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokemon_champions');
    console.log('🚀 Conectado a MongoDB.');

    const pokemons = await Pokemon.find().lean();
    const allMoves = new Set();

    pokemons.forEach(p => {
      if (p.learnset && Array.isArray(p.learnset)) {
        p.learnset.forEach(moveKey => {
          allMoves.add(moveKey);
        });
      }
    });

    const uniqueMoves = Array.from(allMoves).sort();
    console.log(`✅ Se han encontrado ${uniqueMoves.length} movimientos únicos en los learnsets.`);
    
    fs.writeFileSync('champions_moves_list.json', JSON.stringify(uniqueMoves, null, 2));
    console.log('📄 Lista guardada en champions_moves_list.json');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
