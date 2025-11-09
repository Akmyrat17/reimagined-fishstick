import { Body, Controller, Get, Headers, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ManagerTagsService } from "../services/manager.tags.service";
import { TagsCreateDto } from "../dtos/create-tags.dto";
import { TagsUpdateDto } from "../dtos/update-tags.dto";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";

@Controller({path:"manager/tags"})
export class ManagerTagsController{
    constructor(private readonly managerTagsService:ManagerTagsService){ }

    @Post()
    async create(@Body() dto:TagsCreateDto) {
        return await this.managerTagsService.create(dto)
    }

    @Patch(":id")
    async update(@Body() dto:TagsUpdateDto,@Param("id",ParseIntPipe) id:number) {
        return await this.managerTagsService.update(dto,id)
    }

    @Get()
    async getAll(@Query() dto:PaginationRequestDto,@Headers('lang') lang:LangEnum){
        return await this.managerTagsService.getAll(dto,lang)
    }

    @Get(":id")
    async getOne(@Param("id",ParseIntPipe) id:number){
        return await this.managerTagsService.getOne(id)
    }
}