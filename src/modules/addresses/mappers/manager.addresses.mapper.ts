import { AddressesCreateDto } from "../dtos/create-addresses.dto";
import { AddressesEntity } from "../entities/addresses.entity";
import { AddressesUpdateDto } from "../dtos/update-addresses.dto";

export class ManagerAddressesMapper {
    public static toCreate(createAddressDto: AddressesCreateDto) {
        const entity = new AddressesEntity()
        entity.province = createAddressDto.province
        entity.city = createAddressDto.city
        entity.district = createAddressDto.district
        entity.latitude = createAddressDto.latitude
        entity.longitude = createAddressDto.longitude
        return entity
    }

    public static toUpdate(dto: AddressesUpdateDto, id: number) {
        const entity = new AddressesEntity({ id })
        if (dto.province) entity.province = dto.province
        if (dto.city) entity.city = dto.city
        if (dto.district) entity.district = dto.district
        if (dto.latitude) entity.latitude = dto.latitude
        if (dto.longitude) entity.longitude = dto.longitude
        return entity
    }
}