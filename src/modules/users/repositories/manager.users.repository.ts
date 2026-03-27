import { Brackets, DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../entities/users.entity';
import { UsersQueryDto } from '../dtos/query-users.dto';

@Injectable()
export class ManagerUsersRepository extends Repository<UsersEntity> {
  constructor(private datasource: DataSource) {
    super(UsersEntity, datasource.createEntityManager());
  }

  async findAll(paginationDto: UsersQueryDto): Promise<[UsersEntity[], number]> {
    const { page, limit, keyword, is_verified } = paginationDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.createQueryBuilder('users')
      .leftJoin('users.address', 'address')
      // .leftJoin('users.business_profiles', 'business_profiles')
      .leftJoin('users.permissions', 'permissions')
      .leftJoin('users.profession', 'profession')
      .select(['users.id', 'users.created_at', 'users.is_verified', 'users.role', 'users.email', 'users.fullname', 'users.age'])
      // .addSelect(['business_profiles.id'])
      .addSelect(['permissions.id', 'permissions.name', 'permissions.description'])
      .addSelect(['profession.id', 'profession.name'])
      .addSelect(['address.id', 'address.province', 'address.city', 'address.district'])
    if (keyword) queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where(`users.fullname ILIKE :keyword`, { keyword: `%${keyword}%` })
          .orWhere(`users.email ILIKE :keyword`, { keyword: `%${keyword}%` })
          .orWhere(`address.province ILIKE :keyword`, { keyword: `%${keyword}%` })
          .orWhere(`address.city ILIKE :keyword`, { keyword: `%${keyword}%` })
          .orWhere(`address.district ILIKE :keyword`, { keyword: `%${keyword}%` })
      })
    );
    if (is_verified === true || is_verified === false) queryBuilder.andWhere("users.is_verified = :value", { value: is_verified })
    const total = await queryBuilder.getCount();
    const data = await queryBuilder.skip(skip).take(limit).getMany();
    return [data, total];
  }

  async getOneUser(id: number) {
    return await this.createQueryBuilder('users')
      .leftJoin('users.answers', 'answers')
      .leftJoin('users.questions', 'questions')
      .leftJoin('user.business_profiles', 'business_profiles')
      .select(['users.id', 'users.email', 'users.is_verified', 'users.created_at', 'users.age', 'users.updated_at', 'users.fullname', 'users.role', 'users.is_blocked'])
      .addSelect(['questions.id', 'questions.title', 'questions.created_at', 'questions.check_status'])
      .addSelect(['answers.id', 'answers.content', 'answers.created_at', 'answers.check_status'])
      .where('users.id =:id', { id })
      .getOne()
  }
}
