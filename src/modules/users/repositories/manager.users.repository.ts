import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../entities/user.entity';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';

@Injectable()
export class ManagerUsersRepository extends Repository<UsersEntity> {
  constructor(private datasource: DataSource) {
    super(UsersEntity, datasource.createEntityManager());
  }
  async getUserByPhone(phone_number: number) {
    return await this.createQueryBuilder('users')
      .select('users.phone_number')
      .where('users.phone_number = :phone_number', { phone_number })
      .getOne();
  }

  async findAll(paginationDto: PaginationRequestDto) {
    const { page, limit, keyword } = paginationDto;
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.createQueryBuilder('users')
      .skip(skip)
      .take(limit);
    
    if (keyword) {
      queryBuilder.where('users.username ILIKE :keyword', { keyword: `%${keyword}%` });
    }
    
    return await queryBuilder.getManyAndCount();
  }
}
