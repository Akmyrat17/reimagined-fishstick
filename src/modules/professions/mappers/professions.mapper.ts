import { ProfessionsEntity } from "../entities/professions.entity";
import { LangEnum } from "src/common/enums";
import { ProfessionsResponseDto } from "../dtos/response-professions.dto";

export class ProfessionsMapper {
    public static toResponse(entity:ProfessionsEntity,lang:LangEnum) {
        const dto = new ProfessionsResponseDto()
        dto.id = entity.id
        dto.name = entity[`name_${lang}`]
        dto.desc = entity[`desc_${lang}`]
        dto.slug = entity.slug
        return dto
    }
}