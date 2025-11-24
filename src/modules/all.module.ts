import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { ClientsModule } from './clients/clients.module';
import { ProfessionsModule } from './professions/professions.module';
import { TagsModule } from './tags/tags.module';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [UsersModule, AuthModule, QuestionsModule, AnswersModule, ClientsModule, ProfessionsModule, TagsModule,VotesModule]
})
export class AllModule { }
