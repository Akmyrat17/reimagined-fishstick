import { UsersEntity } from "src/modules/users/entities/user.entity";
import { QuestionsCreateDto } from "../dtos/create-questions.dto";
import { QuestionsEntity } from "../entities/questions.entity";
import { QuestionsUpdateDto } from "../dtos/update-questions.dto";
import { QuestionsResponseDto } from "../dtos/response-questions.dto";

export class ManagerQuestionsMapper {
    public static toCreate(dto: QuestionsCreateDto,slug:string,filePath:string) :QuestionsEntity{
        const entity = new QuestionsEntity()
        entity.content=dto.content
        entity.title = dto.title
        entity.slug = slug
        entity.file_path = filePath
        entity.check_status = dto.check_status
        entity.asked_by = new UsersEntity({id:dto.asked_by_id})
        if(dto.priority) entity.priority  = dto.priority
        return entity
    }

    public static toUpdate(dto:QuestionsUpdateDto,id:number, filePath?:string,slug?:string) {
        const entity = new QuestionsEntity({id})
        if(dto.content) entity.content=dto.content
        if(dto.title) {
            entity.title = dto.title
            entity.slug = slug
        }
        if(dto.check_status) entity.check_status = dto.check_status
        if(filePath) entity.file_path = filePath
        if(dto.asked_by_id) entity.asked_by = new UsersEntity({id:dto.asked_by_id})
        if(dto.priority) entity.priority  = dto.priority
        return entity
    }

    public static toResponseSimple(entity:QuestionsEntity) {
        const dto = new QuestionsResponseDto
        dto.file_path = entity.file_path
        dto.priority = entity.priority
        dto.slug = entity.slug
        dto.check_status = entity.check_status
        dto.title = entity.title
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
        return dto
    }
}