import { UsersEntity } from "src/modules/users/entities/users.entity";
import { QuestionsCreateDto } from "../dtos/create-questions.dto";
import { QuestionsEntity } from "../entities/questions.entity";
import { QuestionsUpdateDto } from "../dtos/update-questions.dto";
import { QuestionsResponseDto } from "../dtos/response-questions.dto";
import { UsersMapper } from "src/modules/users/mappers";
import { AnswersMapper } from "src/modules/answers/mappers/answers.mapper";
import { TagsEntity } from "src/modules/tags/entities/tags.entity";
import { TagsMapper } from "src/modules/tags/mappers/tags.mapper";
import { CheckStatusEnum, LangEnum, RolesEnum } from "src/common/enums";
import { AddressesEntity } from "src/modules/addresses/entities/addresses.entity";

export class QuestionsMapper {
    public static toCreate(dto: QuestionsCreateDto, userId: number): QuestionsEntity {
        const entity = new QuestionsEntity()
        entity.content = dto.content
        entity.title = dto.title
        entity.tags = dto.tag_ids && dto.tag_ids.length > 0 ? dto.tag_ids.map((id) => new TagsEntity({ id })) : null
        entity.asked_by = new UsersEntity({ id: userId })
        if (dto.address_id) entity.address = new AddressesEntity({ id: dto.address_id })
        if (dto.priority) entity.priority = dto.priority
        return entity
    }

    public static toUpdate(dto: QuestionsUpdateDto, id: number, userRole: RolesEnum) {
        const entity = new QuestionsEntity({ id })
        if (dto.content) entity.content = dto.content
        if (dto.title) entity.title = dto.title
        if (dto.address_id) entity.address = new AddressesEntity({ id: dto.address_id })
        if (dto.priority) entity.priority = dto.priority
        if (dto.tag_ids) entity.tags = dto.tag_ids.map(tag => new TagsEntity({ id: tag }))
        if (userRole !== RolesEnum.ADMIN) entity.check_status = CheckStatusEnum.NOT_CHECKED
        entity.special = null
        return entity
    }

    public static toResponseSimple(entity: QuestionsEntity, userId: number) {
        const dto = new QuestionsResponseDto
        dto.priority = entity.priority
        dto.id = entity.id
        dto.special = entity.special
        dto.title = entity.title
        dto.asked_by = entity.asked_by ? UsersMapper.toResponseSimple(entity.asked_by) : null
        dto.mine = entity.asked_by?.id === userId
        dto.created_at = entity.created_at
        return dto
    }

    public static toResponseRaw(entity: any, userId: number, lang: LangEnum) {
        const dto = new QuestionsResponseDto()
        dto.id = entity.questions_id
        dto.priority = entity.questions_priority
        dto.content = entity.questions_content
        dto.special = entity.questions_special || entity.special
        dto.title = entity.questions_title
        dto.asked_by = UsersMapper.toResponseSimple(new UsersEntity({ id: entity.asked_by_id, fullname: entity.asked_by_fullname }))
        dto.mine = entity.asked_by_id === userId
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

    public static toResponseDetail(entity: QuestionsEntity, lang: LangEnum) {
        const dto = new QuestionsResponseDto()
        dto.id = entity.id
        dto.priority = entity.priority
        dto.title = entity.title
        dto.special = entity.special
        dto.content = entity.content
        dto.tags = entity.tags && entity.tags.length > 0 ? entity.tags.map(tag => TagsMapper.toResponse(tag, lang)) : []
        dto.asked_by = entity.asked_by ? UsersMapper.toResponseSimple(entity.asked_by) : null
        return dto
    }

    public static responseRawGetOne(entity: any, userId: number, lang: LangEnum) {
        const dto = new QuestionsResponseDto()
        dto.id = entity.id
        dto.priority = entity.priority
        dto.special = entity.special
        dto.title = entity.title
        dto.check_status = entity.check_status
        dto.image_paths = entity.image_paths
        dto.content = entity.content
        dto.tags = entity.tags && entity.tags.length > 0 ? entity.tags.map(t => TagsMapper.toResponse(t, lang)) : []
        dto.asked_by = UsersMapper.toResponseSimple(entity.asked_by as UsersEntity)
        dto.seen = entity.seen_count
        dto.address = entity.address
        dto.upvotes_count = entity.upvotes_count
        dto.downvotes_count = entity.downvotes_count
        dto.current_user_vote = entity.current_user_vote
        dto.total_votes_count = entity.total_votes_count
        dto.created_at = entity.created_at
        // dto.answers = entity.answers && entity.answers.length > 0 ? entity.answers.map(e => AnswersMapper.toResponseRaw(e)) : []
        dto.current_user_answered = entity.current_user_answered ? true : false
            ? entity.answers.some(a => a.answered_by?.id === userId)
            : false
        return dto
    }
}