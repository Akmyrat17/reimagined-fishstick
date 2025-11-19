import { RolesEnum } from '../../../common/enums';
import { BaseEntity } from '../../../database/enitities/base.entity';
import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { QuestionsEntity } from 'src/modules/questions/entities/questions.entity';
import { ProfessionsEntity } from 'src/modules/professions/entities/professions.entity';
import { ManyToMany, JoinTable } from 'typeorm';
import { TagsEntity } from 'src/modules/tags/entities/tags.entity';
import { AnswersEntity } from 'src/modules/answers/entites/answers.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  fullname: string;

  // @Column({ unique: true, nullable: false })
  // nickname: string;

  @Column()
  @Exclude()
  password: string;

  @Column({type:'text',nullable:false})
  email:string

  @Column({type:"boolean",default:false})
  is_verified:boolean

  // @Column({ nullable: false })
  // location: string;

  // @Column({ unique: true, type: 'integer', nullable: false })
  // phone_number: number;

  @Column({ unique: true, type: 'integer', nullable: true })
  age: number;

  @Column({ default: RolesEnum.USER })
  role: RolesEnum;

  @OneToMany(() => QuestionsEntity, (event) => event.asked_by)
  questions: QuestionsEntity[]

  @OneToMany(()=> AnswersEntity,(event) => event.answered_by)
  answers:AnswersEntity[]

  @ManyToOne(() => ProfessionsEntity, (event) => event.id)
  @JoinColumn({ name: "profession_id", referencedColumnName: "id" })
  profession: ProfessionsEntity

  @ManyToMany(() => TagsEntity, (event) => event.users,{onDelete:"CASCADE"})
  @JoinTable({
    name: "user_tags",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags: TagsEntity[]
  
  constructor(init?: Partial<UsersEntity>) {
    super()
    Object.assign(this, init)
  }
}
