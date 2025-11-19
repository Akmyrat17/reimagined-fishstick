import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ClientsEntity } from './entities/clients.entity';
import { ManagerClientsController } from './controllers/manager.clients.controller';
import { ManagerClientsRepository } from './repositories/manager.clients.repository';
import { ManagerClientsService } from './services/manager.clients.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ClientsEntity]),
        // BullModule.registerQueue({
        //     name: 'image-queue'
        // })
    ],
    controllers: [ManagerClientsController],
    providers: [ManagerClientsRepository,ManagerClientsService],
})
export class ClientsModule { }