import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FcmTokensEntity } from "../entities/fcm-tokens.entity";
import { RolesEnum } from "src/common/enums";

@Injectable()
export class ManagerFcmTokensRepository extends Repository<FcmTokensEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(FcmTokensEntity, dataSource.createEntityManager());
    }

    async getAllTokens() {
        return await this.createQueryBuilder('fcm_tokens')
            .select('fcm_tokens.token')
            .where('fcm_tokens.is_active = :isActive', { isActive: true })
            .getMany();
    }

    async getTokensOfSpecificUser(userId: number) {
        return await this.createQueryBuilder('fcm_tokens')
            .select('fcm_tokens.token')
            .where('fcm_tokens.is_active = :isActive', { isActive: true })
            .andWhere('fcm_tokens.user_id = :userId', { userId })
            .getMany()
    }

    async getAllAdminTokens() {
        return await this.createQueryBuilder('fcm_tokens')
            .leftJoin('fcm_tokens.user', 'user')
            .select(['fcm_tokens.token', 'user.id', 'user.role'])
            .where('fcm_tokens.is_active = :isActive', { isActive: true })
            .andWhere('user.role = :role', { role: RolesEnum.ADMIN })
            .getMany()
    }
}