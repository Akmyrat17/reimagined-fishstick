import { makeSlug } from "src/common/utils/slug.helper";
import { TagsCreateDto } from "../dtos/create-tags.dto";
import { TagsEntity } from "../entities/tags.entity";
import { LangEnum } from "src/common/enums";
import { TagsResponseDto } from "../dtos/response-tags.dto";

export class ManagerTagsMapper {
    public static toCreate(dto:TagsCreateDto) {
        const entity = new TagsEntity()
        entity.name_ru = dto.name_ru
        entity.name_en = dto.name_en
        entity.name_tk = dto.name_tk
        entity.desc_en = dto.desc_en
        entity.desc_en = dto.desc_en
        entity.desc_en = dto.desc_en
        return entity
    }

    public static toUpdate(dto:TagsCreateDto,id:number) {
        const entity = new TagsEntity({id})
        if(dto.name_en) {
            entity.name_en = dto.name_en
            entity.slug = makeSlug(dto.name_en)
        }
        if(dto.name_ru) entity.name_ru = dto.name_ru
        if(dto.name_tk) entity.name_tk = dto.name_tk
        if(dto.desc_ru) entity.desc_ru = dto.desc_ru
        if(dto.desc_en) entity.desc_en = dto.desc_en
        if(dto.desc_tk) entity.desc_tk = dto.desc_tk
        return entity
    }

    public static toResponse(entity:TagsEntity,lang:LangEnum) {
        const dto = new TagsResponseDto()
        dto.id = entity.id
        dto.name = entity[`name_${lang}`]
        dto.desc = entity[`desc_${lang}`]
        dto.slug = entity.slug
        dto.total_used_in_questions = entity.questions.length
        return dto
    }
}