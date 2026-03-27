import { Injectable } from "@nestjs/common";
import { AddressesRepository } from "../repositories/addresses.repository";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { AddressesEntity } from "../entities/addresses.entity";
import { PaginationResponse } from "src/common/dto/pagination.response.dto";

@Injectable()
export class AddressesService {
    constructor(private readonly addressesRepository: AddressesRepository) { }

    async getAll(dto: PaginationRequestDto) {
        const [entities, total] = await this.addressesRepository.getAll(dto)
        return new PaginationResponse<AddressesEntity>(entities, total, dto.page, dto.limit)
    }
}