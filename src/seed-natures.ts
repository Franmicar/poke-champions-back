import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Nature from './models/Nature.js';

dotenv.config();

const natures = [
  { name: 'Fuerte', nameEn: 'Hardy', increasedStat: '', decreasedStat: '' },
  { name: 'Huraña', nameEn: 'Lonely', increasedStat: 'atk', decreasedStat: 'def' },
  { name: 'Audaz', nameEn: 'Brave', increasedStat: 'atk', decreasedStat: 'spe' },
  { name: 'Firme', nameEn: 'Adamant', increasedStat: 'atk', decreasedStat: 'spa' },
  { name: 'Pícara', nameEn: 'Naughty', increasedStat: 'atk', decreasedStat: 'spd' },
  { name: 'Osada', nameEn: 'Bold', increasedStat: 'def', decreasedStat: 'atk' },
  { name: 'Dócil', nameEn: 'Docile', increasedStat: '', decreasedStat: '' },
  { name: 'Plácida', nameEn: 'Relaxed', increasedStat: 'def', decreasedStat: 'spe' },
  { name: 'Agitada', nameEn: 'Impish', increasedStat: 'def', decreasedStat: 'spa' },
  { name: 'Floja', nameEn: 'Lax', increasedStat: 'def', decreasedStat: 'spd' },
  { name: 'Miedosa', nameEn: 'Timid', increasedStat: 'spe', decreasedStat: 'atk' },
  { name: 'Activa', nameEn: 'Hasty', increasedStat: 'spe', decreasedStat: 'def' },
  { name: 'Seria', nameEn: 'Serious', increasedStat: '', decreasedStat: '' },
  { name: 'Alegre', nameEn: 'Jolly', increasedStat: 'spe', decreasedStat: 'spa' },
  { name: 'Ingenua', nameEn: 'Naive', increasedStat: 'spe', decreasedStat: 'spd' },
  { name: 'Modesta', nameEn: 'Modest', increasedStat: 'spa', decreasedStat: 'atk' },
  { name: 'Afable', nameEn: 'Mild', increasedStat: 'spa', decreasedStat: 'def' },
  { name: 'Mansa', nameEn: 'Quiet', increasedStat: 'spa', decreasedStat: 'spe' },
  { name: 'Tímida', nameEn: 'Bashful', increasedStat: '', decreasedStat: '' },
  { name: 'Alocada', nameEn: 'Rash', increasedStat: 'spa', decreasedStat: 'spd' },
  { name: 'Serena', nameEn: 'Calm', increasedStat: 'spd', decreasedStat: 'atk' },
  { name: 'Amable', nameEn: 'Gentle', increasedStat: 'spd', decreasedStat: 'def' },
  { name: 'Grosera', nameEn: 'Sassy', increasedStat: 'spd', decreasedStat: 'spe' },
  { name: 'Cauta', nameEn: 'Careful', increasedStat: 'spd', decreasedStat: 'spa' },
  { name: 'Rara', nameEn: 'Quirky', increasedStat: '', decreasedStat: '' }
];

const seedNatures = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pokemon_champions');
    console.log('Connected to MongoDB (pokemon_champions)');

    await Nature.deleteMany({});
    await Nature.insertMany(natures);

    console.log('Natures seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding natures:', error);
    process.exit(1);
  }
};

seedNatures();
