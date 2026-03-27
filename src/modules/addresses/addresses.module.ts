import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressesEntity } from "./entities/addresses.entity";
import { AddressesController } from "./controllers/addresses.controller";
import { AddressesRepository } from "./repositories/addresses.repository";
import { AddressesService } from "./services/addresses.service";
import { ManagerAddressesController } from "./controllers/manager.addresses.controller";
import { ManagerAddressesRepository } from "./repositories/manager.addresses.repository";
import { ManagerAddressesService } from "./services/manager.addresses.service";

@Module({
    imports: [TypeOrmModule.forFeature([AddressesEntity])],
    controllers: [AddressesController, ManagerAddressesController],
    providers: [AddressesService, AddressesRepository, ManagerAddressesRepository, ManagerAddressesService],
    exports: []
})
export class AddressesModule { }