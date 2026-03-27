import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { BusinessProfilesEntity } from "../entities/business-profiles.entity";
import { LangEnum } from "src/common/enums";

@Injectable()
export class BusinessProfilesRepository extends Repository<BusinessProfilesEntity> {
    constructor(private dataSource: DataSource) { super(BusinessProfilesEntity, dataSource.createEntityManager()); }

    async getMine(userId: number, lang: LangEnum) {
        return await this.createQueryBuilder('bp')
            .leftJoin('bp.tags', 'tags')
            .leftJoin('bp.user', 'u')
            .select([
                'bp.id',
                'bp.company_name',
                'bp.location',
                'bp.image_paths',
                'bp.check_status',
            ])
            .addSelect(['tags.id', `tags.name`])
            .where('u.id = :userId', { userId })
            .getMany();
    }

    async getOne(id: number, lang: LangEnum, userId: number) {
        return await this.createQueryBuilder('bp')
            .leftJoin('bp.tags', 'tags')
            .leftJoin('bp.user', 'u')
            .select([
                'bp.id',
                'bp.company_name',
                'bp.contacts',
                'bp.working_hours',
                'bp.latitude',
                'bp.longitude',
                'bp.description',
                'bp.service',
                'bp.location',
                'bp.image_paths',
                'bp.check_status',
            ])
            .addSelect(['tags.id', `tags.name`])
            .where('u.id = :userId OR bp.is_active = true', { userId })
            .where('bp.id = :id', { id })
            .getOne();
    }
}