import { Controller, Get, Query } from "@nestjs/common";
import { ConstantPagesService } from "../services/constant-pages.service";
import { ConstantPagesGetOneByTypeDto } from "../dto/get-one-by-type-constant-pages.dto";

@Controller({ path: "constant-pages" })
export class ConstantPagesController {
    constructor(private readonly constantPagesService: ConstantPagesService) { }

    @Get()
    async getOneByType(@Query() dto: ConstantPagesGetOneByTypeDto) {
        return await this.constantPagesService.getOneByType(dto.type)
    }
}
