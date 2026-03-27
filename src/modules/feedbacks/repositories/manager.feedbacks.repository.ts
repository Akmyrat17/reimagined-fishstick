import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { FeedbacksEntity } from '../entities/feedbacks.entity';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';

@Injectable()
export class ManagerFeedbacksRepository extends Repository<FeedbacksEntity> {
  constructor(private dataSource: DataSource) {
    super(FeedbacksEntity, dataSource.createEntityManager());
  }

  async getAll(dto: PaginationRequestDto): Promise<[FeedbacksEntity[], number]> {
    const { page, limit, keyword } = dto;
    const query = this.createQueryBuilder('feedbacks').select([
      'feedbacks.id',
      'feedbacks.is_read',
      'feedbacks.reply',
      'feedbacks.content',
      'feedbacks.created_at',
      'feedbacks.email',
    ]);
    if (keyword)
      query.andWhere(
        new Brackets((qb) => {
          qb.where(`feedbacks.content ILIKE :keyword`, {
            keyword: `%${keyword}%`,
          })
            .orWhere(`feedbacks.email ILIKE :keyword`, {
              keyword: `%${keyword}%`,
            })
            .orWhere(`feedbacks.reply ILIKE :keyword`, {
              keyword: `%${keyword}%`,
            });
        }),
      );
    const total = await query.getCount();
    const entities = await query
      .take(limit)
      .offset((page - 1) * limit)
      .getMany();
    return [entities, total];
  }
}
