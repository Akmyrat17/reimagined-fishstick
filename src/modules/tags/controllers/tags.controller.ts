import { Controller, Get, Query, Headers } from "@nestjs/common";
import { TagsService } from "../services/tags.service";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";

@Controller({ path: "tags" })
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }
    @Get()
    async getAll(@Query() dto: PaginationRequestDto, @Headers('lang') lang: LangEnum) {
        return await this.tagsService.getAll(dto, lang)
    }

    @Get('famous')
    async getFamousTags(@Headers('lang') lang: LangEnum) {
        return await this.tagsService.getFamousTags(lang)
    }

    @Get('without-pagination')
    async getWithoutPagnation() {
        return await this.tagsService.getWithoutPagination()
    }
}