import { UsersEntity } from "src/modules/users/entities/users.entity";
import { BusinessProfilesCreateDto } from "../dtos/create-business-profiles.dto";
import { BusinessProfilesEntity } from "../entities/business-profiles.entity";
import { TagsEntity } from "src/modules/tags/entities/tags.entity";
import { BusinessProfilesUpdateDto } from "../dtos/update-business-profiles.dto";
import { BusinessProfilesResponseDto } from "../dtos/response-business-profiles.dto";
import { LangEnum } from "src/common/enums";
import { TagsMapper } from "src/modules/tags/mappers/tags.mapper";

export class BusinessProfilesMapper {
    public static toCreate(dto: BusinessProfilesCreateDto, userId: number) {
        const entity = new BusinessProfilesEntity()
        entity.company_name = dto.company_name
        entity.description = dto.description
        entity.latitude = dto.latitude
        entity.longitude = dto.longitude
        entity.service = dto.service
        entity.location = dto.location
        entity.user = new UsersEntity({ id: userId })
        entity.contacts = dto.contacts
        entity.working_hours = dto.working_hours
        entity.tags = dto.tag_ids && dto.tag_ids.length > 0 ? dto.tag_ids.map((id) => new TagsEntity({ id })) : null
        return entity
    }

    public static toUpdate(dto: BusinessProfilesUpdateDto, id: number) {
        const entity = new BusinessProfilesEntity({ id })
        if (dto.company_name) entity.company_name = dto.company_name
        if (dto.description) entity.description = dto.description
        if (dto.location) entity.location = dto.location
        if (dto.latitude) entity.latitude = dto.latitude
        if (dto.longitude) entity.longitude = dto.longitude
        if (dto.service) entity.service = dto.service
        if (dto.contacts) entity.contacts = dto.contacts
        if (dto.working_hours) entity.working_hours = dto.working_hours
        if (dto.tag_ids && dto.tag_ids.length > 0) entity.tags = dto.tag_ids.map((id) => new TagsEntity({ id }))
        return entity
    }

    public static toResponse(entity: BusinessProfilesEntity, lang: LangEnum) {
        const dto = new BusinessProfilesResponseDto()
        dto.id = entity.id
        dto.description = entity.description
        dto.check_status = entity.check_status
        dto.contacts = entity.contacts
        dto.working_hours = entity.working_hours
        dto.latitude = entity.latitude
        dto.longitude = entity.longitude
        dto.service = entity.service
        dto.location = entity.location
        dto.company_name = entity.company_name
        dto.image_paths = entity.image_paths
        if (entity.tags) dto.tags = entity.tags.map((tag) => TagsMapper.toResponse(tag, lang))
        return dto
    }
}