import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
export declare abstract class BaseRepository<T extends Document> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    create(data: Partial<T>): Promise<T>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    find(filter: FilterQuery<T>): Promise<T[]>;
    update(id: string, data: UpdateQuery<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
}
//# sourceMappingURL=BaseRepository.d.ts.map