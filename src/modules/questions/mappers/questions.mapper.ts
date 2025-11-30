import { UsersEntity } from "src/modules/users/entities/user.entity";
import { QuestionsCreateDto } from "../dtos/create-questions.dto";
import { QuestionsEntity } from "../entities/questions.entity";
import { QuestionsUpdateDto } from "../dtos/update-questions.dto";
import { QuestionsResponseDto } from "../dtos/response-questions.dto";
import { makeSlug } from "src/common/utils/slug.helper";

export class QuestionsMapper {
    public static toCreate(dto: QuestionsCreateDto,userId:number) :QuestionsEntity{
        const entity = new QuestionsEntity()
        entity.content=dto.content
        entity.title = dto.title
        entity.slug = makeSlug(dto.title)
        entity.asked_by = new UsersEntity({id:userId})
        if(dto.priority) entity.priority  = dto.priority
        return entity
    }

    public static toUpdate(dto:QuestionsUpdateDto,id:number) {
        const entity = new QuestionsEntity({id})
        if(dto.content) entity.content=dto.content
        if(dto.title) {
            entity.title = dto.title
            entity.slug = makeSlug(dto.title)
        }
        if(dto.priority) entity.priority  = dto.priority
        return entity
    }

    public static toResponseSimple(entity:QuestionsEntity,userId:number) {
        const dto = new QuestionsResponseDto
        dto.file_path = entity.file_path
        dto.priority = entity.priority
        dto.slug = entity.slug
        dto.special = entity.special
        dto.title = entity.title
        dto.asked_by = entity.asked_by
        dto.mine = entity.asked_by.id === userId
        return dto
    }

    public static toResponseRaw(entity:any,userId:number){
        const dto = new QuestionsResponseDto()
        dto.file_path = entity.questions_id
        dto.priority = entity.questions_priority
        dto.slug = entity.questions_slug
        dto.special = entity.questions_special
        dto.title = entity.questions_title
        dto.asked_by = new UsersEntity({id:entity.asked_by_id,fullname:entity.asked_by_fullname})
        dto.mine = entity.asked_by_id === userId
        dto.seen = entity.seen
        dto.answers_count = entity.answers_count
        dto.total_votes_count = entity.total_votes_count
        dto.created_at = entity.questions_created_at
        dto.upvotes_count = entity.upvotes_count
        dto.downvotes_count = entity.downvotes_count
        dto.current_user_vote = entity.current_user_vote
        return dto
    }

    public static toResponseDetail(entity:QuestionsEntity,userId:number) {
        const dto = new QuestionsResponseDto
        dto.file_path = entity.file_path
        dto.priority = entity.priority
        dto.slug = entity.slug
        dto.title = entity.title
        dto.special = entity.special
        dto.content= entity.content
        dto.asked_by = entity.asked_by
        return dto
    }
}