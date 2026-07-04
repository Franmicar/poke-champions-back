import mongoose from 'mongoose';
import Team from '../models/Team.js';

await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
const teams = await Team.find({}).limit(1).lean();
if (teams.length > 0) {
  const poke = (teams[0] as any).pokemon?.[0];
  console.log('Pokemon:', poke?.species);
  console.log('Moves:', JSON.stringify(poke?.moves));
  console.log('Nature:', poke?.nature);
}
await mongoose.disconnect();
