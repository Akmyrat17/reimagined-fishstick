import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FeedbacksEntity } from "../entities/feedbacks.entity";

@Injectable()
export class FeedbacksRepository extends Repository<FeedbacksEntity> {
    constructor(private readonly dataSource: DataSource) { super(FeedbacksEntity, dataSource.createEntityManager()); }
}