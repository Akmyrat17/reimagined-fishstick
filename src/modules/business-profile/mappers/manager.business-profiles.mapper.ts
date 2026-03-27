import { TagsEntity } from "src/modules/tags/entities/tags.entity"
import { BusinessProfilesCreateDto } from "../dtos/create-business-profiles.dto"
import { BusinessProfilesResponseDto } from "../dtos/response-business-profiles.dto"
import { BusinessProfilesUpdateDto } from "../dtos/update-business-profiles.dto"
import { BusinessProfilesEntity } from "../entities/business-profiles.entity"
import { UsersMapper } from "src/modules/users/mappers"
import { TagsMapper } from "src/modules/tags/mappers/tags.mapper"
import { LangEnum } from "src/common/enums"

export class ManagerBusinessProfilesMapper {
    public static toCreate(dto: BusinessProfilesCreateDto) {
        const entity = new BusinessProfilesEntity()
        entity.company_name = dto.company_name
        entity.description = dto.description
        entity.location = dto.location
        entity.latitude = dto.latitude
        entity.longitude = dto.longitude
        entity.service = dto.service
        entity.working_hours = dto.working_hours
        entity.contacts = dto.contacts
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

    public static toResponseSimple(entity: BusinessProfilesEntity) {
        const dto = new BusinessProfilesResponseDto()
        dto.id = entity.id
        dto.company_name = entity.company_name
        if (entity.user) dto.user = UsersMapper.toResponseSimple(entity.user)
        dto.image_paths = entity.image_paths
        dto.check_status = entity.check_status
        dto.in_review = entity.in_review
        dto.is_active = entity.is_active
        return dto
    }

    public static toResponseDetail(entity: BusinessProfilesEntity, lang: LangEnum) {
        const dto = new BusinessProfilesResponseDto()
        dto.id = entity.id
        dto.company_name = entity.company_name
        dto.is_active = entity.is_active
        dto.check_status = entity.check_status
        dto.service = entity.service
        dto.contacts = entity.contacts
        dto.working_hours = entity.working_hours
        if (entity.user) dto.user = UsersMapper.toResponseSimple(entity.user)
        if (entity.tags) dto.tags = entity.tags.map((tag) => TagsMapper.toResponse(tag, lang))
        dto.latitude = entity.latitude
        dto.longitude = entity.longitude
        dto.description = entity.description
        dto.image_paths = entity.image_paths
        dto.location = entity.location
        return dto
    }
}