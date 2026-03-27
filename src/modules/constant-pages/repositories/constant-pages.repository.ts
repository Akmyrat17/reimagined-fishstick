import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { ConstantPagesEntity } from "../entities/constant-pages.entity";

@Injectable()
export class ConstantPagesRepository extends Repository<ConstantPagesEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ConstantPagesEntity, dataSource.createEntityManager());
    }
}