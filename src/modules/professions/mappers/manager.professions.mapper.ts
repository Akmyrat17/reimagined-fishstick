import { makeSlug } from "src/common/utils/slug.helper";
import { ProfessionsCreateDto } from "../dtos/create-professions.dto";
import { ProfessionsEntity } from "../entities/professions.entity";
import { LangEnum } from "src/common/enums";
import { ProfessionsResponseDto } from "../dtos/response-professions.dto";

export class ManagerProfessionsMapper {
    public static toCreate(dto:ProfessionsCreateDto) {
        const entity = new ProfessionsEntity()
        entity.name_ru = dto.name_ru
        entity.name_en = dto.name_en
        entity.name_tk = dto.name_tk
        entity.desc_en = dto.desc_en
        entity.desc_en = dto.desc_en
        entity.desc_en = dto.desc_en
        return entity
    }

    public static toUpdate(dto:ProfessionsCreateDto,id:number) {
        const entity = new ProfessionsEntity({id})
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

    public static toResponse(entity:ProfessionsEntity,lang:LangEnum) {
        const dto = new ProfessionsResponseDto()
        dto.id = entity.id
        dto.name = entity[`name_${lang}`]
        dto.desc = entity[`desc_${lang}`]
        dto.slug = entity.slug
        return dto
    }
}