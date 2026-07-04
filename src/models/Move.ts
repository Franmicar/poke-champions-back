import mongoose, { Schema, Document } from 'mongoose';

export interface IMove extends Document {
  name: string;
  key: string;
  type: string;
  category: string;
  power?: number;
  accuracy?: number;
  pp?: number;
  description?: string;
  priority: number;
  flags: {
    contact: boolean;
    sound: boolean;
    punch: boolean;
    bite: boolean;
    pulse: boolean;
    bullet: boolean;
    wind: boolean;
    slicing: boolean;
    dance: boolean;
    powder: boolean;
    explosive: boolean;
    secondary: boolean;
  };
}

const MoveSchema: Schema = new Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  power: { type: Number },
  accuracy: { type: Number },
  pp: { type: Number },
  description: { type: String },
  priority: { type: Number, default: 0 },
  flags: {
    contact: { type: Boolean, default: false },
    sound: { type: Boolean, default: false },
    punch: { type: Boolean, default: false },
    bite: { type: Boolean, default: false },
    pulse: { type: Boolean, default: false },
    bullet: { type: Boolean, default: false },
    wind: { type: Boolean, default: false },
    slicing: { type: Boolean, default: false },
    dance: { type: Boolean, default: false },
    powder: { type: Boolean, default: false },
    explosive: { type: Boolean, default: false },
    secondary: { type: Boolean, default: false }
  }
});

export default mongoose.model<IMove>('Move', MoveSchema);
