import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ManagerNotificationsRepository } from "../repositories/manager.notifications.repository";
import { NotificationsCreateDto } from "../dtos/create-notifications.dto";
import { ManagerNotificationsMapper } from "../mappers/manager.notifications.mapper";
import { NotificationsTypeEnum } from "src/common/enums/notifications-type.enum";
import { ManagerFcmTokensRepository } from "src/modules/fcm/repositories/manager.fcm-tokens.repository";
import * as admin from 'firebase-admin';
import { FcmTokensEntity } from "src/modules/fcm/entities/fcm-tokens.entity";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { PaginationResponse } from "src/common/dto/pagination.response.dto";
import { NotificationsEntity } from "../entities/notifications.entity";
import { UsersRepository } from "src/modules/users/repositories/users.repository";
import { GmailHelper } from "src/common/utils/gmail.helper";

@Injectable()
export class ManagerNotificationsService {
    constructor(
        private readonly managerNotificationsRepository: ManagerNotificationsRepository,
        // private readonly managerFcmTokensRepository: ManagerFcmTokensRepository,
        // @Inject('FIREBASE_APP') private firebaseApp: admin.app.App,
        private readonly usersRepository: UsersRepository
    ) { }

    async createNotifications(dto: NotificationsCreateDto) {
        try {
            const mapped = ManagerNotificationsMapper.toCreate(dto)
            let emails = []
            if (mapped.type === NotificationsTypeEnum.SPECIFIC) {
                const email = await this.usersRepository.getUserEmailById(dto.user_id)
                emails.push(email)
            } else if (mapped.type === NotificationsTypeEnum.ALL) {
                emails = await this.usersRepository.getEmailsAll()
            }
            // await this.sendnotification(dto, tokens.map(token => token.token))
            if (emails.length > 0) {
                await GmailHelper.SendGeneralNotificationEmail(emails, dto.title, dto.body)
                return await this.managerNotificationsRepository.save(mapped)
            }
            throw new BadRequestException("Couldnt find the email or smth related to it")
        } catch (error: any) {
            throw new BadRequestException(error.detail ?? error.message)
        }
    }

    async getAllNotifications(query: PaginationRequestDto) {
        const [notifications, total] = await this.managerNotificationsRepository.getAll(query)
        return new PaginationResponse<NotificationsEntity>(notifications, total, query.page, query.limit)
    }

    // async sendnotification(dto: NotificationsCreateDto, tokens: string[]) {
    //     try {
    //         if (!tokens.length) return
    //         await this.firebaseApp.messaging().sendEachForMulticast({
    //             notification: {
    //                 title: dto.title,
    //                 body: dto.body,
    //             },
    //             tokens,
    //         });
    //     } catch (error: any) {
    //         throw new BadRequestException(error.detail || error.message);
    //     }
    // }
}