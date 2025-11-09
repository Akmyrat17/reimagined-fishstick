import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { ProfessionsEntity } from "../entities/professions.entity";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";

@Injectable()
export class ProfessionsRepository extends Repository<ProfessionsEntity>{
    constructor(private readonly datasource:DataSource){super(ProfessionsEntity,datasource.createEntityManager())}
    async getAll(dto:PaginationRequestDto,lang:LangEnum) {
            const query = this.createQueryBuilder('professions')
            .leftJoin('professions.users','users')
            .select(['professions.id',`professions.name_${lang}`,`professions.desc_${lang}`])
            .addSelect('users.id')
            if(dto.keyword != '') {
                query.andWhere(
                    new Brackets(qb => {
                        qb.where(`professions.name_${lang} ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                            .orWhere(`professions.desc_${lang} ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                    })
                );
            }
    
            const offset = (dto.page - 1) * dto.limit
            return await query.take(dto.limit).offset(offset).getManyAndCount()
        }
}