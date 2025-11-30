import { BusinessProfilesCreateDto } from "../dtos/create-business-profiles.dto"
import { BusinessProfilesResponseDto } from "../dtos/response-business-profiles.dto"
import { BusinessProfilesUpdateDto } from "../dtos/update-business-profiles.dto"
import { BusinessProfilesEntity } from "../entities/business-profiles.entity"

export class ManagerBusinessProfilesMapper {
    public static toCreate(dto:BusinessProfilesCreateDto,filePaths:string[],slug:string){
        const entity = new BusinessProfilesEntity()
        entity.company_name = dto.company_name
        entity.description = dto.description
        entity.file_paths = filePaths
        entity.location = dto.location
        entity.latitude = dto.latitude
        entity.longitude = dto.longitude
        entity.slug = slug
        entity.phone_number = dto.phone_number
        return entity
    }

    public static toUpdate(dto:BusinessProfilesUpdateDto,id:number,slug:string,filePaths:string[]){
        console.log(dto)
        const entity = new BusinessProfilesEntity({id})
        if(dto.company_name) entity.company_name = dto.company_name
        if(dto.description) entity.description = dto.description
        if(filePaths) entity.file_paths = filePaths
        if(dto.location) entity.location = dto.location
        if (dto.latitude) entity.latitude = dto.latitude
        if(dto.longitude) entity.longitude = dto.longitude
        entity.slug = slug
        if(dto.phone_number) entity.phone_number = dto.phone_number
        console.log(entity)
        return entity
    }

    public static toResponseSimple(entity:BusinessProfilesEntity){
        const dto = new BusinessProfilesResponseDto()
        dto.id = entity.id
        dto.company_name = entity.company_name
        dto.subscription_date = entity.subscription_date
        dto.is_active = entity.is_active
        return dto
    }

    public static toResponseDetail(entity:BusinessProfilesEntity){
        const dto = new BusinessProfilesResponseDto()
        dto.id = entity.id
        dto.company_name = entity.company_name
        dto.subscription_date = entity.subscription_date
        dto.is_active = entity.is_active
        dto.description = entity.description
        dto.file_paths = entity.file_paths
        dto.location = entity.location
        dto.phone_number = entity.phone_number
        dto.web_url = entity.web_url
        return dto
    }
}