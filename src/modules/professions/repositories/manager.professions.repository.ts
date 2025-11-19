import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { ProfessionsEntity } from "../entities/professions.entity";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";

@Injectable()
export class ManagerProfessionsRepository extends Repository<ProfessionsEntity> {
    constructor(private readonly datasource: DataSource) { super(ProfessionsEntity, datasource.createEntityManager()) }

    async getAll(dto: PaginationRequestDto, lang: LangEnum):Promise<[ProfessionsEntity[],number]> {
        const query = this.createQueryBuilder('professions')
            .select([
                'professions.id',
                'professions.created_at',
                'professions.slug',
                'professions.name_tk',
                'professions.desc_tk',
                'professions.name_ru',
                'professions.desc_ru',
                'professions.name_en',
                'professions.desc_en',
            ])

        if (dto.keyword && dto.keyword.trim() !== '') {
            query.andWhere(
                new Brackets(qb => {
                    qb.where(`professions.name_en ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`professions.desc_en ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`professions.desc_ru ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`professions.desc_tk ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`professions.name_tk ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`professions.name_ru ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                })
            )
        }

        const offset = (dto.page - 1) * dto.limit

        const total = await query.getCount()
        const data = await query.limit(dto.limit).offset(offset).getMany()

        return [data, total]
    }

}