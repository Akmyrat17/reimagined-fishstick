import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ManagerProfessionsService } from "../services/manager.professions.service";
import { ProfessionsCreateDto } from "../dtos/create-professions.dto";
import { ProfessionsUpdateDto } from "../dtos/update-professions.dto";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";

@Controller({path:"manager/professions"})
export class ManagerProfessionsController{
    constructor(private readonly managerProfessionsService:ManagerProfessionsService){ }

    @Post()
    async create(@Body() dto:ProfessionsCreateDto) {
        return await this.managerProfessionsService.create(dto)
    }

    @Patch(":id")
    async update(@Body() dto:ProfessionsUpdateDto,@Param("id",ParseIntPipe) id:number) {
        return await this.managerProfessionsService.update(dto,id)
    }

    @Get()
    async getAll(@Query() dto:PaginationRequestDto,@Headers('lang') lang:LangEnum){
        return await this.managerProfessionsService.getAll(dto,lang)
    }

    @Delete(":id")
    async remove(@Param("id",ParseIntPipe) id:number) {
        return await this.managerProfessionsService.delete(id)
    }
    
    // @Get(":id")
    // async getOne(@Param("id",ParseIntPipe) id:number){
    //     return await this.managerProfessionsService.getOne(id)
    // }
}