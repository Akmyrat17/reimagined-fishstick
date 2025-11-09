import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../entities/user.entity';
import { LangEnum } from 'src/common/enums';

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

  async getProfile(id:number,lang:LangEnum){
    return await this.createQueryBuilder('users')
    .leftJoin('users.profession', 'profession')
    .leftJoin('users.tags', 'tags')
    .select('users.id,users.fullname,users.email,users.age')
    .addSelect([`profession.id,profession.name_${lang}`])
    .addSelect([`tags.id,tags.name_${lang}`])
    .where('users.id = :id', { id })
    .getOne();
  }
}
