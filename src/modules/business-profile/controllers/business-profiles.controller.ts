import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { BusinessProfilesService } from "../services/business-profiles.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { BusinessProfilesCreateDto } from "../dtos/create-business-profiles.dto";
import { BusinessProfilesUpdateDto } from "../dtos/update-business-profiles.dto";
import { LangEnum } from "src/common/enums";
import { OptionalJwtAuthGuard } from "src/modules/auth/jwt/optional.jwt-auth.guard";

@Controller({ path: "business-profiles" })
@UseGuards(OptionalJwtAuthGuard)
export class BusinessProfilesController {
    constructor(private readonly businessProfilesService: BusinessProfilesService) { }

    @Post()
    async create(@Body() dto: BusinessProfilesCreateDto, @CurrentUser('id') userId: number) {
        return this.businessProfilesService.create(dto, userId);
    }

    @Patch(":id")
    async update(@Body() dto: BusinessProfilesUpdateDto, @Param('id') id: number) {
        return this.businessProfilesService.update(dto, id);
    }

    @Get()
    async getMyBusinessProfiles(@CurrentUser('id') userId: number, @Headers('lang') lang: LangEnum) {
        return this.businessProfilesService.getMyBusinessProfiles(userId, lang);
    }

    @Get(":id")
    async getBusinessProfilesById(@Param('id') id: number, @Headers('lang') lang: LangEnum, @CurrentUser('id') userId: number) {
        console.log(id, lang);
        return this.businessProfilesService.getBusinessProfilesById(id, lang, userId);
    }
}