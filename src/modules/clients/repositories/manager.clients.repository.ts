import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClientsEntity } from '../entities/clients.entity';
import { ClientsQueryDto } from '../dtos/query-clients.dto';

@Injectable()
export class ManagerClientsRepository extends Repository<ClientsEntity> {
    constructor(private dataSource: DataSource) {
        super(ClientsEntity, dataSource.createEntityManager());
    }

    async findAll(dto: ClientsQueryDto) {
        const { keyword, page, limit, subscription_end, subscription_start, is_active } = dto
        const query = this.createQueryBuilder('clients')
            .select(["clients.id", "clients.subscription_date", "clients.is_active", "clients.company_name"])
        if (keyword) {
            query.andWhere("clients.title ILIKE :value", { value: `%${keyword}%` })
        }
        if (is_active) {
            query.andWhere("clients.is_active = :value", { value: is_active })
        }

        return await query.take(limit).offset((page - 1) * limit).getManyAndCount()
    }
    async getOne(id: number) {
        return await this.createQueryBuilder('clients')
            .leftJoin('clients.recommended_to', 'recommended')
            .select(['clients.id', 'clients.title', 'clients.description', 'clients.file_paths', 'clients.phone_number', 'clients.web_url', 'clients.subscription_date',"clients.is_active","clients.location"])
            .addSelect(["recommended.id","recommended.title"])
            .where('clients.id  = :id', { id })
            .getOne()
    }
}
