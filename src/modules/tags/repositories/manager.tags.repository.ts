import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { TagsEntity } from "../entities/tags.entity";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";

@Injectable()
export class ManagerTagsRepository extends Repository<TagsEntity>{
    constructor(private readonly datasource:DataSource){super(TagsEntity,datasource.createEntityManager())}

    async getAll(dto:PaginationRequestDto,lang:LangEnum) {
        const query = this.createQueryBuilder('tags')
        .select(['tags.id',`tags.name_tk`,`tags.desc_tk`,`tags.name_en`,`tags.desc_en`,`tags.name_ru`,`tags.desc_ru`])
        if(dto.keyword != '') {
            query.andWhere(
                new Brackets(qb => {
                    qb.where(`tags.name_tk ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`tags.desc_tk ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`tags.desc_ru ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`tags.desc_en ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`tags.name_ru ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`tags.name_en ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                })
            );
        }

        const offset = (dto.page - 1) * dto.limit
        return await query.skip(offset).take(dto.limit).getManyAndCount()
    }
}