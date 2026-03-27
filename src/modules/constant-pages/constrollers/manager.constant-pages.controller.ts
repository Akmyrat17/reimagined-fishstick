import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ManagerConstantPagesService } from "../services/manager.constant-pages.service";
import { ConstantPagesCreateDto } from "../dto/create-constant-pages.dto";
import { ConstantPagesUpdateDto } from "../dto/update-constant-pages.dto";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt-auth.guard";
import { AdminGuard } from "src/common/guards/admin.guard";

@Controller({ path: "manager/constant-pages" })
@UseGuards(JwtAuthGuard, AdminGuard)
export class ManagerConstantPagesController {
    constructor(private readonly managerConstantPagesService: ManagerConstantPagesService) { }

    @Post()
    async create(@Body() dto: ConstantPagesCreateDto) {
        return await this.managerConstantPagesService.create(dto)
    }

    @Patch(":id")
    async update(@Body() dto: ConstantPagesUpdateDto, @Param("id", ParseIntPipe) id: number) {
        return await this.managerConstantPagesService.update(id, dto)
    }

    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id: number) {
        return await this.managerConstantPagesService.delete(id)
    }

    @Get()
    async getAll() {
        return await this.managerConstantPagesService.getAll()
    }
}