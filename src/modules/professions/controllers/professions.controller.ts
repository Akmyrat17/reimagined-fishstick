import { Controller, Get, Query, Headers } from "@nestjs/common";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";
import { ProfessionsService } from "../services/professions.service";

@Controller({ path: "professions" })
export class ProfessionsController {
    constructor(private readonly professionsService: ProfessionsService) { }
    @Get()
    async getAll(@Query() dto: PaginationRequestDto, @Headers('lang') lang: LangEnum) {
        return await this.professionsService.getAll(dto, lang)
    }
}