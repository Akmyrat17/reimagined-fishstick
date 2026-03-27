import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { AnswersEntity } from '../entities/answers.entity';
import { AnswersQueryDto } from '../dtos/query-answers.dto';

@Injectable()
export class ManagerAnswersRepository extends Repository<AnswersEntity> {
    constructor(private dataSource: DataSource) {
        super(AnswersEntity, dataSource.createEntityManager());
    }

    async findAll(dto: AnswersQueryDto): Promise<[AnswersEntity[], number]> {
        const { keyword, check_status, limit, page } = dto
        const query = this.createQueryBuilder('answers')
            .leftJoin('answers.answered_by', 'answered_by')
            .leftJoin('answers.question', 'question')
            .select(['answers.id', 'answers.content', 'answers.check_status', 'answers.created_at', 'answers.reported_reason', 'answers.deleted_at'])
            .addSelect(['answered_by.id', 'answered_by.fullname', 'answered_by.role'])
            .addSelect(['question.id', 'question.title', 'question.created_at'])
        if (keyword && keyword != '') {
            query.where(`answers.content LIKE :keyword`, { keyword: `%${keyword}%` })
                .orWhere(`answered_by.fullname LIKE :keyword`, { keyword: `%${keyword}%` })
                .orWhere(`question.title LIKE :keyword`, { keyword: `%${keyword}%` })
        }
        if (check_status) query.andWhere("questions.check_status = :value", { value: check_status })
        query
            .orderBy('answers.created_at', 'DESC')
            .addOrderBy('answers.updated_at', 'DESC')
        const offset = (page - 1) * limit
        const total = await query.getCount()
        const data = await query.take(limit).offset(offset).getMany()
        return [data, total]
    }
}
