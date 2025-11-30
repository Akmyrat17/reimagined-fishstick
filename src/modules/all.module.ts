import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { ProfessionsModule } from './professions/professions.module';
import { TagsModule } from './tags/tags.module';
import { VotesModule } from './votes/votes.module';
import { BusinessProfilesModule } from './business-profile/business-profiles.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [UsersModule, AuthModule, QuestionsModule, AnswersModule, BusinessProfilesModule, ProfessionsModule, TagsModule,VotesModule,ImagesModule]
})
export class AllModule { }
