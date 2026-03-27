import { makeSlug } from "src/common/utils/slug.helper";
import { ProfessionsCreateDto } from "../dtos/create-professions.dto";
import { ProfessionsEntity } from "../entities/professions.entity";
import { LangEnum } from "src/common/enums";
import { ProfessionsResponseDto } from "../dtos/response-professions.dto";
import { ProfessionsUpdateDto } from "../dtos/update-professions.dto";

export class ManagerProfessionsMapper {
    public static toCreate(dto: ProfessionsCreateDto) {
        const entity = new ProfessionsEntity()
        entity.name = dto.name
        entity.desc = dto.desc
        entity.slug = makeSlug(entity.name)
        return entity
    }

    public static toUpdate(dto: ProfessionsUpdateDto, id: number) {
        const entity = new ProfessionsEntity({ id })
        if (dto.name) {
            entity.name = dto.name
            entity.slug = makeSlug(dto.name)
        }
        if (dto.desc) entity.desc = dto.desc
        return entity
    }

    public static toResponse(entity: ProfessionsEntity) {
        const dto = new ProfessionsResponseDto()
        dto.id = entity.id
        dto.name = entity.name
        dto.desc = entity.desc
        dto.slug = entity.slug
        return dto
    }

    public static toResponseSimple(entity: ProfessionsEntity, lang: LangEnum) {
        const dto = new ProfessionsResponseDto()
        dto.id = entity.id
        dto.name = entity.name
        dto.desc = entity.desc
        dto.slug = entity.slug
        return dto
    }
}