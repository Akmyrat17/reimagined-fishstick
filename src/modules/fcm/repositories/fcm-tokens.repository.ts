import { Injectable } from "@nestjs/common";
import { FcmTokensEntity } from "../entities/fcm-tokens.entity";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class FcmTokensRepository extends Repository<FcmTokensEntity> {
    constructor(private readonly dataSource: DataSource) { super(FcmTokensEntity, dataSource.createEntityManager()); }

    async createOrActivate(userId: number, fcmToken: string) {
        const existing = await this.findOne({ where: { user: { id: userId } } });
        if (existing) {
            return this.save({ ...existing, token: fcmToken, is_active: true });
        }
        return await this.save({ user: { id: userId }, token: fcmToken, is_active: true });
    }

    async deactivate(userId: number, token: string) {
        return await this.update(
            { user: { id: userId }, token },
            { is_active: false }
        );
    }
}