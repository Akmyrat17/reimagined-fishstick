import { DataSource, Repository } from 'typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { QuestionsEntity } from '../entities/questions.entity';
import { CheckStatusEnum } from 'src/common/enums/check-status.enum';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { QuestionsFilterEnum } from 'src/common/enums/questions-filter.enum';
import { VotesTypeEnum } from 'src/common/enums/votes-type.enum';
import { QuestionsSortEnum } from 'src/common/enums/questions-sort.enum';
import { QuestionsPriorityEnum } from 'src/common/enums';

@Injectable()
export class QuestionsRepository extends Repository<QuestionsEntity> {
    private readonly logger = new Logger(QuestionsRepository.name);
    constructor(private dataSource: DataSource) {
        super(QuestionsEntity, dataSource.createEntityManager());
    }
    async findAll(dto: QuestionsQueryDto, currentUserId?: number): Promise<[QuestionsEntity[], number]> {
        const { keyword, page, limit, sort, priority, filters, tag_ids } = dto;
        const query = this.createQueryBuilder('questions')
            .innerJoin('questions.asked_by', 'asked_by', 'asked_by.deleted_at IS NULL')
            .leftJoin('questions.answers', 'answers', 'answers.deleted_at IS NULL')
            .leftJoin('questions.seen', 'seen')
            .leftJoin('votes', 'v', 'v.target_id = questions.id AND v.type = :type', { type: VotesTypeEnum.QUESTIONS })
            .select(['questions.id', 'questions.priority', 'questions.special', 'questions.content', 'questions.title', 'questions.created_at'])
            .addSelect(['asked_by.id', 'asked_by.fullname'])
            .addSelect('COUNT(DISTINCT answers.id)', 'answers_count')
            .addSelect('COUNT(DISTINCT seen.id)', 'seen')
            .addSelect(
                `(
                SELECT COUNT(*) 
                FROM votes v 
                WHERE v.target_id = questions.id 
                AND v.type = 'questions' 
                AND v.vote = 1
                AND v.deleted_at IS NULL
            )`,
                'upvotes_count'
            )
            .addSelect(
                `(
                SELECT COUNT(*) 
                FROM votes v 
                WHERE v.target_id = questions.id 
                AND v.type = 'questions' 
                AND v.vote = 0
                AND v.deleted_at IS NULL
            )`,
                'downvotes_count'
            )
            .addSelect(
                `(
                SELECT COALESCE(SUM(CASE WHEN v.vote = 1 THEN 1 WHEN v.vote = 0 THEN -1 ELSE 0 END), 0)
                FROM votes v 
                WHERE v.target_id = questions.id 
                AND v.type = 'questions'
                AND v.deleted_at IS NULL
            )`,
                'total_votes_count'
            )
            .addSelect(
                `COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', t.id,
                            'name', t.name
                        )
                    )
                    FROM question_tags qt
                    INNER JOIN tags t ON t.id = qt.tag_id AND t.deleted_at IS NULL
                    WHERE qt.question_id = questions.id
                ),
                '[]'::json
            )`,
                'tags'
            );

        if (currentUserId) {
            query.addSelect(
                `(
                SELECT v.vote 
                FROM votes v 
                WHERE v.target_id = questions.id 
                AND v.type = 'questions' 
                AND v.user_id = ${currentUserId}
                AND v.deleted_at IS NULL
                LIMIT 1
            )`,
                'current_user_vote'
            );
        }

        if (keyword) {
            query.where('questions.title ILIKE :keyword', { keyword: `%${keyword}%` });
        }

        if (priority) {
            query.andWhere('questions.priority = :priority', { priority });
        }

        // Add tag_ids filter
        if (tag_ids && tag_ids.length > 0) {
            query.andWhere(
                `EXISTS (
                SELECT 1 
                FROM question_tags qt 
                WHERE qt.question_id = questions.id 
                AND qt.tag_id IN (:...tag_ids)
            )`,
                { tag_ids }
            );
        }

        query.andWhere('questions.check_status = :value', { value: CheckStatusEnum.APPROVED });
        query.andWhere('questions.deleted_at IS NULL');

        switch (filters) {
            case QuestionsFilterEnum.SEEN:
                query.andWhere('seen.id IS NOT NULL');
                break;
            case QuestionsFilterEnum.LAST_WEEK:
                query.andWhere('questions.created_at >= NOW() - INTERVAL \'7 days\'');
                break;
            case QuestionsFilterEnum.LAST_MONTH:
                query.andWhere('questions.created_at >= NOW() - INTERVAL \'30 days\'');
                break;
            case QuestionsFilterEnum.HAS_ANSWERS:
                query.andWhere('answers.id IS NOT NULL');
                break;
            case QuestionsFilterEnum.HAS_NOT_ANSWERS:
                query.andWhere('answers.id IS NULL');
                break;
        }

        // Get count
        const countQuery = this.createQueryBuilder('questions')
            .innerJoin('questions.asked_by', 'asked_by', 'asked_by.deleted_at IS NULL')
            .leftJoin('questions.answers', 'answers', 'answers.deleted_at IS NULL')
            .leftJoin('questions.seen', 'seen')
            .select('COUNT(DISTINCT questions.id)', 'count');

        if (keyword) {
            countQuery.where('questions.title ILIKE :keyword', { keyword: `%${keyword}%` });
        }
        if (priority) {
            countQuery.andWhere('questions.priority = :priority', { priority });
        }

        // Add tag_ids filter to count query
        if (tag_ids && tag_ids.length > 0) {
            countQuery.andWhere(
                `EXISTS (
                SELECT 1 
                FROM question_tags qt 
                WHERE qt.question_id = questions.id 
                AND qt.tag_id IN (:...tag_ids)
            )`,
                { tag_ids }
            );
        }

        countQuery.andWhere('questions.check_status = :value', { value: CheckStatusEnum.APPROVED });
        countQuery.andWhere('questions.deleted_at IS NULL');

        switch (filters) {
            case QuestionsFilterEnum.SEEN:
                countQuery.andWhere('seen.id IS NOT NULL');
                break;
            case QuestionsFilterEnum.LAST_WEEK:
                countQuery.andWhere('questions.created_at >= NOW() - INTERVAL \'7 days\'');
                break;
            case QuestionsFilterEnum.LAST_MONTH:
                countQuery.andWhere('questions.created_at >= NOW() - INTERVAL \'30 days\'');
                break;
            case QuestionsFilterEnum.HAS_ANSWERS:
                countQuery.andWhere('answers.id IS NOT NULL');
                break;
            case QuestionsFilterEnum.HAS_NOT_ANSWERS:
                countQuery.andWhere('answers.id IS NULL');
                break;
        }

        const countResult = await countQuery.getRawOne();
        const count = parseInt(countResult.count);

        // Apply grouping
        query.groupBy('questions.id').addGroupBy('asked_by.id');

        // Apply sorting

        switch (sort) {
            case QuestionsSortEnum.DATE_ASC:
                query.orderBy('questions.created_at', 'ASC');
                break;
            case QuestionsSortEnum.DATE_DESC:
                query.orderBy('questions.created_at', 'DESC');
                break;
            case QuestionsSortEnum.VOTES_ASC:
                query.orderBy('total_votes_count', 'ASC');
                break;
            case QuestionsSortEnum.VOTES_DESC:
                query.orderBy('total_votes_count', 'DESC');
                break;
            case QuestionsSortEnum.SEEN_ASC:
                query.orderBy('seen', 'ASC');
                break;
            case QuestionsSortEnum.SEEN_DESC:
                query.orderBy('seen', 'DESC');
                break;
            case QuestionsSortEnum.ANSWERS_ASC:
                query.orderBy('answers_count', 'ASC');
                break;
            case QuestionsSortEnum.ANSWERS_DESC:
                query.orderBy('answers_count', 'DESC');
                break;
            case QuestionsSortEnum.RANDOM:
                query.orderBy('RANDOM()');
                break;
            case QuestionsSortEnum.PRIORITY_HIGH:
                query.orderBy(`CASE WHEN questions.priority = '${QuestionsPriorityEnum.HIGH}' THEN 0 ELSE 1 END`, 'ASC');
                break;
            case QuestionsSortEnum.PRIORITY_LOW:
                query.orderBy(`CASE WHEN questions.priority = '${QuestionsPriorityEnum.LOW}' THEN 0 ELSE 1 END`, 'ASC');
                break;
            default:
                query
                    .orderBy('answers_count', 'DESC')
                    .addOrderBy('total_votes_count', 'DESC')
                    .addOrderBy('seen', 'DESC');
                break;
        }
        query.addOrderBy('questions.created_at', 'DESC');

        const entities = await query
            .limit(limit)
            .offset((page - 1) * limit)
            .getRawMany();

        return [entities, count];
    }

    async getSimilarQuestions(questionId: number, page: number = 1, limit: number = 10, currentUserId?: number): Promise<[any[], number]> {
        // First, get the tags of the current question
        const currentQuestion = await this.createQueryBuilder('q')
            .leftJoin('q.tags', 'tags')
            .select(['q.id', 'tags.id'])
            .where('q.id = :questionId', { questionId })
            .getOne();

        if (!currentQuestion || !currentQuestion.tags || currentQuestion.tags.length === 0) {
            return [[], 0];
        }

        const tagIds = currentQuestion.tags.map(tag => tag.id);

        // Build the main query
        const query = this.createQueryBuilder('questions')
            .innerJoin('questions.asked_by', 'asked_by', 'asked_by.deleted_at IS NULL')
            .leftJoin('questions.answers', 'answers', 'answers.deleted_at IS NULL')
            .leftJoin('questions.seen', 'seen')
            .leftJoin('votes', 'v', 'v.target_id = questions.id AND v.type = :type', { type: VotesTypeEnum.QUESTIONS })
            .innerJoin('questions.tags', 'question_tags')
            .select(['questions.id', 'questions.priority', 'questions.special', 'questions.content', 'questions.title', 'questions.created_at', 'questions.reported_reason'])
            .addSelect(['asked_by.id', 'asked_by.fullname'])
            .addSelect('COUNT(DISTINCT answers.id)', 'answers_count')
            .addSelect('COUNT(DISTINCT seen.id)', 'seen')
            .addSelect('SUM(CASE WHEN v.vote = 1 THEN 1 ELSE 0 END)', 'upvotes_count')
            .addSelect('SUM(CASE WHEN v.vote = 0 THEN 1 ELSE 0 END)', 'downvotes_count')
            .addSelect('COUNT(v.id)', 'total_votes_count')
            .addSelect(
                `COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', t.id,
                            'name', t.name
                        )
                    )
                    FROM question_tags qt
                    INNER JOIN tags t ON t.id = qt.tag_id AND t.deleted_at IS NULL
                    WHERE qt.question_id = questions.id
                ),
                '[]'::json
            )`,
                'tags'
            )
            // Count how many tags match (for ordering by relevance)
            .addSelect(
                `COUNT(DISTINCT CASE WHEN question_tags.id IN (:...tagIds) THEN question_tags.id END)`,
                'matching_tags_count'
            );

        if (currentUserId) {
            query.addSelect(
                `MAX(CASE WHEN v.user_id = ${currentUserId} THEN v.vote ELSE NULL END)`,
                'current_user_vote'
            );
        }

        query.where('questions.id != :questionId', { questionId })
            .andWhere('question_tags.id IN (:...tagIds)', { tagIds })
            .andWhere('questions.check_status = :value', { value: CheckStatusEnum.APPROVED })
            .andWhere('questions.deleted_at IS NULL');

        // Count query
        const countQuery = this.createQueryBuilder('questions')
            .innerJoin('questions.tags', 'question_tags')
            .select('COUNT(DISTINCT questions.id)', 'count')
            .where('questions.id != :questionId', { questionId })
            .andWhere('question_tags.id IN (:...tagIds)', { tagIds })
            .andWhere('questions.check_status = :value', { value: CheckStatusEnum.APPROVED })
            .andWhere('questions.deleted_at IS NULL');

        const countResult = await countQuery.getRawOne();
        const count = parseInt(countResult.count);

        // Group and order by relevance (most matching tags first)
        query.groupBy('questions.id')
            .addGroupBy('asked_by.id')
            .orderBy('matching_tags_count', 'DESC')
            .addOrderBy('questions.created_at', 'DESC');

        const entities = await query
            .limit(limit)
            .offset((page - 1) * limit)
            .getRawMany();

        return [entities, count];
    }

    async getMyQuestions(
        userId: number,
        page: number,
        limit: number
    ): Promise<[any[], number]> {
        const query = this.createQueryBuilder('questions')
            .innerJoin('questions.asked_by', 'asked_by', 'asked_by.deleted_at IS NULL')
            .leftJoin('questions.answers', 'answers', 'answers.deleted_at IS NULL')
            .leftJoin('questions.seen', 'seen')
            .leftJoin('votes', 'v', 'v.target_id = questions.id AND v.type = :type', { type: VotesTypeEnum.QUESTIONS })
            .select([
                'questions.id',
                'questions.priority',
                'questions.special',
                'questions.content',
                'questions.title',
                'questions.reported_reason',
                'questions.created_at',
                'questions.check_status'  // Include status so user knows
            ])
            .addSelect(['asked_by.id', 'asked_by.fullname'])
            .addSelect('COUNT(DISTINCT answers.id)', 'answers_count')
            .addSelect('COUNT(DISTINCT seen.id)', 'seen')
            .addSelect('SUM(CASE WHEN v.vote = 1 THEN 1 ELSE 0 END)', 'upvotes_count')
            .addSelect('SUM(CASE WHEN v.vote = 0 THEN 1 ELSE 0 END)', 'downvotes_count')
            .addSelect('COUNT(v.id)', 'total_votes_count')
            .addSelect(
                `COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', t.id,
                            'name', t.name
                        )
                    )
                    FROM question_tags qt
                    INNER JOIN tags t ON t.id = qt.tag_id AND t.deleted_at IS NULL
                    WHERE qt.question_id = questions.id
                ),
                '[]'::json
            )`,
                'tags'
            )
            .addSelect(
                `MAX(CASE WHEN v.user_id = ${userId} THEN v.vote ELSE NULL END)`,
                'current_user_vote'
            );

        // Only filter by user and soft delete
        query.where('questions.asked_by_id = :userId', { userId })
            .andWhere('questions.deleted_at IS NULL');

        // Count query
        const countQuery = this.createQueryBuilder('questions')
            .select('COUNT(questions.id)', 'count')
            .where('questions.asked_by_id = :userId', { userId })
            .andWhere('questions.deleted_at IS NULL');

        const countResult = await countQuery.getRawOne();
        const count = parseInt(countResult.count);

        // Group and order
        query.groupBy('questions.id')
            .addGroupBy('asked_by.id')
            .orderBy('questions.created_at', 'DESC');

        const entities = await query
            .limit(limit)
            .offset((page - 1) * limit)
            .getRawMany();

        return [entities, count];
    }

    async getOne(id: number, userId?: number) {
        try {
            const userVoteSubquery = userId
                ? `(SELECT v.vote FROM votes v WHERE v.target_id = a.id AND v.type = '${VotesTypeEnum.ANSWERS}' AND v.user_id = ${userId} LIMIT 1)`
                : 'NULL'
            const userQuestionVoteSubquery = userId
                ? `(SELECT v.vote FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}' AND v.user_id = ${userId} LIMIT 1)`
                : 'NULL'

            const query = `
            SELECT 
                q.id,
                q.title,
                q.content,
                q.priority,
                q.special,
                q.created_at,
                
                -- Question vote stats (using subqueries instead of SUM with v table)
                COALESCE((SELECT COUNT(*) FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}' AND v.vote = 1), 0) as upvotes_count,
                COALESCE((SELECT COUNT(*) FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}' AND v.vote = 0), 0) as downvotes_count,
                COALESCE((SELECT SUM(CASE WHEN v.vote = 1 THEN 1 WHEN v.vote = 0 THEN -1 ELSE 0 END) FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}'), 0) as total_votes_count,
                
                ${userQuestionVoteSubquery} as current_user_vote,
                
                -- User object
                json_build_object(
                    'id', u.id,
                    'fullname', u.fullname
                ) as asked_by,
                -- Address object
                CASE 
                    WHEN addr.id IS NOT NULL THEN 
                        json_build_object(
                            'id', addr.id,
                            'province', addr.province,
                            'city', addr.city,
                            'district', addr.district,
                            'latitude', addr.latitude,
                            'longitude', addr.longitude
                        )
                    ELSE NULL
                END as address,
                (SELECT COUNT(*) FROM questions_seen qs WHERE qs.question_id = q.id) as seen_count,
                -- Tags array
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', t.id,
                                'name', t.name
                            )
                        )
                        FROM question_tags qt
                        INNER JOIN tags t ON t.id = qt.tag_id AND t.deleted_at IS NULL
                        WHERE qt.question_id = q.id
                    ),
                    '[]'::json
                ) as tags,
                -- Answers array
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', a.id,
                            'content', a.content,
                            'created_at', a.created_at,
                            'answered_by', json_build_object(
                                'id', au.id,
                                'fullname', au.fullname
                            ),
                            'vote_stats', json_build_object(
                            'upvotes', COALESCE((SELECT COUNT(*) FROM votes v WHERE v.target_id = a.id AND v.type = '${VotesTypeEnum.ANSWERS}' AND v.vote = 1), 0),
                            'downvotes', COALESCE((SELECT COUNT(*) FROM votes v WHERE v.target_id = a.id AND v.type = '${VotesTypeEnum.ANSWERS}' AND v.vote = 0), 0),
                            'total_votes', COALESCE((SELECT SUM(CASE WHEN v.vote = 1 THEN 1 WHEN v.vote = 0 THEN -1 ELSE 0 END) FROM votes v WHERE v.target_id = a.id AND v.type = '${VotesTypeEnum.ANSWERS}'), 0)
                            ),
                            'user_vote', ${userVoteSubquery}
                        )
                        ORDER BY a.created_at DESC
                    ) FILTER (WHERE a.id IS NOT NULL),
                    '[]'::json
                ) as answers
            FROM questions q
            LEFT JOIN users u ON q.asked_by_id = u.id AND u.deleted_at IS NULL
            LEFT JOIN addresses addr ON q.address_id = addr.id AND addr.deleted_at IS NULL
            LEFT JOIN answers a ON a.question_id = q.id AND a.deleted_at IS NULL
            LEFT JOIN users au ON a.answered_by_id = au.id AND au.deleted_at IS NULL
            WHERE q.id = $1 
                AND q.deleted_at IS NULL
                AND (q.check_status = $2 OR q.asked_by_id = $3)
            GROUP BY q.id, u.id, addr.id
        `
            const params = userId
                ? [id, CheckStatusEnum.APPROVED, userId]
                : [id, CheckStatusEnum.APPROVED, null]

            const rows = await this.query(query, params)
            return rows[0]
        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.detail || error.message)
        }
    }

    async increaseSeen(userId: number, questionId: number) {
        await this.query(`INSERT INTO questions_seen (question_id, user_id) VALUES ($1, $2)`, [questionId, userId])
            .catch(() => this.logger.warn(`Question with id ${questionId} already seen by user with id ${userId}`))
    }

    async getLastHourQuestions() {
        return await this.query(`
        SELECT COUNT(*) 
        FROM questions 
        WHERE created_at >= NOW() - INTERVAL '1 hour' 
        AND check_status = '${CheckStatusEnum.APPROVED}'
        AND deleted_at IS NULL
    `)
    }

    async findSpecial(): Promise<QuestionsEntity[]> {
        const query = this.createQueryBuilder('questions')
            .innerJoin('questions.asked_by', 'asked_by', 'asked_by.deleted_at IS NULL')
            .leftJoin('questions.answers', 'answers', 'answers.deleted_at IS NULL')
            .leftJoin('questions.seen', 'seen')
            .select(['questions.id', 'questions.priority', 'questions.special::text', 'questions.content', 'questions.title', 'questions.created_at'])
            .addSelect(['asked_by.id', 'asked_by.fullname'])
            .addSelect('COUNT(DISTINCT answers.id)', 'answers_count')
            .addSelect('COUNT(DISTINCT seen.id)', 'seen')
            .addSelect(
                `COALESCE(
                (
                    SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
                    FROM question_tags qt
                    INNER JOIN tags t ON t.id = qt.tag_id AND t.deleted_at IS NULL
                    WHERE qt.question_id = questions.id
                ),
                '[]'::json
            )`,
                'tags'
            )
            .where('questions.special IS NOT NULL')
            .andWhere('questions.check_status = :value', { value: CheckStatusEnum.APPROVED })
            .andWhere('questions.deleted_at IS NULL')
            .groupBy('questions.id')
            .addGroupBy('asked_by.id')
            .orderBy('questions.special', 'DESC')

        return query.getRawMany()
    }
}

