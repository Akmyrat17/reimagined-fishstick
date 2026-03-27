import { Module } from "@nestjs/common";
import { ManagerPermissionsController } from "./controllers/manager.permissions.controller";
import { ManagerPermissionsService } from "./services/manager.permissions.service";
import { ManagerPermissionsRepository } from "./repositories/manager.permissions.repository";

@Module({
    controllers: [ManagerPermissionsController],
    providers: [ManagerPermissionsService, ManagerPermissionsRepository]
})
export class PermissionsModule { }