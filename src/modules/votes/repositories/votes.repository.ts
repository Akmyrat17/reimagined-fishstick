import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { VotesEntity } from "../entities/votes.entity";

@Injectable()
export class VotesRepository extends Repository<VotesEntity> {
    constructor(private readonly datasource: DataSource) { super(VotesEntity, datasource.createEntityManager()) }

    async getLastHourVotes() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const result = await this.createQueryBuilder('votes')
            .select('SUM(CASE WHEN votes.vote = 1 THEN 1 ELSE 0 END)', 'upvotes')
            .addSelect('SUM(CASE WHEN votes.vote = 0 THEN 1 ELSE 0 END)', 'downvotes')
            .where('votes.created_at >= :oneHourAgo', { oneHourAgo })
            .getRawOne();

        return {
            upvotes: parseInt(result.upvotes) || 0,
            downvotes: parseInt(result.downvotes) || 0
        };
    }

    async removeByTypeIds(ids: number[], type: string) {
        return await this.query(`DELETE FROM votes WHERE target_id = ANY($1) AND type = $2`, [ids, type])
    }
}