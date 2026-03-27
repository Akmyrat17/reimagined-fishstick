import { RolesEnum } from '../../../common/enums';
import { BaseEntity } from '../../../database/enitities/base.entity';
import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { QuestionsEntity } from 'src/modules/questions/entities/questions.entity';
import { ProfessionsEntity } from 'src/modules/professions/entities/professions.entity';
import { ManyToMany, JoinTable } from 'typeorm';
import { TagsEntity } from 'src/modules/tags/entities/tags.entity';
import { AnswersEntity } from 'src/modules/answers/entities/answers.entity';
import { VotesEntity } from 'src/modules/votes/entities/votes.entity';
import { AddressesEntity } from 'src/modules/addresses/entities/addresses.entity';
import { FcmTokensEntity } from 'src/modules/fcm/entities/fcm-tokens.entity';
import { BusinessProfilesEntity } from 'src/modules/business-profile/entities/business-profiles.entity';
import { PermissionsEntity } from 'src/modules/permissions/entities/permissions.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  fullname: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string

  @Column({ type: "boolean", default: false })
  is_verified: boolean

  @Column({ type: "boolean", default: false })
  is_blocked: boolean

  @Column({ type: 'integer', nullable: true })
  age: number;

  @Column({ default: RolesEnum.USER })
  role: RolesEnum;

  @OneToMany(() => QuestionsEntity, (event) => event.asked_by)
  questions: QuestionsEntity[]

  @OneToMany(() => AnswersEntity, (event) => event.answered_by)
  answers: AnswersEntity[]

  @ManyToOne(() => AddressesEntity, (address) => address.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'address_id', referencedColumnName: "id" })
  address: AddressesEntity

  @Column({ type: 'int', array: true, default: [] })
  removed_notifications: number[];

  @OneToMany(() => VotesEntity, (event) => event.vote)
  votes: VotesEntity[]

  @ManyToMany(() => QuestionsEntity, (event) => event.seen, { onDelete: "CASCADE" })
  questions_seen: QuestionsEntity[]

  @OneToMany(() => FcmTokensEntity, (fcmToken) => fcmToken.user)
  fcm_tokens: FcmTokensEntity[]

  @ManyToOne(() => ProfessionsEntity, (event) => event.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: "profession_id", referencedColumnName: "id" })
  profession: ProfessionsEntity

  @OneToMany(() => BusinessProfilesEntity, (event) => event.user, { onDelete: 'SET NULL' })
  business_profiles: BusinessProfilesEntity[]

  @ManyToMany(() => PermissionsEntity, (permission) => permission.users, { onDelete: 'SET NULL' })
  @JoinTable({ name: "user_permissions", joinColumn: { name: "user_id", referencedColumnName: "id" }, inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" } })
  permissions: PermissionsEntity[]

  @ManyToMany(() => TagsEntity, (event) => event.users, { onDelete: "CASCADE" })
  @JoinTable({ name: "user_tags", joinColumn: { name: "user_id", referencedColumnName: "id" }, inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" } })
  tags: TagsEntity[]

  constructor(init?: Partial<UsersEntity>) {
    super()
    Object.assign(this, init)
  }
}
