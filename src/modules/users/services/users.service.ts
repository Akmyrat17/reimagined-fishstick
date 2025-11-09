import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { LangEnum } from "src/common/enums";
import { UsersMapper } from "../mappers/users.mapper";
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from "../dtos/update-user.dto";
@Injectable()
export class UsersService {
    constructor(
        private usersRepository:UsersRepository
    ){}
    
    async getProfile(id:number,lang:LangEnum){
        const user = await this.usersRepository.getProfile(id,lang)
        if(!user) throw new UnauthorizedException('User not found')
        const mapped = UsersMapper.responseProfile(user,lang)
        return mapped
    }

    async updateProfile(id:number,lang:LangEnum,dto:UpdateUserDto){
        const user = await this.usersRepository.getProfile(id,lang)
        if(!user) throw new UnauthorizedException('User not found')
        const isMatch = await bcrypt.compare(dto.old_password, user.password)
        if (!isMatch) throw new UnauthorizedException('Old password is incorrect')
        const mapped = UsersMapper.profileUpdate(dto,id)
        await this.usersRepository.save(mapped)
        const mappedResponse = UsersMapper.responseProfile(mapped,lang)
        return mappedResponse
    }
}