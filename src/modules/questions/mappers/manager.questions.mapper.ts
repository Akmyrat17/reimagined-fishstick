import { UsersEntity } from "src/modules/users/entities/users.entity";
import { QuestionsCreateDto } from "../dtos/create-questions.dto";
import { QuestionsEntity } from "../entities/questions.entity";
import { QuestionsUpdateDto } from "../dtos/update-questions.dto";
import { QuestionsResponseDto } from "../dtos/response-questions.dto";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";
import { ManagerUsersMapper } from "src/modules/users/mappers/manager.users.mapper";
import { LangEnum, RolesEnum } from "src/common/enums";
import { TagsMapper } from "src/modules/tags/mappers/tags.mapper";

export class ManagerQuestionsMapper {
    public static toCreate(dto: QuestionsCreateDto, userRole: RolesEnum): QuestionsEntity {
        const entity = new QuestionsEntity()
        entity.content = dto.content
        entity.title = dto.title
        entity.asked_by = new UsersEntity({ id: dto.asked_by_id })
        if (dto.priority) entity.priority = dto.priority
        if (userRole !== RolesEnum.USER) entity.check_status = CheckStatusEnum.APPROVED
        return entity
    }

    public static toUpdate(dto: QuestionsUpdateDto, question: QuestionsEntity) {
        const entity = new QuestionsEntity({ id: question.id })
        if (dto.check_status) {
            entity.check_status = dto.check_status
            if (dto.check_status === CheckStatusEnum.REPORTED) {
                entity.reported_reason = dto.reported_reason
            }
        }
        if (dto.priority) entity.priority = dto.priority
        if (dto.special !== undefined) {
            entity.special = dto.special // null clears it, date sets it
        }
        entity.title = dto.title ? dto.title : question.title
        entity.content = dto.content ? dto.content : question.content
        return entity
    }

    public static toResponseSimple(entity: QuestionsEntity, lang: LangEnum) {
        const dto = new QuestionsResponseDto
        dto.id = entity.id
        dto.created_at = entity.created_at
        dto.updated_at = entity.updated_at
        dto.priority = entity.priority
        dto.check_status = entity.check_status
        dto.title = entity.title
        dto.special = entity.special
        dto.tags = entity.tags && entity.tags.length > 0 ? entity.tags.map(tag => TagsMapper.toResponse(tag, lang)) : []
        dto.in_review = entity.in_review
        dto.address = entity.address
        if (entity.answers) dto.answers_count = entity.answers.length
        dto.asked_by = ManagerUsersMapper.toResponseList(entity.asked_by, lang)
        return dto
    }

    public static toResponseDetail(entity: QuestionsEntity, lang: LangEnum) {
        const dto = new QuestionsResponseDto
        dto.priority = entity.priority
        dto.check_status = entity.check_status
        dto.title = entity.title
        dto.created_at = entity.created_at
        dto.content = entity.content
        dto.asked_by = ManagerUsersMapper.toResponseList(entity.asked_by, lang)
        dto.special = entity.special
        return dto
    }
    public static toResponseRaw(entity: any, lang: LangEnum) {
        const dto = new QuestionsResponseDto()
        dto.id = entity.questions_id
        dto.priority = entity.questions_priority
        dto.content = entity.questions_content
        dto.special = entity.questions_special || entity.special || null
        dto.title = entity.questions_title
        dto.asked_by = ManagerUsersMapper.toResponseList(new UsersEntity({ id: entity.asked_by_id, fullname: entity.asked_by_fullname }), lang)
        dto.tags = entity.tags && entity.tags.length > 0 ? entity.tags.map(t => TagsMapper.toResponse(t, lang)) : []
        dto.seen = entity.seen
        dto.answers_count = entity.answers_count
        dto.total_votes_count = entity.total_votes_count
        dto.created_at = entity.questions_created_at
        dto.check_status = entity.questions_check_status
        dto.reported_reason = entity.questions_reported_reason
        dto.upvotes_count = entity.upvotes_count
        dto.downvotes_count = entity.downvotes_count
        dto.current_user_vote = entity.current_user_vote
        return dto
    }
}