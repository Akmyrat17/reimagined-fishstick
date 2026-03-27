import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { NotificationsEntity } from "../entities/notifications.entity";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";

@Injectable()
export class ManagerNotificationsRepository extends Repository<NotificationsEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(NotificationsEntity, dataSource.createEntityManager());
    }

    async getAll(dto: PaginationRequestDto): Promise<[NotificationsEntity[], number]> {
        const { page, limit, keyword } = dto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.createQueryBuilder('notifications')
            .leftJoin('notifications.user', 'user')
            .select(['notifications.id', 'notifications.title', 'notifications.created_at', 'notifications.type', 'notifications.body'])
            .addSelect(['user.id', 'user.fullname'])

        if (keyword) {
            queryBuilder.where(`notifications.title LIKE :keyword`, { keyword: `%${keyword}%` });
        }
        const count = await queryBuilder.getCount()
        const entities = await queryBuilder.skip(skip).take(limit).getMany();
        return [entities, count]
    }
}