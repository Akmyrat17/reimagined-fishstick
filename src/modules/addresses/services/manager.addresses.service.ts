import { Injectable } from "@nestjs/common";
import { AddressesCreateDto } from "../dtos/create-addresses.dto";
import { ManagerAddressesRepository } from "../repositories/manager.addresses.repository";
import { ManagerAddressesMapper } from "../mappers/manager.addresses.mapper";
import { AddressesRepository } from "../repositories/addresses.repository";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { PaginationResponse } from "src/common/dto/pagination.response.dto";
import { AddressesUpdateDto } from "../dtos/update-addresses.dto";

@Injectable()
export class ManagerAddressesService {
    constructor(private readonly managerAddressesRepository: ManagerAddressesRepository, private readonly addressesRepository: AddressesRepository) { }

    async create(dto: AddressesCreateDto) {
        const mapped = ManagerAddressesMapper.toCreate(dto)
        return await this.managerAddressesRepository.save(mapped)
    }

    async findAll(dto: PaginationRequestDto) {
        const [addresses, count] = await this.addressesRepository.getAll(dto)
        return new PaginationResponse(addresses, count, dto.page, dto.limit)
    }

    async delete(id: number) {
        const address = await this.managerAddressesRepository.findOne({ where: { id } })
        return (await this.managerAddressesRepository.delete(address.id)).affected === 1 ? { message: `Address with ID ${id} successfully deleted` } : { message: `Address with ID ${id} not found` }
    }

    async update(dto: AddressesUpdateDto, id: number) {
        const address = await this.managerAddressesRepository.findOne({ where: { id } })
        if (!address) return { message: `Address with ID ${id} not found` }
        const mapped = ManagerAddressesMapper.toUpdate(dto, address.id)
        return await this.managerAddressesRepository.save(mapped)
    }
}