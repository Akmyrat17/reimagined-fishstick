import { UsersEntity } from "src/modules/users/entities/user.entity";
import { AnswersCreateDto } from "../dtos/create-answers.dto";
import { AnswersEntity } from "../entites/answers.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { AnswersUpdateDto } from "../dtos/update-answers.dto";
import { AnswersResponseDto } from "../dtos/response-answers.dto";
import { QuestionsMapper } from "src/modules/questions/mappers/questions.mapper";

export class AnswersMapper {
    public static toCreate(dto: AnswersCreateDto, filePath: string,userId:number) {
        const entity = new AnswersEntity()
        entity.answered_by = new UsersEntity({ id: userId })
        entity.answered_to = new QuestionsEntity({ id: dto.answered_to_id })
        entity.content = dto.content
        entity.file_path = filePath
        entity.is_approved = dto.is_approved
        return entity
    }
    public static toUpdate(dto: AnswersUpdateDto, id: number, filePath: string) {
        const entity = new AnswersEntity({ id })
        if (dto.content) entity.content = dto.content
        if (filePath) entity.file_path = filePath
        return entity
    }

    public static toResponseSimple(entity: AnswersEntity) {
        const dto = new AnswersResponseDto()
        dto.id = entity.id
        dto.answered_by = entity.answered_by
        dto.answered_to = QuestionsMapper.toResponseSimple(entity.answered_to)
        dto.content = entity.content
        dto.file_path = entity.file_path
        return dto
    }

    public static toResponseDetail(entity: AnswersEntity) {
        const dto = new AnswersResponseDto()
        dto.id = entity.id
        dto.answered_by = entity.answered_by
        dto.answered_to = QuestionsMapper.toResponseDetail(entity.answered_to)
        dto.content = entity.content
        dto.file_path = entity.file_path
        return dto
    }
}