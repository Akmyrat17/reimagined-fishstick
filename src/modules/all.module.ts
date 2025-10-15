import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';

@Module({
  imports: [UsersModule, AuthModule,QuestionsModule,AnswersModule],
})
export class AllModule {}
