import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsEntity } from './entities/questions.entity';
import { ManagerQuestionsController } from './controllers/manager.questions.controller';
import { QuestionsController } from './controllers/questions.controller';
import { ManagerQuestionsService } from './services/manager.questions.service';
import { QuestionsService } from './services/questions.service';
import { ManagerQuestionsRepository } from './repositories/manager.questions.repository';
import { QuestionsRepository } from './repositories/questions.repository';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        TypeOrmModule.forFeature([QuestionsEntity]),
        // BullModule.registerQueue({
        //     name: 'image-queue'
        // })
    ],
    controllers: [ManagerQuestionsController,QuestionsController],
    providers: [ManagerQuestionsService,QuestionsService,ManagerQuestionsRepository,QuestionsRepository],
})
export class QuestionsModule { }