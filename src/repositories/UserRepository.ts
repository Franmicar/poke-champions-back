import { User } from '../models/User';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email }).exec();
  }

  async findByUsername(username: string) {
    return this.model.findOne({ username }).exec();
  }
}
