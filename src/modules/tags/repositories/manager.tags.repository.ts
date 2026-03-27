import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { TagsEntity } from "../entities/tags.entity";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";

@Injectable()
export class ManagerTagsRepository extends Repository<TagsEntity> {
    constructor(private readonly datasource: DataSource) { super(TagsEntity, datasource.createEntityManager()) }

    async getAll(dto: PaginationRequestDto, lang: LangEnum): Promise<[TagsEntity[], number]> {
        const query = this.createQueryBuilder('tags')
            .select(['tags.id', `tags.name`, `tags.desc`])
        if (dto.keyword && dto.keyword != '') {
            query.andWhere(
                new Brackets(qb => {
                    qb.where(`tags.name ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                        .orWhere(`tags.desc ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
                })
            );
        }

        const offset = (dto.page - 1) * dto.limit
        const total = await query.getCount()
        const data = await query.skip(offset).take(dto.limit).getMany()
        return [data, total]
    }
}