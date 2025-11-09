import { RolesEnum } from '../../../common/enums';
import { BaseEntity } from '../../../database/enitities/base.entity';
import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { QuestionsEntity } from 'src/modules/questions/entities/questions.entity';
import { ProfessionsEntity } from 'src/modules/professions/entities/professions.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @Column({ unique: true, nullable: false })
  fullname: string;

  @Column({ unique: true, nullable: false })
  nickname: string;

  @Column()
  @Exclude()
  password: string;

  @Column({type:'text',nullable:false})
  email:string

  @Column({type:"boolean",default:false})
  is_verified:boolean

  @Column({ nullable: false })
  location: string;

  @Column({ unique: true, type: 'integer', nullable: false })
  phone_number: number;

  @Column({ unique: true, type: 'integer', nullable: true })
  age: number;

  @Column({ default: RolesEnum.USER })
  role: RolesEnum;

  @OneToMany(() => QuestionsEntity, (event) => event.asked_by)
  questions: QuestionsEntity[]

  @ManyToOne(() => ProfessionsEntity, (event) => event.id)
  @JoinColumn({ name: "profession_id", referencedColumnName: "id" })
  profession: ProfessionsEntity

  constructor(init?: Partial<UsersEntity>) {
    super()
    Object.assign(this, init)
  }
}
