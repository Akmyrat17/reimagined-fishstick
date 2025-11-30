import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";
import { BullModule } from "@nestjs/bullmq";
import { ImageConsumer } from "./image.processor";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'image-queue'
        })
    ],
    providers: [ImagesService, ImageConsumer],
    controllers: [ImagesController]
})
export class ImagesModule { }