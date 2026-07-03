import mongoose, { Schema, Document } from 'mongoose';
const ItemSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});
export default mongoose.model('Item', ItemSchema);
//# sourceMappingURL=Item.js.map