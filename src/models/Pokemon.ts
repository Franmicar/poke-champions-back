import mongoose, { Schema, Document } from 'mongoose';

export interface IPokemon extends Document {
  id: number;
  name: string;
  key: string;
  types: string[];
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  abilities: string[];
  learnset: string[];
  sprite3d?: string;
  spriteIcon?: string;
}

const PokemonSchema: Schema = new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  types: [{ type: String }],
  baseStats: {
    hp: { type: Number, default: 0 },
    atk: { type: Number, default: 0 },
    def: { type: Number, default: 0 },
    spa: { type: Number, default: 0 },
    spd: { type: Number, default: 0 },
    spe: { type: Number, default: 0 }
  },
  abilities: [{ type: String }],
  learnset: [{ type: String }],
  sprite3d: { type: String },
  spriteIcon: { type: String }
});

const Pokemon = mongoose.models.Pokemon || mongoose.model<IPokemon>('Pokemon', PokemonSchema);
export default Pokemon;
