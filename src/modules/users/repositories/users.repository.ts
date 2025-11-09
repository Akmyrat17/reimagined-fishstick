import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  constructor(private datasource: DataSource) {
    super(UsersEntity, datasource.createEntityManager());
  }
  async getUserByEmail(email:string){
    return await this.createQueryBuilder('users')
    .select('users.email')
    .where('users.email = :email', { email })
    .getOne();
  }
}
