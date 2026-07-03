import mongoose from 'mongoose';

const AbilitySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  shortDescription: String,
});

export default mongoose.model('Ability', AbilitySchema);
