import { UsersService } from "../services/users.service";
import { Controller, Get, Headers, Patch } from "@nestjs/common";
import { LangEnum } from "src/common/enums";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UsersEntity } from "../entities/user.entity";

@Controller({path:'users'})
export class UsersController {
    constructor(
        private usersService:UsersService
    ){}

    @Get('profile')
    async getProfile(@CurrentUser() user:UsersEntity, @Headers('lang') lang:LangEnum){
        return await this.usersService.getProfile(user.id,lang)
    }

    @Patch('profile')
    async updateProfile(@CurrentUser() user:UsersEntity, @Headers('lang') lang:LangEnum,dto:UpdateUserDto){
        return await this.usersService.updateProfile(user.id,lang,dto)
    }
}