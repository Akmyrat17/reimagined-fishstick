import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfilesEntity } from './entities/business-profiles.entity';
import { ManagerBusinessProfileController } from './controllers/manager.business-profile.controller';
import { ManagerBusinessProfilesRepository } from './repositories/manager.business-profiles.repository';
import { ManagerBusinessProfilesService } from './services/manager.business-profiles.service';
import { BusinessProfilesController } from './controllers/business-profiles.controller';
import { BusinessProfilesService } from './services/business-profiles.service';
import { BusinessProfilesRepository } from './repositories/business-profiles.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([BusinessProfilesEntity]),
    ],
    controllers: [ManagerBusinessProfileController, BusinessProfilesController],
    providers: [ManagerBusinessProfilesRepository, ManagerBusinessProfilesService, BusinessProfilesService, BusinessProfilesRepository],
})
export class BusinessProfilesModule { }