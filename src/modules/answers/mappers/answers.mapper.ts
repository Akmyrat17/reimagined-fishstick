import { UsersEntity } from "src/modules/users/entities/user.entity";
import { AnswersCreateDto } from "../dtos/create-answers.dto";
import { AnswersEntity } from "../entites/answers.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { AnswersUpdateDto } from "../dtos/update-answers.dto";
import { AnswersResponseDto } from "../dtos/response-answers.dto";
import { QuestionsMapper } from "src/modules/questions/mappers/questions.mapper";
import { UsersMapper } from "src/modules/users/mappers/users.mapper";

export class AnswersMapper {
    public static toCreate(dto: AnswersCreateDto, userId:number) {
        const entity = new AnswersEntity()
        entity.answered_by = new UsersEntity({ id: userId })
        entity.answered_to = new QuestionsEntity({ id: dto.answered_to_id })
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
        dto.answered_by = UsersMapper.toResponseSimple(entity.answered_by)
        dto.answered_to = QuestionsMapper.toResponseSimple(entity.answered_to,null)
        dto.content = entity.content
        return dto
    }
}