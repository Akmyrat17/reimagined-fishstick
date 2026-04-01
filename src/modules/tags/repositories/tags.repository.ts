import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { TagsEntity } from "../entities/tags.entity";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";

@Injectable()
export class TagsRepository extends Repository<TagsEntity> {
    constructor(private readonly datasource: DataSource) { super(TagsEntity, datasource.createEntityManager()) }
    async getAll(dto: PaginationRequestDto, lang: LangEnum): Promise<[TagsEntity[], number]> {
        const query = this.createQueryBuilder('tags')
            .leftJoin('tags.questions', 'questions')
            .select(['tags.id', `tags.name`, `tags.desc`])
            .addSelect('questions.id')
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

    async getFamousTags(lang: LangEnum, limit: number = 10) {
        const result = await this.createQueryBuilder('tags')
            .leftJoin('tags.questions', 'questions')
            .leftJoin('tags.users', 'users')
            .leftJoin('tags.business_profiles', 'business_profiles')
            .select([
                'tags.id',
                'tags.slug',
                `tags.name`,
                `tags.desc`
            ])
            .addSelect('COUNT(DISTINCT questions.id)', 'questions_count')
            .addSelect('COUNT(DISTINCT users.id)', 'users_count')
            // .addSelect('COUNT(DISTINCT business_profiles.id)', 'business_profiles_count')
            //     .addSelect(`
            //     (COUNT(DISTINCT questions.id) + 
            //      COUNT(DISTINCT users.id) + 
            //      COUNT(DISTINCT business_profiles.id))
            // `, 'total_usage')
            .groupBy('tags.id')
            .addGroupBy(`tags.name`)
            .addGroupBy(`tags.desc`)
            .addGroupBy('tags.slug')
            // .orderBy('total_usage', 'DESC')
            .limit(limit)
            .getRawAndEntities();

        return result.entities.map((tag, index) => ({
            id: tag.id,
            slug: tag.slug,
            name: tag.name,
            desc: tag.desc,
            questions_count: parseInt(result.raw[index].questions_count) || 0,
            users_count: parseInt(result.raw[index].users_count) || 0,
            // business_profiles_count: parseInt(result.raw[index].business_profiles_count) || 0,
            // total_usage: parseInt(result.raw[index].total_usage) || 0
        }));
    }

    async getWithoutPagination() {
        const data = await this.createQueryBuilder('t')
            .select(['t.id', 't.name'])
            .addSelect('COUNT(qt.question_id)', 'question_count')
            .innerJoin('question_tags', 'qt', 'qt.tag_id = t.id')
            .groupBy('t.id')
            .orderBy('question_count', 'DESC')
            .getRawMany()

        return data.map(({ t_id, t_name }) => ({ id: t_id, name: t_name }));
    }
}