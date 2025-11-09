import { TagsEntity } from "../entities/tags.entity";
import { LangEnum } from "src/common/enums";
import { TagsResponseDto } from "../dtos/response-tags.dto";

export class TagsMapper {
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