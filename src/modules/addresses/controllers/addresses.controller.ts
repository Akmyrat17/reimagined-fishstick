import { Controller, Get, Query } from "@nestjs/common";
import { AddressesService } from "../services/addresses.service";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";

@Controller({ path: "addresses" })
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }
    @Get()
    async getAll(@Query() dto: PaginationRequestDto) {
        return this.addressesService.getAll(dto);
    }
}