import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ConstantPagesEntity } from "../entities/constant-pages.entity";

@Injectable()
export class ManagerConstantPagesRepository extends Repository<ConstantPagesEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ConstantPagesEntity, dataSource.createEntityManager());
    }
}