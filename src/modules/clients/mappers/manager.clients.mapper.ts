import { ClientsCreateDto } from "../dtos/create-clients.dto";
import { ClientsResponseDto } from "../dtos/response-clients.dto";
import { ClientsUpdateDto } from "../dtos/update-clients.dto";
import { ClientsEntity } from "../entities/clients.entity";

export class ManagerClientsMapper {
    public static toCreate(dto:ClientsCreateDto,filePaths:string[],slug:string){
        const entity = new ClientsEntity()
        entity.company_name = dto.company_name
        entity.description = dto.description
        entity.file_paths = filePaths
        entity.location = dto.location
        entity.slug = slug
        entity.phone_number = dto.phone_number
        return entity
    }

    public static toUpdate(dto:ClientsUpdateDto,id:number,slug:string,filePaths:string[]){
        const entity = new ClientsEntity({id})
        if(dto.company_name) entity.company_name = dto.company_name
        if(dto.description) entity.description = dto.description
        if(filePaths) entity.file_paths = filePaths
        if(dto.location) entity.location = dto.location
        entity.slug = slug
        if(dto.phone_number) entity.phone_number = dto.phone_number
        return entity
    }

    public static toResponseSimple(entity:ClientsEntity){
        const dto = new ClientsResponseDto()
        dto.id = entity.id
        dto.company_name = entity.company_name
        dto.subscription_date = entity.subscription_date
        dto.is_active = entity.is_active
        return dto
    }

    public static toResponseDetail(entity:ClientsEntity){
        const dto = new ClientsResponseDto()
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