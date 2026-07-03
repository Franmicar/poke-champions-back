import { Team } from '../models/Team';
import { BaseRepository } from './BaseRepository';
export class TeamRepository extends BaseRepository {
    constructor() {
        super(Team);
    }
    async findPublicTeams(filters) {
        return this.model.find({ isPublic: true, ...filters }).populate('userId', 'username').exec();
    }
    async findByUserId(userId) {
        return this.model.find({ userId }).exec();
    }
}
//# sourceMappingURL=TeamRepository.js.map