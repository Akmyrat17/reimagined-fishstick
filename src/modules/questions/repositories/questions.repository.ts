import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionsEntity } from '../entities/questions.entity';
import { CheckStatusEnum } from 'src/common/enums/check-status.enum';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { QuestionsSortEnum } from 'src/common/enums/questions-sort.enum';
import { VotesTypeEnum } from 'src/common/enums/votes-type.enum';

@Injectable()
export class QuestionsRepository extends Repository<QuestionsEntity> {
    constructor(private dataSource: DataSource) {
        super(QuestionsEntity, dataSource.createEntityManager());
    }

    async findAll(dto: QuestionsQueryDto): Promise<[QuestionsEntity[], number]> {
        const { keyword, page, limit, sort, priority } = dto;

        const query = this.createQueryBuilder('questions')
            .leftJoin('questions.asked_by', 'asked_by')
            .leftJoin('questions.answers', 'answers') // for HAS_ANSWERED sorting
            .leftJoin('questions.seen', 'seen')
            .leftJoin('votes','v','v.target_id = questions.id and v.type = :type',{type:VotesTypeEnum.QUESTIONS})
            .select([
                'questions.id',
                'questions.slug',
                'questions.priority',
                'questions.special',
                'questions.title'
            ])
            .addSelect(['asked_by.id', 'asked_by.fullname'])
            .addSelect('COUNT(answers.id)', 'answers_count')
            .addSelect('COUNT(seen.id)', 'seen')
            .addSelect(['v.id as vote_id','v.vote as vote_vote','v.user_id as vote_user_id'])
        if (keyword) {
            query.where('questions.title LIKE :keyword', { keyword: `%${keyword}%` });
        }

        if (priority) {
            query.andWhere('questions.priority = :priority', { priority });
        }

        // Only approved
        query.andWhere('questions.check_status = :value', { value: CheckStatusEnum.APPROVED });

        // Sorting
        switch (sort) {
            case QuestionsSortEnum.HAS_ANSWERED:
                query.having('COUNT(answers.id) > 0')
                break;

            case QuestionsSortEnum.HAS_NOT_ANSWERED:
                query.having('COUNT(answers.id) = 0')
                break;

            case QuestionsSortEnum.LAST_WEEK:
                query.andWhere('questions.created_at >= NOW() - INTERVAL \'7 days\'')
                break;

            case QuestionsSortEnum.LAST_MONTH:
                query.andWhere('questions.created_at >= NOW() - INTERVAL \'30 days\'')
                break

            default:
                query.andWhere('questions.created_at >= NOW() - INTERVAL \'1 day\'')
                break
        }

        const count = await query.getCount();

        const entities = await query
            .groupBy('questions.id')
            .addGroupBy('asked_by.id')
            .addGroupBy('v.id')
            .orderBy('answers_count', 'DESC')
            .addOrderBy('seen', 'DESC')
            .take(limit)
            .skip((page - 1) * limit)
            .getRawMany();
            console.log(entities)
        return [entities, count];
    }


    async getOne(slug: string) {
        return await this.createQueryBuilder('questions')
            .leftJoin('questions.asked_by', 'asked_by')
            .select(['questions.id', 'questions.slug', 'questions.priority', 'questions.special', 'questions.title', 'questions.content'])
            .addSelect(['asked_by.id', 'asked_by.fullname'])
            .where('questions.slug  = :slug', { slug })
            .andWhere('questions.check_status = :value', { value: CheckStatusEnum.APPROVED })
            .getOne()
    }

    async increaseSeen(userId:number,questionId:number){
        await this.query(`INSERT INTO questions_seen (question_id,user_id) values(${questionId},${userId})`).catch(()=> console.log('this already exists'))
    }
}
