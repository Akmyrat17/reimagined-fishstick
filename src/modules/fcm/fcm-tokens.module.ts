import { Module } from "@nestjs/common";
import { firebaseProvider } from "./providers/firebase.provider";
import { FcmTokensRepository } from "./repositories/fcm-tokens.repository";
import { FcmTokensService } from "./services/fcm-tokens.service";
import { FcmTokensController } from "./controllers/fcm-tokens.controller";

@Module({
    imports: [],
    controllers: [FcmTokensController],
    providers: [firebaseProvider, FcmTokensRepository, FcmTokensService],
    exports: []
})
export class FcmTokensModule { }