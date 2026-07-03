import mongoose, { Schema, Document } from 'mongoose';

export interface INature extends Document {
  name: string;
  nameEn: string;
  increasedStat: string;
  decreasedStat: string;
}

const NatureSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  nameEn: { type: String, required: true },
  increasedStat: { type: String, default: '' },
  decreasedStat: { type: String, default: '' }
});

const Nature = mongoose.models.Nature || mongoose.model<INature>('Nature', NatureSchema);
export default Nature;
