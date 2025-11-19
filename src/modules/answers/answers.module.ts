import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AnswersEntity } from './entites/answers.entity';
import { AnswersController } from './controllers/answers.controller';
import { ManagerAnswersController } from './controllers/manager.answers.controller';
import { AnswersRepository } from './repositories/answers.repository';
import { ManagerAnswersRepository } from './repositories/manager.answers.repository';
import { AnswersService } from './services/answers.service';
import { ManagerAnswersService } from './services/manager.answers.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([AnswersEntity]),
            // BullModule.registerQueue({
            //     name: 'image-queue'
            // })
    ],
    controllers: [ManagerAnswersController,AnswersController],
    providers: [ManagerAnswersService,AnswersService,ManagerAnswersRepository,AnswersRepository],
})
export class AnswersModule { }