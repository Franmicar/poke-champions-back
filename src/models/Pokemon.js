import mongoose, { Schema, Document } from 'mongoose';
const PokemonSchema = new Schema({
    name: { type: String, required: true, unique: true },
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
    learnset: [{ type: String }]
});
export default mongoose.model('Pokemon', PokemonSchema);
//# sourceMappingURL=Pokemon.js.map