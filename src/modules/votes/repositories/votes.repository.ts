import { Injectable } from "@nestjs/common";
import { DataSource,  Repository } from "typeorm";
import { VotesEntity } from "../entities/votes.entity";

@Injectable()
export class VotesRepository extends Repository<VotesEntity> {
    constructor(private readonly datasource:DataSource) {super(VotesEntity,datasource.createEntityManager())}
}