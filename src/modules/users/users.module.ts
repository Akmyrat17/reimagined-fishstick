import { Module } from '@nestjs/common';
import { ManagerUsersController } from './controllers/manager.users.controller';
import { ManagerUsersRepository } from './repositories/manager.users.repository';
import { ManagerUsersService } from './services/manager.users.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { VotesRepository } from '../votes/repositories/votes.repository';
import { QuestionsService } from '../questions/services/questions.service';
import { QuestionsRepository } from '../questions/repositories/questions.repository';
import { AnswersRepository } from '../answers/repositories/answers.repository';
import { AnswersService } from '../answers/services/answers.service';
import { ActiveUsersTracker } from './services/active-users-tracker.service';

@Module({
  controllers: [ManagerUsersController, UsersController],
  providers: [ActiveUsersTracker, ManagerUsersService, ManagerUsersRepository, UsersService, UsersRepository, VotesRepository, QuestionsService, QuestionsRepository, AnswersRepository, AnswersService],
  exports: [ManagerUsersService, ManagerUsersRepository],
})
export class UsersModule { }
