import { Dex } from '@pkmn/dex';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  sprite: { type: String }
});

const Item = mongoose.model('Item', ItemSchema);

async function run() {
  await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
  console.log('Connected to MongoDB');

  // Get all items from Gen 9 Dex
  const items = Array.from(Dex.forGen(9).items.all());
  console.log(`Processing ${items.length} items...`);

  let count = 0;
  for (const item of items) {
    if (!item.exists) continue;

    const itemId = item.id;
    const spriteUrl = `https://play.pokemonshowdown.com/sprites/itemicons/${itemId}.png`;

    await Item.findOneAndUpdate(
      { name: item.name },
      { 
        $set: { 
          name: item.name,
          description: item.desc || item.shortDesc,
          sprite: spriteUrl
        } 
      },
      { upsert: true, new: true }
    );
    
    if (count % 100 === 0) {
      console.log(`Processed ${count}/${items.length} items...`);
    }
    count++;
  }

  console.log(`Finished processing ${count} items.`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
