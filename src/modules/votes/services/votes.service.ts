import { Injectable } from "@nestjs/common";
import { VotesRepository } from "../repositories/votes.repository";
import { VotesEntity } from "../entities/votes.entity";
import { UsersEntity } from "src/modules/users/entities/user.entity";
import { VotesToggleDto } from "../dtos/toggle-votes.dto";

@Injectable()
export class VotesService {
    constructor(private readonly votesRepository:VotesRepository) {    }

    async toggleVote(userId:number,dto:VotesToggleDto){
        const vote = await this.votesRepository.findOne({where:{user:{id:userId},target_id:dto.target_id,type:dto.type}})
        if(vote) {
            await this.votesRepository.delete({id:vote.id})
            if(vote.vote === dto.vote) return
        }
        const newCreated = new VotesEntity({user:new UsersEntity({id:userId}),target_id:dto.target_id,type:dto.type,vote:dto.vote})
        return await this.votesRepository.save(newCreated)
    }

    // async getVotes(userId:number,dto:)
}