import { UsersEntity } from "src/modules/users/entities/users.entity";
import { AnswersCreateDto } from "../dtos/create-answers.dto";
import { AnswersEntity } from "../entities/answers.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { AnswersUpdateDto } from "../dtos/update-answers.dto";
import { AnswersResponseDto } from "../dtos/response-answers.dto";
import { QuestionsMapper } from "src/modules/questions/mappers/questions.mapper";
import { UsersMapper } from "src/modules/users/mappers/users.mapper";

export class AnswersMapper {
    public static toCreate(dto: AnswersCreateDto, userId: number) {
        const entity = new AnswersEntity()
        entity.answered_by = new UsersEntity({ id: userId })
        entity.question = new QuestionsEntity({ id: dto.question_id })
        entity.content = dto.content
        return entity
    }

    public static toUpdate(dto: AnswersUpdateDto, id: number) {
        const entity = new AnswersEntity({ id })
        if (dto.content) entity.content = dto.content
        return entity
    }

    public static toResponseSimple(entity: AnswersEntity) {
        const dto = new AnswersResponseDto()
        dto.id = entity.id
        dto.answered_by = entity.answered_by ? UsersMapper.toResponseSimple(entity.answered_by) : null
        dto.question = entity.question ? QuestionsMapper.toResponseSimple(entity.question, null) : null
        dto.content = entity.content
        dto.check_status = entity.check_status
        dto.created_at = entity.created_at
        return dto
    }

    public static toResponseDetail(entity: AnswersEntity) {
        const dto = new AnswersResponseDto()
        dto.id = entity.id
        dto.answered_by = UsersMapper.toResponseSimple(entity.answered_by)
        dto.question = QuestionsMapper.toResponseSimple(entity.question, null)
        dto.content = entity.content
        return dto
    }

    public static toResponseRaw(entity: any) {
        const { total_votes, upvotes, downvotes } = entity.vote_stats
        const dto = new AnswersResponseDto()
        dto.id = entity.id
        dto.content = entity.content
        dto.created_at = entity.created_at
        dto.answered_by = UsersMapper.toResponseSimple(entity.answered_by)
        dto.total_votes_count = total_votes
        dto.upvotes_count = upvotes
        dto.downvotes_count = downvotes
        dto.current_user_vote = entity.user_vote
        return dto
    }
}