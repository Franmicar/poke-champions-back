import mongoose, { Document } from 'mongoose';
export interface IMove extends Document {
    name: string;
    type: string;
    category: string;
    power?: number;
    accuracy?: number;
    pp?: number;
    description?: string;
}
declare const _default: mongoose.Model<IMove, {}, {}, {}, mongoose.Document<unknown, {}, IMove, {}, mongoose.DefaultSchemaOptions> & IMove & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMove>;
export default _default;
//# sourceMappingURL=Move.d.ts.map