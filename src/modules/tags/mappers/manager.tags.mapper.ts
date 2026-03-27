import { makeSlug } from "src/common/utils/slug.helper";
import { TagsCreateDto } from "../dtos/create-tags.dto";
import { TagsEntity } from "../entities/tags.entity";
import { LangEnum } from "src/common/enums";
import { TagsResponseDto } from "../dtos/response-tags.dto";

export class ManagerTagsMapper {
    public static toCreate(dto: TagsCreateDto) {
        const entity = new TagsEntity()
        entity.name = dto.name
        entity.slug = makeSlug(dto.name)
        entity.desc = dto.desc
        return entity
    }

    public static toUpdate(dto: TagsCreateDto, id: number) {
        const entity = new TagsEntity({ id })
        if (dto.name) {
            entity.name = dto.name
            entity.slug = makeSlug(dto.name)
        }
        if (dto.desc) entity.desc = dto.desc
        return entity
    }

    public static toResponse(entity: TagsEntity) {
        const dto = new TagsResponseDto()
        dto.id = entity.id
        dto.name = entity.name
        dto.desc = entity.desc
        dto.slug = entity.slug
        return dto
    }
}