import { UsersService } from "../services/users.service";
import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { LangEnum } from "src/common/enums";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UsersEntity } from "../entities/users.entity";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt-auth.guard";
import { ActiveUsersTracker } from "../services/active-users-tracker.service";

@Controller({ path: 'users' })

export class UsersController {
    constructor(private usersService: UsersService, private readonly activeUsersTracker: ActiveUsersTracker) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getProfile(@CurrentUser() user: UsersEntity, @Headers('lang') lang: LangEnum) {
        return await this.usersService.getProfile(user.id, lang, true)
    }

    @Get(':id')
    async getProfileById(@Headers('lang') lang: LangEnum, @Param('id') userId: number) {
        return await this.usersService.getProfile(userId, lang, false)
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateProfile(@CurrentUser() user: UsersEntity, @Headers('lang') lang: LangEnum, @Body() dto: UpdateUserDto) {
        return await this.usersService.updateProfile(user.id, lang, dto)
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteProfile(@CurrentUser('id') userId: number) {
        return await this.usersService.deleteProfile(userId)
    }

    @Post('ping')
    @HttpCode(HttpStatus.OK)
    async pingActiveUsers() {
        return this.activeUsersTracker.ping();
    }

    @Get('active/count')
    async getActiveUsersCount() {
        return this.activeUsersTracker.getActiveCount()
    }
}