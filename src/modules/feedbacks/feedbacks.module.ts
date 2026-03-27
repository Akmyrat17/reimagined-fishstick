import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeedbacksEntity } from "./entities/feedbacks.entity";
import { ManagerFeedbacksController } from "./controllers/manager.feedbacks.controller";
import { FeedbacksController } from "./controllers/feedbacks.controller";
import { FeedbacksService } from "./services/feedbacks.service";
import { ManagerFeedbacksService } from "./services/manager.feedbacks.service";
import { FeedbacksRepository } from "./repositories/feedbacks.repository";
import { ManagerFeedbacksRepository } from "./repositories/manager.feedbacks.repository";

@Module({
    imports: [TypeOrmModule.forFeature([FeedbacksEntity])],
    controllers: [ManagerFeedbacksController, FeedbacksController],
    providers: [FeedbacksService, ManagerFeedbacksService, FeedbacksRepository, ManagerFeedbacksRepository],
    exports: []
})
export class FeedbacksModule { }