import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfilesEntity } from './entities/business-profiles.entity';
import { ManagerBusinessProfileController } from './controllers/manager.business-profile.controller';
import { ManagerBusinessProfilesRepository } from './repositories/manager.business-profiles.repository';
import { ManagerBusinessProfilesService } from './services/manager.business-profiles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BusinessProfilesEntity]),
    ],
    controllers: [ManagerBusinessProfileController],
    providers: [ManagerBusinessProfilesRepository,ManagerBusinessProfilesService],
})
export class BusinessProfilesModule { }