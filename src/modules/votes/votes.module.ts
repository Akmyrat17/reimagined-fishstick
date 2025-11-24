import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VotesEntity } from "./entities/votes.entity";
import { VotesController } from "./controllers/votes.controller";
import { VotesService } from "./services/votes.service";
import { VotesRepository } from "./repositories/votes.repository";

@Module({
    imports:[TypeOrmModule.forFeature([VotesEntity])],
    controllers:[VotesController],
    providers:[VotesService,VotesRepository]
})
export class VotesModule{}