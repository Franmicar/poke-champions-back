import mongoose, { Schema, Document } from 'mongoose';

export interface IMove extends Document {
  name: string;          // Nombre en español (desde la BD)
  nameEn: string;        // Nombre en inglés (de Serebii)
  key: string;           // Slug inglés único, ej: "flamethrower"
  type: string;          // Tipo en inglés, ej: "fire"
  category: string;      // "physical" | "special" | "status"
  power?: number;        // Potencia fija (null si variable)
  powerMin?: number;     // Potencia mínima (movimientos de potencia variable)
  powerMax?: number;     // Potencia máxima (movimientos de potencia variable)
  accuracy?: number;     // Precisión (null = infalible)
  pp?: number;           // PP en Pokémon Champions
  minHits?: number;      // Hits mínimos (movimientos multi-golpe)
  maxHits?: number;      // Hits máximos (movimientos multi-golpe)
  description?: string;
  priority: number;
  available: boolean;    // false = Z-move, Max-move o deshabilitado en Champions
  moveClass: string;     // "normal" | "z-move" | "max-move" | "disabled"
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
  name:        { type: String, required: true },
  nameEn:      { type: String, default: '' },
  key:         { type: String, required: true, unique: true },
  type:        { type: String, required: true },
  category:    { type: String, required: true },
  power:       { type: Number, default: null },
  powerMin:    { type: Number, default: null },
  powerMax:    { type: Number, default: null },
  accuracy:    { type: Number, default: null },
  pp:          { type: Number, default: null },
  minHits:     { type: Number, default: null },
  maxHits:     { type: Number, default: null },
  description: { type: String, default: '' },
  priority:    { type: Number, default: 0 },
  available:   { type: Boolean, default: true },
  moveClass:   { type: String, default: 'normal', enum: ['normal', 'z-move', 'max-move', 'disabled'] },
  flags: {
    contact:   { type: Boolean, default: false },
    sound:     { type: Boolean, default: false },
    punch:     { type: Boolean, default: false },
    bite:      { type: Boolean, default: false },
    pulse:     { type: Boolean, default: false },
    bullet:    { type: Boolean, default: false },
    wind:      { type: Boolean, default: false },
    slicing:   { type: Boolean, default: false },
    dance:     { type: Boolean, default: false },
    powder:    { type: Boolean, default: false },
    explosive: { type: Boolean, default: false },
    secondary: { type: Boolean, default: false }
  }
});

export default mongoose.model<IMove>('Move', MoveSchema);
