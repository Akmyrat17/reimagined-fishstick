import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";
import { BullModule } from "@nestjs/bullmq";
import { ImageConsumer } from "./image.processor";
import { ManagerQuestionsRepository } from "../questions/repositories/manager.questions.repository";
import { ManagerAnswersRepository } from "../answers/repositories/manager.answers.repository";
import { ManagerBusinessProfilesRepository } from "../business-profile/repositories/manager.business-profiles.repository";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'image-queue'
        })
    ],
    providers: [ImagesService, ImageConsumer, ManagerQuestionsRepository, ManagerAnswersRepository, ManagerBusinessProfilesRepository],
    controllers: [ImagesController]
})
export class ImagesModule { }