import { User } from '../models/User';
import { BaseRepository } from './BaseRepository';
export class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }
    async findByEmail(email) {
        return this.model.findOne({ email }).exec();
    }
    async findByUsername(username) {
        return this.model.findOne({ username }).exec();
    }
}
//# sourceMappingURL=UserRepository.js.map