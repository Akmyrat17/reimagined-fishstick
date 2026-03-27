import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsEntity } from './entities/questions.entity';
import { ManagerQuestionsController } from './controllers/manager.questions.controller';
import { QuestionsController } from './controllers/questions.controller';
import { ManagerQuestionsService } from './services/manager.questions.service';
import { QuestionsService } from './services/questions.service';
import { ManagerQuestionsRepository } from './repositories/manager.questions.repository';
import { QuestionsRepository } from './repositories/questions.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { AnswersService } from '../answers/services/answers.service';
import { VotesRepository } from '../votes/repositories/votes.repository';
import { AnswersRepository } from '../answers/repositories/answers.repository';

@Module({
    imports: [TypeOrmModule.forFeature([QuestionsEntity])],
    controllers: [ManagerQuestionsController, QuestionsController],
    providers: [ManagerQuestionsService, QuestionsService, ManagerQuestionsRepository, QuestionsRepository, UsersRepository, AnswersService, VotesRepository, AnswersRepository],
})
export class QuestionsModule { }