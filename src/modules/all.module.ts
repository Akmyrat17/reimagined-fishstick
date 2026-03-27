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
import { MainPageModule } from './main-page/main-page.module';
import { AddressesModule } from './addresses/addresses.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConstantPagesModule } from './constant-pages/constant-pages.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    QuestionsModule,
    AnswersModule,
    BusinessProfilesModule,
    ProfessionsModule,
    TagsModule,
    VotesModule,
    ImagesModule,
    NotificationsModule,
    MainPageModule,
    AddressesModule,
    FeedbacksModule,
    ConstantPagesModule,
    PermissionsModule
  ],
})
export class AllModule { }
