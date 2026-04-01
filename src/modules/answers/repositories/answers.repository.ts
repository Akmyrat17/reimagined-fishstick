import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { AnswersEntity } from '../entities/answers.entity';
import { CheckStatusEnum } from 'src/common/enums/check-status.enum';
import { VotesTypeEnum } from 'src/common/enums';

@Injectable()
export class AnswersRepository extends Repository<AnswersEntity> {
    constructor(private dataSource: DataSource) {
        super(AnswersEntity, dataSource.createEntityManager());
    }
    async findAll(dto: PaginationRequestDto, userId: number, othersProfileAnswers: boolean): Promise<[AnswersEntity[], number]> {
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
            .where('answers.answered_by_id = :userId', { userId })

        if (dto.keyword && dto.keyword !== '') {
            query.andWhere('answers.content LIKE :keyword', { keyword: `%${dto.keyword}%` })
        }
        if (othersProfileAnswers) {
            query.andWhere('answers.check_status = :status', { status: CheckStatusEnum.APPROVED })
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
        return await this.query(`SELECT COUNT(*) FROM answers WHERE created_at >= NOW() - INTERVAL '1 hour' AND check_status = '${CheckStatusEnum.APPROVED}'`)
    }

    async getByQuestionId(questionId: number, dto: PaginationRequestDto, userId?: number): Promise<[any[], number]> {
        const { keyword, page, limit } = dto

        const query = this.createQueryBuilder('answers')
            .leftJoin('answers.answered_by', 'answered_by')
            .select(['answers.id', 'answers.content', 'answers.created_at', 'answers.check_status'])
            .addSelect(['answered_by.id', 'answered_by.fullname'])
            .addSelect(
                `COALESCE((SELECT COUNT(*) FROM votes v WHERE v.target_id = answers.id AND v.type = '${VotesTypeEnum.ANSWERS}' AND v.vote = 1), 0)`,
                'upvotes'
            )
            .addSelect(
                `COALESCE((SELECT COUNT(*) FROM votes v WHERE v.target_id = answers.id AND v.type = '${VotesTypeEnum.ANSWERS}' AND v.vote = 0), 0)`,
                'downvotes'
            )
            .addSelect(
                `COALESCE((SELECT SUM(CASE WHEN v.vote = 1 THEN 1 WHEN v.vote = 0 THEN -1 ELSE 0 END) FROM votes v WHERE v.target_id = answers.id AND v.type = '${VotesTypeEnum.ANSWERS}'), 0)`,
                'total_votes'
            )
            .where('answers.question_id = :questionId', { questionId })
            .andWhere('answers.check_status = :status', { status: CheckStatusEnum.APPROVED })

        if (userId) {
            query.addSelect(
                `(SELECT v.vote FROM votes v WHERE v.target_id = answers.id AND v.type = '${VotesTypeEnum.ANSWERS}' AND v.user_id = ${userId} LIMIT 1)`,
                'user_vote'
            )
        }

        if (keyword) {
            query.andWhere('answers.content ILIKE :keyword', { keyword: `%${keyword}%` })
        }

        const total = await query.getCount()

        const data = await query
            .orderBy('upvotes', 'DESC')
            .addOrderBy('answers.created_at', 'DESC')
            .limit(limit)
            .offset((page - 1) * limit)
            .getRawMany()

        return [data, total]
    }
}
