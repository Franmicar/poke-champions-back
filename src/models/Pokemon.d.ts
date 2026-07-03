import mongoose, { Document } from 'mongoose';
export interface IPokemon extends Document {
    name: string;
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
}
declare const _default: mongoose.Model<IPokemon, {}, {}, {}, mongoose.Document<unknown, {}, IPokemon, {}, mongoose.DefaultSchemaOptions> & IPokemon & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPokemon>;
export default _default;
//# sourceMappingURL=Pokemon.d.ts.map