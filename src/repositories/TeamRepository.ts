import { Team } from '../models/Team';
import { BaseRepository } from './BaseRepository';

export class TeamRepository extends BaseRepository<any> {
  constructor() {
    super(Team);
  }

  async findPublicTeams(filters: any) {
    return this.model.find({ isPublic: true, ...filters }).populate('userId', 'username').exec();
  }

  async findByUserId(userId: string) {
    return this.model.find({ userId }).exec();
  }
}
