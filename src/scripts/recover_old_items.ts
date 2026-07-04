import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const ItemSchema = new mongoose.Schema({
  name: String,
  key: String,
  description: String,
  sprite: String
}, { strict: false });

const Item = mongoose.model('Item', ItemSchema);

async function run() {
  try {
    await mongoose.connect('mongodb://localhost:27017/pokemon_champions');
    console.log('Connected');
    
    // Buscar items antiguos (sin key o que tengan un formato distinto)
    const allItems = await Item.find().lean();
    console.log(`Total items: ${allItems.length}`);
    
    const oldItems = allItems.filter(i => !i.sprite);
    console.log('--- OLD ITEMS NAMES ---');
    console.log(JSON.stringify(oldItems.map(i => i.name), null, 2));
    
    // Also save the full objects to a JSON file for easy access
    fs.writeFileSync('old_items_backup.json', JSON.stringify(oldItems, null, 2));
    console.log('Backup saved to old_items_backup.json');
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
