import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
export class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        const entity = new this.model(data);
        return entity.save();
    }
    async findOne(filter) {
        return this.model.findOne(filter).exec();
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async find(filter) {
        return this.model.find(filter).exec();
    }
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        return this.model.findByIdAndDelete(id).exec();
    }
}
//# sourceMappingURL=BaseRepository.js.map