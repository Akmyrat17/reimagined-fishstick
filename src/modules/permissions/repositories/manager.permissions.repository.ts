import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PermissionsEntity } from "../entities/permissions.entity";

@Injectable()
export class ManagerPermissionsRepository extends Repository<PermissionsEntity> {
    constructor(private readonly datasource: DataSource) { super(PermissionsEntity, datasource.createEntityManager()) }
}