import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../entities/user.entity';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';

@Injectable()
export class ManagerUsersRepository extends Repository<UsersEntity> {
  constructor(private datasource: DataSource) {
    super(UsersEntity, datasource.createEntityManager());
  }

  async findAll(paginationDto: PaginationRequestDto) {
    const { page, limit, keyword } = paginationDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.createQueryBuilder('users')
      .select(['users.id', 'users.created_at', 'users.is_verified', 'users.role'])
      .skip(skip)
      .take(limit);
    if (keyword) queryBuilder.where('users.username ILIKE :keyword', { keyword: `%${keyword}%` });
    return await queryBuilder.getManyAndCount();
  }

  async getOneUser(id: number) {
    return await this.createQueryBuilder('users')
      .leftJoin('users.answers', 'answers')
      .leftJoin('users.questions', 'questions')
      .leftJoin('users.profession', 'profession')
      .leftJoin('users.tags', 'tags')
      .select(['users.id', 'users.email', 'users.is_verified', 'users.created_at', 'users.age', 'users.updated_at'])
      .addSelect(['questions.id', 'questions.title', 'questions.created_at', 'questions.check_status'])
      .addSelect(['answers.id', 'answers.title', 'answers.created_at', 'answers.check_status'])
      .addSelect(['profession.id', 'profession.name_ru', 'name_tk', 'name_en'])
      .addSelect(['tags.id', 'tags.name_ru', 'tags.name_en', 'tags.name_ru'])
      .where('users.id =:id',{id})
      .getOne()
  }
}
