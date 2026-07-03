import { Schema, model } from 'mongoose';
const pokemonSetSchema = new Schema({
    species: { type: String, required: true },
    nickname: String,
    item: String,
    ability: String,
    level: { type: Number, default: 50 },
    shiny: { type: Boolean, default: false },
    nature: String,
    evs: {
        hp: { type: Number, default: 0, max: 32 },
        atk: { type: Number, default: 0, max: 32 },
        def: { type: Number, default: 0, max: 32 },
        spa: { type: Number, default: 0, max: 32 },
        spd: { type: Number, default: 0, max: 32 },
        spe: { type: Number, default: 0, max: 32 }
    },
    ivs: {
        hp: { type: Number, default: 31 },
        atk: { type: Number, default: 31 },
        def: { type: Number, default: 31 },
        spa: { type: Number, default: 31 },
        spd: { type: Number, default: 31 },
        spe: { type: Number, default: 31 }
    },
    moves: [String],
    teraType: String
});
const teamSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    format: { type: String, required: true },
    pokemon: [pokemonSetSchema],
    isPublic: { type: Boolean, default: false },
    stats: {
        votes: { type: Number, default: 0 },
        views: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});
export const Team = model('Team', teamSchema);
//# sourceMappingURL=Team.js.map