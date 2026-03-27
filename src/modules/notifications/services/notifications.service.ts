import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationsRepository } from "../repositories/notifications.repository";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "src/modules/users/repositories/users.repository";
import { NotificationsTypeEnum } from "src/common/enums/notifications-type.enum";
import { NotificationsMapper } from "../mappers/notifications.mapper";

@Injectable()
export class NotificcationsService {
    private readonly baseUrl: string
    constructor(
        private readonly notificationsRepository: NotificationsRepository,
        private readonly configService: ConfigService,
        private readonly usersRepository: UsersRepository
    ) {
        this.baseUrl = this.configService.get<string>("FILE_SERVER_URL")
    }

    async getNotifications(userId: number) {
        try {
            const notifications = await this.notificationsRepository.getAllNotifications(userId)
            const user = await this.usersRepository.findOne({ where: { id: userId } })
            const mapped = notifications.map((notification) => {
                const isRemoved = user.removed_notifications.includes(notification.id)
                if (!isRemoved) return NotificationsMapper.toResponseSimple(notification)
            })
            return mapped
        } catch (error) {
            throw new NotFoundException(error.detail || error.message)
        }
    }

    async removeNotification(userId: number, notificationId: number) {
        const notification = await this.notificationsRepository.getOneNotification(userId, notificationId)
        if (!notification) throw new NotFoundException("Notification not found")
        if (notification.type === NotificationsTypeEnum.SPECIFIC) await this.notificationsRepository.delete(notification.id)
        else await this.usersRepository.addRemovedNotification(userId, notificationId)
        return true
    }
}