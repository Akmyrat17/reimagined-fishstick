import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConstantPagesEntity } from "./entities/constant-pages.entity";
import { ConstantPagesController } from "./constrollers/constant-pages.controller";
import { ManagerConstantPagesController } from "./constrollers/manager.constant-pages.controller";
import { ConstantPagesService } from "./services/constant-pages.service";
import { ManagerConstantPagesService } from "./services/manager.constant-pages.service";
import { ConstantPagesRepository } from "./repositories/constant-pages.repository";
import { ManagerConstantPagesRepository } from "./repositories/manager.constant-pages.repository";

@Module({
    imports: [TypeOrmModule.forFeature([ConstantPagesEntity])],
    controllers: [ConstantPagesController, ManagerConstantPagesController],
    providers: [ConstantPagesService, ManagerConstantPagesService, ConstantPagesRepository, ManagerConstantPagesRepository],
    exports: []
})
export class ConstantPagesModule { }