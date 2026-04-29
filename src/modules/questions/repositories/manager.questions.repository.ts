import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionsEntity } from '../entities/questions.entity';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { QuestionsFilterEnum, VotesTypeEnum } from 'src/common/enums';
import { QuestionsSortEnum } from 'src/common/enums/questions-sort.enum';

@Injectable()
export class ManagerQuestionsRepository extends Repository<QuestionsEntity> {
  constructor(private dataSource: DataSource) {
    super(QuestionsEntity, dataSource.createEntityManager());
  }
  async findAll(dto: QuestionsQueryDto, startDate?: Date, endDate?: Date): Promise<[QuestionsEntity[], number]> {
    const offset = (dto.page - 1) * dto.limit;
    const params: any[] = [];

    const p = () => `$${params.length}`;

    // --- WHERE clause ---
    const conditions: string[] = [];

    if (dto.keyword) {
      params.push(`%${dto.keyword.trim()}%`);
      const param = p(); // capture $N once
      conditions.push(`(q.title ILIKE ${param} OR u.fullname ILIKE ${param})`);
    }
    if (dto.check_status) {
      params.push(dto.check_status);
      conditions.push(`q.check_status = ${p()}`);
    }
    if (dto.priority) {
      params.push(dto.priority);
      conditions.push(`q.priority = ${p()}`);
    }
    if (dto.tag_ids?.length) {
      params.push(dto.tag_ids);
      conditions.push(`t.id = ANY(${p()}::int[])`);
    }

    if (dto.time_range && startDate && endDate) {
      params.push(startDate);
      const p1 = p();
      params.push(endDate);
      const p2 = p();
      conditions.push(`q.created_at BETWEEN ${p1} AND ${p2}`);
    }
    if (dto.filters) {
      switch (dto.filters) {
        case QuestionsFilterEnum.LAST_WEEK:
          params.push(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
          conditions.push(`q.created_at >= ${p()}`);
          break;
        case QuestionsFilterEnum.LAST_MONTH:
          params.push(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
          conditions.push(`q.created_at >= ${p()}`);
          break;
        case QuestionsFilterEnum.HAS_ANSWERS:
          conditions.push(`(SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) > 0`);
          break;
        case QuestionsFilterEnum.HAS_NOT_ANSWERS:
          conditions.push(`(SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) = 0`);
          break;
      }
    }

    const where = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';
    // --- ORDER BY clause ---
    let orderBy = `q.created_at DESC, CASE q.priority WHEN 'high' THEN 1 WHEN 'low' THEN 2 END ASC`;

    switch (dto.sort) {
      case QuestionsSortEnum.DATE_ASC: orderBy = 'q.created_at ASC'; break;
      case QuestionsSortEnum.DATE_DESC: orderBy = 'q.created_at DESC'; break;
      case QuestionsSortEnum.VOTES_ASC: orderBy = 'total_votes_count ASC'; break;
      case QuestionsSortEnum.VOTES_DESC: orderBy = 'total_votes_count DESC'; break;
      case QuestionsSortEnum.ANSWERS_ASC: orderBy = 'answers_count ASC'; break;
      case QuestionsSortEnum.ANSWERS_DESC: orderBy = 'answers_count DESC'; break;
      case QuestionsSortEnum.PRIORITY_HIGH: orderBy = `CASE q.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END ASC`; break;
      case QuestionsSortEnum.PRIORITY_LOW: orderBy = `CASE q.priority WHEN 'low' THEN 1 WHEN 'medium' THEN 2 WHEN 'high' THEN 3 END ASC`; break;
      case QuestionsSortEnum.RANDOM: orderBy = 'RANDOM()'; break;
    }

    // --- MAIN QUERY ---
    const dataQuery = `
    SELECT
      q.id                  AS questions_id,
      q.created_at          AS questions_created_at,
      q.updated_at          AS questions_updated_at,
      q.title               AS questions_title,
      q.content             AS questions_content,
      q.special             AS questions_special,
      q.check_status        AS questions_check_status,
      q.priority            AS questions_priority,
      q.in_review           AS questions_in_review,
      q.reported_reason     AS questions_reported_reason,

      u.id                  AS asked_by_id,
      u.fullname            AS asked_by_fullname,

      -- Tags aggregated
      COALESCE(
        JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', t.id, 'name', t.name))
        FILTER (WHERE t.id IS NOT NULL), '[]'
      ) AS tags,

      -- Answers count
      (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id)::int AS answers_count,

      -- Votes
      (SELECT COUNT(*) FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}' AND v.vote = 1)::int AS upvotes_count,
      (SELECT COUNT(*) FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}' AND v.vote = 0)::int AS downvotes_count,
      (SELECT COALESCE(SUM(CASE WHEN v.vote = 1 THEN 1 WHEN v.vote = 0 THEN -1 ELSE 0 END), 0)
       FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}')::int AS total_votes_count,

      -- Current user vote
      -- (SELECT v.vote FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}' AND v.user_id = ${0} LIMIT 1) AS current_user_vote,

      -- Seen (adjust table name if different)
      (SELECT COUNT(*) FROM questions_seen qv WHERE qv.question_id = q.id)::int AS seen

    FROM questions q
    LEFT JOIN users u ON u.id = q.asked_by_id
    LEFT JOIN question_tags qt ON qt.question_id = q.id
    LEFT JOIN tags t ON t.id = qt.tag_id

    ${where}
    GROUP BY q.id, u.id
    ORDER BY ${orderBy}
    LIMIT ${dto.limit} OFFSET ${offset}
  `;

    // --- COUNT QUERY ---
    const countQuery = `
    SELECT COUNT(DISTINCT q.id)::int AS total
    FROM questions q
    LEFT JOIN users u ON u.id = q.asked_by_id
    LEFT JOIN question_tags qt ON qt.question_id = q.id
    LEFT JOIN tags t ON t.id = qt.tag_id
    ${where}
  `;

    const [rows, countResult] = await Promise.all([
      this.query(dataQuery, params),
      this.query(countQuery, params),
    ]);

    return [rows, countResult[0]?.total ?? 0];
  }


  async getOne(id: number) {
    return await this.createQueryBuilder('questions')
      .leftJoin('questions.asked_by', 'asked_by')
      .select([
        'questions.id',
        'questions.created_at',
        'questions.updated_at',
        'questions.priority',
        'questions.special',
        'questions.check_status',
        'questions.title',
        'questions.content',
      ])
      .addSelect(['asked_by.id', 'asked_by.fullname'])
      .where('questions.id  = :id', { id })
      .andWhere('questions.in_review = :in_review', { in_review: false })
      .getOne();
  }

  async setNullPreviousSpecial(date: string): Promise<number | null> {
    const result = await this.createQueryBuilder('questions')
      .update()
      .set({ special: null })
      .where('questions.special = :date', { date })
      .returning('id')
      .execute()

    return result.raw[0]?.id ?? null
  }

  // total and total unanswered questions for dashboard stats
  async getTotalQuestions() {
    const result = await this.createQueryBuilder('questions')
      .leftJoin('questions.answers', 'answers')
      .select("COUNT(DISTINCT questions.id)", "total")
      .addSelect(
        "COUNT(DISTINCT CASE WHEN answers.id IS NULL THEN questions.id END)",
        "total_unanswered"
      )
      .addSelect("COUNT(DISTINCT CASE WHEN questions.check_status = 'approved' THEN questions.id END)", "total_approved")
      .addSelect("COUNT(DISTINCT CASE WHEN questions.check_status = 'not-checked' THEN questions.id END)", "total_not_checked")
      .addSelect("COUNT(DISTINCT CASE WHEN questions.check_status = 'reported' THEN questions.id END)", "total_reported")
      .getRawOne();
    return result;
  }

  // questions.repository.ts
  async getQuestionsChartData(startDate: Date, endDate: Date, truncUnit: 'hour' | 'day' | 'month', labelFormat: string) {
    const result = await this.createQueryBuilder('questions')
      .select(`TO_CHAR(DATE_TRUNC('${truncUnit}', questions.created_at), '${labelFormat}')`, 'label')
      .addSelect(`DATE_TRUNC('${truncUnit}', questions.created_at)`, 'period')
      .addSelect("COUNT(questions.id)", "total")
      .addSelect("COUNT(CASE WHEN questions.check_status = 'approved' THEN 1 END)", "approved")
      .addSelect("COUNT(CASE WHEN questions.check_status = 'not-checked' THEN 1 END)", "not_checked")
      .addSelect("COUNT(CASE WHEN questions.check_status = 'reported' THEN 1 END)", "reported")
      .where('questions.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    return result.map(({ label, total, approved, not_checked, reported }) => ({
      label,
      total: parseInt(total),
      approved: parseInt(approved),
      not_checked: parseInt(not_checked),
      reported: parseInt(reported),
    }));
  }

  async getQuestionsLastHourChart() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const questions = await this.createQueryBuilder('questions')
      .select(['questions.created_at', 'questions.check_status'])
      .where('questions.created_at BETWEEN :oneHourAgo AND :now', { oneHourAgo, now })
      .getMany();

    // Generate 10-min buckets
    const buckets: Record<string, number> = {};
    const current = new Date(oneHourAgo);
    current.setSeconds(0, 0);
    current.setMinutes(Math.floor(current.getMinutes() / 10) * 10);

    while (current <= now) {
      const label = `${current.getHours().toString().padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')}`;
      buckets[label] = 0;
      current.setMinutes(current.getMinutes() + 10);
    }

    // Fill buckets
    questions.forEach(q => {
      const d = new Date(q.created_at);
      d.setMinutes(Math.floor(d.getMinutes() / 10) * 10);
      d.setSeconds(0, 0);
      const label = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      if (buckets[label] !== undefined) buckets[label]++;
    });

    return {
      total: questions.length,
      buckets: Object.entries(buckets).map(([label, count]) => ({ label, count })),
    };
  }

  async getAllByUserId(userId: number): Promise<QuestionsEntity[]> {
    const params: any[] = [userId];

    const query = `
    SELECT
      q.id                  AS questions_id,
      q.created_at          AS questions_created_at,
      q.updated_at          AS questions_updated_at,
      q.title               AS questions_title,
      q.content             AS questions_content,
      q.special             AS questions_special,
      q.check_status        AS questions_check_status,
      q.priority            AS questions_priority,
      q.in_review           AS questions_in_review,
      q.reported_reason     AS questions_reported_reason,

      u.id                  AS asked_by_id,
      u.fullname            AS asked_by_fullname,

      -- Tags aggregated
      COALESCE(
        JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', t.id, 'name', t.name))
        FILTER (WHERE t.id IS NOT NULL), '[]'
      ) AS tags,

      -- Answers count
      (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id)::int AS answers_count,

      -- Votes
      (SELECT COUNT(*) FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}' AND v.vote = 1)::int AS upvotes_count,
      (SELECT COUNT(*) FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}' AND v.vote = 0)::int AS downvotes_count,
      (SELECT COALESCE(SUM(CASE WHEN v.vote = 1 THEN 1 WHEN v.vote = 0 THEN -1 ELSE 0 END), 0)
       FROM votes v WHERE v.target_id = q.id AND v.type = '${VotesTypeEnum.QUESTIONS}')::int AS total_votes_count,

      -- Seen
      (SELECT COUNT(*) FROM questions_seen qv WHERE qv.question_id = q.id)::int AS seen

    FROM questions q
    LEFT JOIN users u ON u.id = q.asked_by_id
    LEFT JOIN question_tags qt ON qt.question_id = q.id
    LEFT JOIN tags t ON t.id = qt.tag_id

    WHERE q.asked_by_id = $1
    GROUP BY q.id, u.id
    ORDER BY q.created_at DESC, CASE q.priority WHEN 'high' THEN 1 WHEN 'low' THEN 2 END ASC
  `;

    return await this.query(query, params);
  }
}

