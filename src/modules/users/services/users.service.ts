import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { LangEnum } from "src/common/enums";
import { UsersMapper } from "../mappers/users.mapper";
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from "../dtos/update-user.dto";
import { QuestionsService } from "src/modules/questions/services/questions.service";
import { AnswersService } from "src/modules/answers/services/answers.service";
import { VotesRepository } from "src/modules/votes/repositories/votes.repository";
import { GmailHelper } from "src/common/utils/gmail.helper";
@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private readonly questionsService: QuestionsService,
        private readonly answersService: AnswersService,
        private readonly votesRepository: VotesRepository
    ) { }

    async getProfile(id: number, lang: LangEnum, showFullEmail: boolean) {
        try {
            const user = await this.usersRepository.getProfile(id, lang)
            if (!user) throw new UnauthorizedException('User not found')
            if (!showFullEmail) user.email = GmailHelper.MaskEmail(user.email)
            const mapped = UsersMapper.responseProfile(user, lang)
            return mapped
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.detail || error.message);
        }
    }

    async updateProfile(id: number, lang: LangEnum, dto: UpdateUserDto) {
        try {
            const user = await this.usersRepository.getProfile(id, lang)
            if (!user) throw new UnauthorizedException('User not found')
            const mapped = UsersMapper.profileUpdate(dto, id)
            if (dto.old_password) {
                const isMatch = await bcrypt.compare(dto.old_password, user.password)
                if (!isMatch) throw new UnauthorizedException('Old password is incorrect')
                mapped.password = await bcrypt.hash(dto.password, 10)
            }
            return await this.usersRepository.save(mapped)
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.detail || error.message);
        }
    }

    async deleteProfile(id: number) {
        try {
            const user = await this.usersRepository.getToDeleteProfile(id)
            if (!user) throw new NotFoundException('User not found')
            await this.questionsService.removeByIds(user.questions.map(e => e.id), id)
            await this.answersService.removeByEntities(user.answers)
            await this.usersRepository.remove(user)
            return { success: true, message: "user deleted successfully" }

        } catch (error) {
            console.log(error)
        }
    }
}
