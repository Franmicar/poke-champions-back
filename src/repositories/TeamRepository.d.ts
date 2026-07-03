import { BaseRepository } from './BaseRepository';
export declare class TeamRepository extends BaseRepository<any> {
    constructor();
    findPublicTeams(filters: any): Promise<any>;
    findByUserId(userId: string): Promise<any>;
}
//# sourceMappingURL=TeamRepository.d.ts.map