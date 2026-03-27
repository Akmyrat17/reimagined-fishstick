import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AddressesEntity } from "../entities/addresses.entity";

@Injectable()
export class ManagerAddressesRepository extends Repository<AddressesEntity> {
    constructor(private readonly dataSource: DataSource) { super(AddressesEntity, dataSource.createEntityManager()); }
}