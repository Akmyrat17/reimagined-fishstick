import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AddressesCreateDto } from "../dtos/create-addresses.dto";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt-auth.guard";
import { ManagerAddressesService } from "../services/manager.addresses.service";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { AdminGuard } from "src/common/guards/admin.guard";
import { AddressesUpdateDto } from "../dtos/update-addresses.dto";

@Controller({ path: 'manager/addresses' })
@UseGuards(JwtAuthGuard, AdminGuard)
export class ManagerAddressesController {
    constructor(private readonly managerAddressesService: ManagerAddressesService) { }

    @Post()
    async create(@Body() dto: AddressesCreateDto) {
        return await this.managerAddressesService.create(dto)
    }

    @Get()
    async findAll(@Query() paginationDto: PaginationRequestDto) {
        return await this.managerAddressesService.findAll(paginationDto)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.managerAddressesService.delete(id)
    }

    @Patch(':id')
    async update(@Body() dto: AddressesUpdateDto, @Param('id', ParseIntPipe) id: number) {
        return await this.managerAddressesService.update(dto, id)
    }
}