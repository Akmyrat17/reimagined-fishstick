import { Injectable } from "@nestjs/common";
import { NotificationsEntity } from "../entities/notifications.entity";
import { Brackets, DataSource, Repository } from "typeorm";
import { NotificationsTypeEnum } from "src/common/enums/notifications-type.enum";

@Injectable()
export class NotificationsRepository extends Repository<NotificationsEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(NotificationsEntity, dataSource.createEntityManager());
    }

    async getAllNotifications(userId: number) {
        return await this.createQueryBuilder('notifications')
            .where(
                new Brackets((qb) => {
                    qb.where('notifications.type = :type', { type: NotificationsTypeEnum.ALL })
                        .orWhere('notifications.user_id = :userId', { userId });
                })
            )
            .select(['notifications.id', 'notifications.title', 'notifications.created_at', 'notifications.body', 'notifications.type'])
            .getMany();
    }

    async getOneNotification(userId: number, notificationId: number) {
        return await this.createQueryBuilder('notification')
            .where(
                new Brackets((qb) => {
                    qb.where('notification.type = :type', { type: NotificationsTypeEnum.ALL })
                        .orWhere('notification.user_id = :userId', { userId })
                        .orWhere('notification.id = :notificationId', { notificationId });
                })
            )
            .getOne();
    }
}