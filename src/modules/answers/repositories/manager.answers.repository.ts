import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { AnswersEntity } from '../entities/answers.entity';
import { AnswersQueryDto } from '../dtos/query-answers.dto';
import { VotesTypeEnum } from 'src/common/enums';

@Injectable()
export class ManagerAnswersRepository extends Repository<AnswersEntity> {
    constructor(private dataSource: DataSource) {
        super(AnswersEntity, dataSource.createEntityManager());
    }

    async findAll(dto: AnswersQueryDto, startDate: Date, endDate: Date): Promise<[AnswersEntity[], number]> {
        const { keyword, check_status, limit, page } = dto;
        const query = this.createQueryBuilder('answers')
            .leftJoin('answers.answered_by', 'answered_by')
            .innerJoin('answers.question', 'question')
            .innerJoin('question.asked_by', 'u')
            .select(['answers.id', 'answers.content', 'answers.check_status', 'answers.created_at', 'answers.reported_reason', 'answers.updated_at'])
            .addSelect(['answered_by.id', 'answered_by.fullname', 'answered_by.role', 'answered_by.email'])
            .addSelect(['u.id', 'u.fullname', 'u.role', 'u.email'])
            .addSelect(['question.id', 'question.title', 'question.created_at', 'question.priority', 'question.check_status'])
            .addSelect(
                `(SELECT COUNT(*) FROM votes v WHERE v.target_id = answers.id AND v.type = '${VotesTypeEnum.ANSWERS}' AND v.vote = 1)`,
                'answers_upvotes_count'
            )
            .addSelect(
                `(SELECT COUNT(*) FROM votes v WHERE v.target_id = answers.id AND v.type = '${VotesTypeEnum.ANSWERS}' AND v.vote = 0)`,
                'answers_downvotes_count'
            )
            .addSelect(
                `(SELECT COALESCE(SUM(CASE WHEN v.vote = 1 THEN 1 WHEN v.vote = 0 THEN -1 ELSE 0 END), 0) FROM votes v WHERE v.target_id = answers.id AND v.type = '${VotesTypeEnum.ANSWERS}')`,
                'answers_total_votes_count'
            )
            .addSelect(
                `CASE question.priority WHEN 'high' THEN 1 WHEN 'low' THEN 2 ELSE 3 END`,
                'priority_order'
            )

        if (keyword && keyword != '') {
            query.where(`answers.content LIKE :keyword`, { keyword: `%${keyword}%` })
                .orWhere(`answered_by.fullname LIKE :keyword`, { keyword: `%${keyword}%` })
                .orWhere(`u.fullname LIKE :keyword`, { keyword: `%${keyword}%` })
                .orWhere(`question.title LIKE :keyword`, { keyword: `%${keyword}%` });
        }
        if (check_status) {
            query.andWhere('answers.check_status = :value', { value: check_status });
        }
        if (dto.time_range) {
            query.andWhere('answers.created_at BETWEEN :startDate AND :endDate', { startDate, endDate });
        }

        query
            .orderBy('priority_order', 'ASC')
            .addOrderBy('answers.created_at', 'ASC')
            .addOrderBy('answers.updated_at', 'ASC');

        const offset = (page - 1) * limit;
        const total = await query.getCount();
        const data = await query.limit(limit).offset(offset).getMany();
        return [data, total];
    }

    // get total, total by check_status
    async getTotal() {
        return await this.createQueryBuilder('answers')
            .select('COUNT(*)', 'total')
            // Repeat this pattern for each status you have
            .addSelect("COUNT(CASE WHEN answers.check_status = 'not-checked' THEN 1 END)", 'total_not_checked')
            .addSelect("COUNT(CASE WHEN answers.check_status = 'approved' THEN 1 END)", 'total_approved')
            .addSelect("COUNT(CASE WHEN answers.check_status = 'reported' THEN 1 END)", 'total_reported')
            .getRawOne();
    }
}
