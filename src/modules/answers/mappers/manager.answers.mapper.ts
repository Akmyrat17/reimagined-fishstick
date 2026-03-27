import { UsersEntity } from "src/modules/users/entities/users.entity";
import { AnswersCreateDto } from "../dtos/create-answers.dto";
import { AnswersEntity } from "../entities/answers.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { AnswersUpdateDto } from "../dtos/update-answers.dto";
import { AnswersResponseDto } from "../dtos/response-answers.dto";
import { QuestionsMapper } from "src/modules/questions/mappers/questions.mapper";
import { UsersMapper } from "src/modules/users/mappers/users.mapper";
import { CheckStatusEnum, RolesEnum } from "src/common/enums";

export class ManagerAnswersMapper {
    public static toCreate(dto: AnswersCreateDto, user: UsersEntity) {
        const entity = new AnswersEntity()
        entity.answered_by = new UsersEntity({ id: user.id })
        entity.question = new QuestionsEntity({ id: dto.question_id })
        entity.content = dto.content
        if (user.role !== RolesEnum.USER) entity.check_status = CheckStatusEnum.APPROVED
        return entity
    }

    public static toUpdate(dto: AnswersUpdateDto, id: number) {
        const entity = new AnswersEntity({ id })
        if (dto.check_status) entity.check_status = dto.check_status
        // if (dto.delete === true) entity.deleted_at = new Date()
        // if (dto.delete === false) entity.deleted_at = null
        if (dto.reported_reason) entity.reported_reason = dto.reported_reason
        return entity
    }

    public static toResponseSimple(entity: AnswersEntity) {
        const dto = new AnswersResponseDto()
        dto.id = entity.id
        dto.answered_by = UsersMapper.toResponseSimple(entity.answered_by)
        dto.question = QuestionsMapper.toResponseSimple(entity.question, null)
        dto.content = entity.content
        dto.check_status = entity.check_status
        dto.reported_reason = entity.reported_reason
        dto.deleted_at = entity.deleted_at
        return dto
    }

    public static toResponseDetail(entity: AnswersEntity) {
        const dto = new AnswersResponseDto()
        dto.id = entity.id
        dto.answered_by = UsersMapper.toResponseSimple(entity.answered_by)
        dto.question = QuestionsMapper.toResponseSimple(entity.question, null)
        dto.content = entity.content
        dto.reported_reason = entity.reported_reason
        dto.check_status = entity.check_status
        return dto
    }
}