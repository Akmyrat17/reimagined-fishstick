import { Injectable } from "@nestjs/common";
import { FcmTokensRepository } from "../repositories/fcm-tokens.repository";

@Injectable()
export class FcmTokensService {
    constructor(private readonly fcmTokensRepository: FcmTokensRepository) { }

    async createOrActivateFcmToken(userId: number, fcmToken: string) {
        return await this.fcmTokensRepository.createOrActivate(userId, fcmToken);
    }

    async deactivateFcmToken(userId: number, token: string) {
        return await this.fcmTokensRepository.deactivate(userId, token);
    }
}