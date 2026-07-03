import mongoose, { Schema, Document } from 'mongoose';
const MoveSchema = new Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    power: { type: Number },
    accuracy: { type: Number },
    pp: { type: Number },
    description: { type: String }
});
export default mongoose.model('Move', MoveSchema);
//# sourceMappingURL=Move.js.map