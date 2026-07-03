import mongoose from 'mongoose';

const PokemonSchema = new mongoose.Schema({
  name: String,
  baseStats: Object
}, { strict: false });

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

async function run() {
  await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
  
  await Pokemon.updateOne({ name: 'Mega-Raichu X' }, { 
    $set: { 
      baseStats: { hp: 60, atk: 135, def: 95, spa: 90, spd: 95, spe: 110 } 
    } 
  });
  
  await Pokemon.updateOne({ name: 'Mega-Raichu Y' }, { 
    $set: { 
      baseStats: { hp: 60, atk: 100, def: 55, spa: 160, spd: 80, spe: 130 } 
    } 
  });

  console.log('Updated Mega-Raichu X and Y base stats.');
  await mongoose.disconnect();
}

run();
