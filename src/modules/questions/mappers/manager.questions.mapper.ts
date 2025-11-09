import { UsersEntity } from "src/modules/users/entities/user.entity";
import { QuestionsCreateDto } from "../dtos/create-questions.dto";
import { QuestionsEntity } from "../entities/questions.entity";
import { QuestionsUpdateDto } from "../dtos/update-questions.dto";
import { QuestionsResponseDto } from "../dtos/response-questions.dto";
import { makeSlug } from "src/common/utils/slug.helper";

export class ManagerQuestionsMapper {
    public static toCreate(dto: QuestionsCreateDto,slug:string) :QuestionsEntity{
        const entity = new QuestionsEntity()
        entity.content=dto.content
        entity.title = dto.title
        entity.slug = slug
        entity.check_status = dto.check_status
        entity.asked_by = new UsersEntity({id:dto.asked_by_id})
        if(dto.priority) entity.priority  = dto.priority
        return entity
    }

    public static toUpdate(dto:QuestionsUpdateDto,id:number) {
        const entity = new QuestionsEntity({id})
        if(dto.title) {
            entity.title = dto.title
            entity.slug = makeSlug(dto.title)
        }
        if(dto.check_status) entity.check_status = dto.check_status
        if(dto.asked_by_id) entity.asked_by = new UsersEntity({id:dto.asked_by_id})
        if(dto.priority) entity.priority  = dto.priority
        if(dto.special) entity.special = dto.special
        return entity
    }

    public static toResponseSimple(entity:QuestionsEntity) {
        const dto = new QuestionsResponseDto
        dto.file_path = entity.file_path
        dto.priority = entity.priority
        dto.slug = entity.slug
        dto.check_status = entity.check_status
        dto.title = entity.title
        dto.special = entity.special
        dto.asked_by = entity.asked_by
        return dto
    }

    public static toResponseDetail(entity:QuestionsEntity) {
        const dto = new QuestionsResponseDto
        dto.file_path = entity.file_path
        dto.priority = entity.priority
        dto.slug = entity.slug
        dto.check_status = entity.check_status
        dto.title = entity.title
        dto.content= entity.content
        dto.asked_by = entity.asked_by
        dto.special = entity.special
        return dto
    }
}