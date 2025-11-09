import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagsEntity } from "./entities/tags.entity";
import { TagsController } from "./controllers/tags.controller";
import { TagsService } from "./services/tags.service";
import { TagsRepository } from "./repositories/tags.repository";
import { ManagerTagsService } from "./services/manager.tags.service";
import { ManagerTagsRepository } from "./repositories/manager.tags.repository";

@Module({
    imports:[TypeOrmModule.forFeature([TagsEntity])],
    controllers:[TagsController],
    providers:[TagsService,TagsRepository,ManagerTagsService,ManagerTagsRepository]
})
export class TagsModule{}