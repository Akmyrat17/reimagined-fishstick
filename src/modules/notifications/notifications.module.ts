import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './controllers/notifications.controller';
import { ManagerNotificationsController } from './controllers/manager.notifications.controller';
import { NotificcationsService } from './services/notifications.service';
import { ManagerNotificationsService } from './services/manager.notifications.service';
import { NotificationsRepository } from './repositories/notifications.repository';
import { ManagerNotificationsRepository } from './repositories/manager.notifications.repository';
import { UsersRepository } from '../users/repositories/users.repository';
// import { firebaseProvider } from '../fcm/providers/firebase.provider';
import { ManagerFcmTokensRepository } from '../fcm/repositories/manager.fcm-tokens.repository';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationsModule])],
    controllers: [NotificationsController, ManagerNotificationsController],
    providers: [NotificcationsService, ManagerNotificationsService, NotificationsRepository, ManagerNotificationsRepository, UsersRepository, ManagerFcmTokensRepository],
    exports: [],
})
export class NotificationsModule { }
