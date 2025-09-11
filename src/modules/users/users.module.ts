import { Module } from '@nestjs/common';
import { ManagerUsersController } from './controllers/manager.users.controller';
import { ManagerUsersRepository } from './repositories/manager.users.repository';
import { ManagerUsersService } from './services/manager.users.service';

@Module({
  controllers: [ManagerUsersController],
  providers: [ManagerUsersService, ManagerUsersRepository],
  exports: [ManagerUsersService, ManagerUsersRepository],
})
export class UsersModule { }
