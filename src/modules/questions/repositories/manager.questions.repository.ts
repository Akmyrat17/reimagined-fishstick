import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionsEntity } from '../entities/questions.entity';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';

@Injectable()
export class ManagerQuestionsRepository extends Repository<QuestionsEntity> {
  constructor(private dataSource: DataSource) {
    super(QuestionsEntity, dataSource.createEntityManager());
  }

  async findAll(dto: QuestionsQueryDto): Promise<[QuestionsEntity[], number]> {
    const query = this.createQueryBuilder('questions')
      .leftJoin('questions.asked_by', 'asked_by')
      .leftJoin("questions.answers", "answers")
      .leftJoin('questions.tags', "tags")
      .leftJoin("questions.address", "address")
      .select([
        'questions.id',
        'questions.created_at',
        'questions.updated_at',
        'questions.in_review',
        'questions.priority',
        'questions.special',
        'questions.check_status',
        'questions.title',
        'questions.content',
      ])
      .addSelect(['address.id', 'address.province', 'address.city', 'address.district'])
      .addSelect(["answers.id"])
      .addSelect(["tags.id", 'tags.name'])
      .addSelect(['asked_by.id', 'asked_by.fullname']);
    if (dto.keyword && dto.keyword != '') {
      query.where(`questions.title ILIKE :keyword`, {
        keyword: `%${dto.keyword}%`,
      });
    }
    if (dto.check_status)
      query.andWhere('questions.check_status = :value', {
        value: dto.check_status,
      });
    if (dto.priority)
      query.andWhere('questions.priority = :value', { value: dto.priority });
    const total = await query.getCount();
    query.orderBy('questions.created_at', 'DESC').addOrderBy('questions.updated_at', "DESC")
    const entities = await query
      .take(dto.limit)
      .offset((dto.page - 1) * dto.limit)
      .getMany();
    return [entities, total];
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
      .andWhere('questions.deleted_at IS NULL')
      .returning('id')
      .execute()

    return result.raw[0]?.id ?? null
  }
}
