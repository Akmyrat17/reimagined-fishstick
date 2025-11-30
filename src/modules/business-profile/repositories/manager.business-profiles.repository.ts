import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BusinessProfilesEntity } from '../entities/business-profiles.entity';
import { BusinessProfilesQueryDto } from '../dtos/query-business-profiles.dto';

@Injectable()
export class ManagerBusinessProfilesRepository extends Repository<BusinessProfilesEntity> {
    constructor(private dataSource: DataSource) {
        super(BusinessProfilesEntity, dataSource.createEntityManager());
    }

    async findAll(dto: BusinessProfilesQueryDto) :Promise<[BusinessProfilesEntity[],number]>{
        const { keyword, page, limit, subscription_end, subscription_start, is_active } = dto
        const query = this.createQueryBuilder('clients')
            .select(["clients.id", "clients.subscription_date", "clients.is_active", "clients.company_name"])
        if (keyword)     query.andWhere("clients.title ILIKE :value", { value: `%${keyword}%` })
        
        if (is_active)  query.andWhere("clients.is_active = :value", { value: is_active })

        const total = await query.getCount()

        const entities =  await query.take(limit).offset((page - 1) * limit).getMany()
        return [entities,total]
    }
    async getOne(id: number) {
        return await this.createQueryBuilder('clients')
            .leftJoin('clients.recommended_to', 'recommended')
            .addSelect(["recommended.id","recommended.title"])
            .where('clients.id  = :id', { id })
            .getOne()
    }
}
