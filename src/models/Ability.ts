import mongoose from 'mongoose';

const AbilitySchema = new mongoose.Schema({
  name: { type: String },
  key: { type: String, required: true, unique: true },
  description: String,
  shortDescription: String,
});

export default mongoose.model('Ability', AbilitySchema);
