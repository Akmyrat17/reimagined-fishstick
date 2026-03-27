import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { AnswersEntity } from '../entities/answers.entity';
import { CheckStatusEnum } from 'src/common/enums/check-status.enum';

@Injectable()
export class AnswersRepository extends Repository<AnswersEntity> {
    constructor(private dataSource: DataSource) {
        super(AnswersEntity, dataSource.createEntityManager());
    }
    async findAll(dto: PaginationRequestDto, userId: number): Promise<[AnswersEntity[], number]> {
        const query = this.createQueryBuilder('answers')
            .leftJoin('answers.question', 'question')
            .select([
                'answers.id',
                'answers.content',
                'answers.check_status',
                'answers.reported_reason',
                'answers.created_at',
                'answers.answered_by_id'
            ])
            .addSelect(['question.id', 'question.title'])
            .where('answers.deleted_at IS NULL')
            .andWhere('answers.answered_by_id = :userId', { userId })

        if (dto.keyword && dto.keyword !== '') {
            query.andWhere('answers.content LIKE :keyword', { keyword: `%${dto.keyword}%` })
        }

        const offset = (dto.page - 1) * dto.limit

        const total = await query.getCount()

        const data = await query
            .orderBy('answers.created_at', 'DESC')
            .take(dto.limit)
            .skip(offset)
            .getMany()

        return [data, total]
    }
    async getLastHourAnswers() {
        return await this.query(`SELECT COUNT(*) FROM answers WHERE deleted_at IS NULL AND created_at >= NOW() - INTERVAL '1 hour' AND check_status = '${CheckStatusEnum.APPROVED}'`)
    }
}
