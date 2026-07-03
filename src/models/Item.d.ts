import mongoose, { Document } from 'mongoose';
export interface IItem extends Document {
    name: string;
    description: string;
}
declare const _default: mongoose.Model<IItem, {}, {}, {}, mongoose.Document<unknown, {}, IItem, {}, mongoose.DefaultSchemaOptions> & IItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IItem>;
export default _default;
//# sourceMappingURL=Item.d.ts.map