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
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokemon_champions');
    console.log('🚀 Conectado a MongoDB.');

    const oldItems = JSON.parse(fs.readFileSync('old_items_backup.json', 'utf8'));
    console.log(`📦 Cargados ${oldItems.length} objetos del backup.`);

    // 1. Limpiar la colección
    console.log('🧹 Limpiando colección de items...');
    await Item.deleteMany({});

    // 2. Insertar los 148 objetos
    console.log('📥 Insertando registros oficiales...');
    await Item.insertMany(oldItems);

    const count = await Item.countDocuments();
    console.log(`✅ Base de datos actualizada: ${count} registros.`);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
