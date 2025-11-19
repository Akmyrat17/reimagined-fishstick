import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfessionsEntity } from "./entities/professions.entity";
import { ProfessionsController } from "./controllers/professions.controller";
import { ProfessionsService } from "./services/professions.service";
import { ProfessionsRepository } from "./repositories/professions.repository";
import { ManagerProfessionsService } from "./services/manager.professions.service";
import { ManagerProfessionsRepository } from "./repositories/manager.professions.repository";
import { ManagerProfessionsController } from "./controllers/manager.professions.controller";

@Module({
    imports:[TypeOrmModule.forFeature([ProfessionsEntity])],
    controllers:[ProfessionsController,ManagerProfessionsController],
    providers:[ProfessionsService,ProfessionsRepository,ManagerProfessionsService,ManagerProfessionsRepository]
})
export class ProfessionsModule {}