import { Dex } from '@pkmn/dex';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PokemonSchema = new mongoose.Schema({
  name: String,
  baseStats: {
    hp: Number,
    atk: Number,
    def: Number,
    spa: Number,
    spd: Number,
    spe: Number
  },
  abilities: [String]
}, { strict: false });

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

async function run() {
  await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
  console.log('Connected to MongoDB');

  const pokemons = await Pokemon.find();
  console.log(`Updating ${pokemons.length} Pokemon...`);

  for (const p of pokemons) {
    // Normalization logic
    let searchName = p.name;
    
    // Handle specific manual overrides for Champions names
    const overrides: Record<string, string> = {
      'Pyroar(Macho)': 'Pyroar',
      'Pyroar(Hembra)': 'Pyroar',
      'Meowstic(Macho)': 'Meowstic',
      'Meowstic(Hembra)': 'Meowstic',
      'Basculegion(Macho)': 'Basculegion',
      'Basculegion(Hembra)': 'Basculegion-F',
      'Floette(Flor Eterna)': 'Floette-Eternal',
      'Mega-Charizard X': 'Charizard-Mega-X',
      'Mega-Charizard Y': 'Charizard-Mega-Y',
      'Mega-Mewtwo X': 'Mewtwo-Mega-X',
      'Mega-Mewtwo Y': 'Mewtwo-Mega-Y',
      'Mega-Raichu X': 'Raichu-Mega', // Assuming standard Mega if X/Y don't exist
      'Mega-Raichu Y': 'Raichu-Mega',
      'Castform(Forma sol)': 'Castform-Sunny',
      'Rotom(Rotom Calor)': 'Rotom-Heat',
      'Vivillon(Motivo polar)': 'Vivillon-Polar',
      'Florges(Flor amarilla)': 'Florges-Yellow',
      'Aegislash(Forma filo)': 'Aegislash-Blade',
      'Lycanroc(Forma Nocturna)': 'Lycanroc-Midnight',
      'Palafin(Forma Heroica)': 'Palafin-Hero',
      'Maushold(Familia de Tres)': 'Maushold-Three',
      'Morpeko(Forma Voraz)': 'Morpeko-Hangry',
      'Gourgeist(Variante pequeña)': 'Gourgeist-Small',
      'Alcremie(Crema Rosa)': 'Alcremie',
      'Furfrou(Corte corazón)': 'Furfrou'
    };

    if (overrides[p.name]) {
      searchName = overrides[p.name]!;
    } else {
      if (searchName.includes(' de Alola')) searchName = searchName.replace(' de Alola', '-Alola');
      if (searchName.includes(' de Hisui')) searchName = searchName.replace(' de Hisui', '-Hisui');
      if (searchName.includes(' de Galar')) searchName = searchName.replace(' de Galar', '-Galar');
      if (searchName.includes(' de Paldea')) searchName = searchName.replace(' de Paldea', '-Paldea');
      
      if (searchName.startsWith('Mega-')) {
          searchName = searchName.replace('Mega-', '') + '-Mega';
      }
      
      // Clean parentheses if any remain
      searchName = searchName.replace(/\(.*\)/, '').trim();
      searchName = searchName.replace(/ /g, '-');
    }

    const data = Dex.forGen(9).species.get(searchName);
    if (data && data.exists) {
      const baseStats = {
        hp: data.baseStats.hp,
        atk: data.baseStats.atk,
        def: data.baseStats.def,
        spa: data.baseStats.spa,
        spd: data.baseStats.spd,
        spe: data.baseStats.spe
      };
      const abilities = Object.values(data.abilities).filter(a => a);
      
      // Calculate Showdown Sprite URLs
      const showdownId = data.id;
      const sprite3d = `https://play.pokemonshowdown.com/sprites/ani/${showdownId}.gif`;
      const spriteIcon = `https://play.pokemonshowdown.com/sprites/dex/${showdownId}.png`;

      await Pokemon.updateOne(
        { _id: p._id }, 
        { $set: { baseStats, abilities, sprite3d, spriteIcon } }
      );
      console.log(`Updated: ${p.name} (as ${searchName}, ID: ${showdownId})`);
    } else {
      console.log(`Not found in Dex: ${p.name} (searched as ${searchName})`);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run();
