import { Dex } from '@pkmn/dex';
import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const AbilitySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  shortDescription: String,
}, { strict: false });

const Ability = mongoose.model('Ability', AbilitySchema);

const CUSTOM_ABILITIES = [
  {
    name: 'Dragonize',
    description: 'Turns all Normal-type moves used by the Pokémon into Dragon-type moves and boosts their power by 20%.',
    shortDescription: 'Normal moves become Dragon and 1.2x power.'
  },
  {
    name: 'Eelevate',
    description: 'Combines the effects of Levitate with a stat-boosting effect that raises the Pokémon\'s highest stat (excluding HP) by one stage each time it knocks out an opponent.',
    shortDescription: 'Levitate + Beast Boost effect.'
  },
  {
    name: 'Mega Sol',
    description: 'Causes all moves used by the Pokémon to behave as if the weather were harsh sunlight.',
    shortDescription: 'Simulates harsh sunlight for moves.'
  },
  {
    name: 'Piercing Drill',
    description: 'Allows contact moves to bypass the effects of Protect, dealing 1/4 of the move\'s original damage to the target.',
    shortDescription: 'Bypasses Protect with contact moves (25% damage).'
  },
  {
    name: 'Spicy Spray',
    description: 'Automatically burns the attacker whenever the Pokémon takes damage from a move.',
    shortDescription: 'Burns attacker when hit.'
  },
  {
    name: 'Fire Mane',
    description: 'Increases the power of the Pokémon\'s Fire-type moves by 50%.',
    shortDescription: '50% boost to Fire-type moves.'
  }
];

async function run() {
  await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
  console.log('Connected to MongoDB');

  const content = fs.readFileSync('calc_abilities.js', 'utf8');
  const abilityNames = content.match(/'([^']+)'/g)?.map(m => m.replace(/'/g, '')) || [];

  const dex = Dex.forGen(9);
  let count = 0;
  for (const name of abilityNames) {
    const ability = dex.abilities.get(name);
    if (ability && ability.exists) {
      await Ability.findOneAndUpdate(
        { name: ability.name },
        { 
          name: ability.name,
          description: ability.desc,
          shortDescription: ability.shortDesc
        },
        { upsert: true }
      );
      count++;
    }
  }
  console.log(`Populated ${count} abilities from calculator names.`);

  // Populate Custom
  for (const custom of CUSTOM_ABILITIES) {
    await Ability.findOneAndUpdate(
      { name: custom.name },
      custom,
      { upsert: true }
    );
    console.log(`Populated custom ability: ${custom.name}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run();
