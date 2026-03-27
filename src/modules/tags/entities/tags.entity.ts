import { BaseEntity } from 'src/database/enitities/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { QuestionsEntity } from '../../questions/entities/questions.entity';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { BusinessProfilesEntity } from 'src/modules/business-profile/entities/business-profiles.entity';

@Entity({ name: 'tags' })
export class TagsEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, default: '' })
  name: string;

  @Column({ type: 'text', nullable: true })
  desc: string;

  @Column({ type: 'text', nullable: false })
  slug: string;

  @ManyToMany(() => QuestionsEntity, (event) => event.tags, { onDelete: 'CASCADE' })
  questions: QuestionsEntity[];

  @ManyToMany(() => UsersEntity, (event) => event.tags, { onDelete: 'CASCADE' })
  users: UsersEntity[];

  @ManyToMany(() => BusinessProfilesEntity, (event) => event.tags, {
    onDelete: 'CASCADE',
  })
  business_profiles: BusinessProfilesEntity[];

  constructor(init?: Partial<TagsEntity>) {
    super();
    Object.assign(this, init);
  }
}
