import { RolesEnum } from '../../../common/enums';
import { BaseEntity } from '../../../database/enitities/base.entity';
import { Column, Entity, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    unique: true,
    type: 'integer',
    nullable: false,
  })
  phone_number: number;

  @Column({
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}
