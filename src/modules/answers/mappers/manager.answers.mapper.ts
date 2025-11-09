import { UsersEntity } from "src/modules/users/entities/user.entity";
import { AnswersCreateDto } from "../dtos/create-answers.dto";
import { AnswersEntity } from "../entites/answers.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { AnswersUpdateDto } from "../dtos/update-answers.dto";
import { AnswersResponseDto } from "../dtos/response-answers.dto";
import { QuestionsMapper } from "src/modules/questions/mappers/questions.mapper";
import { UsersMapper } from "src/modules/users/mappers/users.mapper";

export class ManagerAnswersMapper {
    public static toCreate(dto: AnswersCreateDto) {
        const entity = new AnswersEntity()
        entity.answered_by = new UsersEntity({ id: dto.answered_by_id })
        entity.answered_to = new QuestionsEntity({ id: dto.answered_to_id })
        entity.content = dto.content
        entity.check_status = dto.check_status
        return entity
    }
    public static toUpdate(dto: AnswersUpdateDto, id: number) {
        const entity = new AnswersEntity({ id })
        if (dto.answered_by_id) entity.answered_by = new UsersEntity({ id: dto.answered_by_id })
        if (dto.answered_to_id) entity.answered_to = new QuestionsEntity({ id: dto.answered_to_id })
        // if (dto.content) entity.content = dto.content
        if (dto.check_status) entity.check_status = dto.check_status
        return entity
    }

    public static toResponseSimple(entity: AnswersEntity) {
        const dto = new AnswersResponseDto()
        dto.id = entity.id
        dto.answered_by = UsersMapper.toResponseSimple(entity.answered_by)
        dto.answered_to = QuestionsMapper.toResponseSimple(entity.answered_to)
        dto.content = entity.content
        dto.check_status = entity.check_status
        dto.file_path = entity.file_path
        return dto
    }

    public static toResponseDetail(entity: AnswersEntity) {
        const dto = new AnswersResponseDto()
        dto.id = entity.id
        dto.answered_by = UsersMapper.toResponseSimple(entity.answered_by)
        dto.answered_to = QuestionsMapper.toResponseSimple(entity.answered_to)
        dto.content = entity.content
        dto.check_status = entity.check_status
        dto.file_path = entity.file_path
        return dto
    }
}