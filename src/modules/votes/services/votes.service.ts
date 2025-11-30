import { Injectable } from "@nestjs/common";
import { VotesRepository } from "../repositories/votes.repository";
import { VotesEntity } from "../entities/votes.entity";
import { UsersEntity } from "src/modules/users/entities/user.entity";
import { VotesToggleDto } from "../dtos/toggle-votes.dto";

@Injectable()
export class VotesService {
    constructor(private readonly votesRepository:VotesRepository) {    }
async toggleVote(userId: number, dto: VotesToggleDto) {
    return await this.votesRepository.manager.transaction(async (manager) => {
        const votesRepo = manager.getRepository(VotesEntity);
        
        const existingVote = await votesRepo.findOne({
            where: { 
                user: { id: userId }, 
                target_id: dto.target_id, 
                type: dto.type 
            }
        });
        
        if (existingVote) {
            // Toggle off: remove vote
            if (existingVote.vote === dto.vote) {
                await votesRepo.remove(existingVote);
                return { deleted: true };
            }
            
            // Change vote: update
            existingVote.vote = dto.vote;
            return await votesRepo.save(existingVote);
        }
        
        // Create new vote
        const newVote = votesRepo.create({
            user: { id: userId },
            target_id: dto.target_id,
            type: dto.type,
            vote: dto.vote
        });
        
        return await votesRepo.save(newVote);
    });
}

    // async getVotes(userId:number,dto:)
}