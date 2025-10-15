import { RolesEnum } from '../../../common/enums';
import { BaseEntity } from '../../../database/enitities/base.entity';
import { Column, Entity, Unique, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { QuestionsEntity } from 'src/modules/questions/entities/questions.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @Column({
    unique: true,
    nullable: false,
  })
  fullname: string;

  @Column({
    unique: true,
    nullable: false,
  })
  nickname: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: false,
  })
  location: string;

  @Column({
    unique: true,
    type: 'integer',
    nullable: false,
  })
  phone_number: number;
  
  @Column({
    unique: true,
    type: 'integer',
    nullable: false,
  })
  age: number;

  @Column({
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(()=>QuestionsEntity,(event)=>event.asked_by)
  questions:QuestionsEntity[]
  
  constructor(init?:PartialType<UsersEntity>){
    super()
    Object.assign(this,init)
  }
}
