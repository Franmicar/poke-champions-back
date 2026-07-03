import { BaseRepository } from './BaseRepository';
export declare class UserRepository extends BaseRepository<any> {
    constructor();
    findByEmail(email: string): Promise<any>;
    findByUsername(username: string): Promise<any>;
}
//# sourceMappingURL=UserRepository.d.ts.map