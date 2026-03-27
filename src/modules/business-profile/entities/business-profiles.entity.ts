import { CheckStatusEnum } from "src/common/enums/check-status.enum";
import { ContactsTypeEnum } from "src/common/enums/contacts-type.enum";
import { WeekdaysEnum } from "src/common/enums/weekdays.enum";
import { BaseEntity } from "src/database/enitities/base.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { TagsEntity } from "src/modules/tags/entities/tags.entity";
import { UsersEntity } from "src/modules/users/entities/users.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity({ name: "business_profiles" })
export class BusinessProfilesEntity extends BaseEntity {
    @Column({ nullable: false, type: "text" })
    company_name: string

    @Column({ nullable: true, type: "text" })
    description: string

    @Column({ nullable: false, type: "text" })
    location: string

    @Column({ type: 'jsonb', nullable: true })
    contacts: { type: ContactsTypeEnum, value: string }[]

    @Column({ type: "jsonb", nullable: true })
    working_hours: { type: WeekdaysEnum, value: string }[]

    @Column({ type: "text", nullable: true })
    service: string

    @Column({ type: 'enum', enum: CheckStatusEnum, default: CheckStatusEnum.NOT_CHECKED })
    check_status: CheckStatusEnum

    @Column({ type: "boolean", nullable: false, default: false })
    in_review: boolean

    @Column({ type: "decimal", default: 0 })
    longitude: number

    @Column({ type: "decimal", default: 0 })
    latitude: number

    @Column({ type: "simple-array", nullable: true })
    image_paths: string[]

    @Column({ type: "boolean", nullable: false, default: false })
    is_active: boolean

    @ManyToMany(() => QuestionsEntity, (event) => event.recommended, { onDelete: "CASCADE" })
    @JoinTable({ name: "questions_clients", joinColumn: { name: "client_id", referencedColumnName: "id" }, inverseJoinColumn: { name: "question_id", referencedColumnName: "id" } })
    recommended_to: QuestionsEntity[]

    @ManyToMany(() => TagsEntity, (event) => event.business_profiles, { onDelete: "CASCADE" })
    @JoinTable({ name: "business_profiles_tags", joinColumn: { name: "business_profile_id", referencedColumnName: "id" }, inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" } })
    tags: TagsEntity[]

    @ManyToOne(() => UsersEntity, (user) => user.business_profiles, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: UsersEntity

    constructor(init?: Partial<BusinessProfilesEntity>) {
        super()
        Object.assign(this, init)
    }
}