import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  key: string;
  description: string;
  sprite?: string;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  description: { type: String },
  sprite: { type: String }
});

export default mongoose.model<IItem>('Item', ItemSchema);
