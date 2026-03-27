import { Column, Entity, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "../../../database/enitities/base.entity"; // Assumed to contain id, createdAt, updatedAt
import { QuestionsPriorityEnum } from "src/common/enums/questions-priority.enum";
import { UsersEntity } from "src/modules/users/entities/users.entity";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";
import { AnswersEntity } from "src/modules/answers/entities/answers.entity";
import { BusinessProfilesEntity } from "src/modules/business-profile/entities/business-profiles.entity";
import { TagsEntity } from "src/modules/tags/entities/tags.entity";
import { AddressesEntity } from "src/modules/addresses/entities/addresses.entity";

@Entity({ name: 'questions' })
export class QuestionsEntity extends BaseEntity {
    @Column({ type: "text", nullable: false })
    title: string

    @Column({ type: "text", nullable: false })
    content: string

    @Column({ type: "date", nullable: true })
    special: string

    @Column({ type: "enum", nullable: false, default: CheckStatusEnum.NOT_CHECKED, enum: CheckStatusEnum })
    check_status: CheckStatusEnum

    @Column({ type: "enum", nullable: false, default: QuestionsPriorityEnum.LOW, enum: QuestionsPriorityEnum })
    priority: QuestionsPriorityEnum

    @Column({ type: "text", nullable: true })
    reported_reason: string

    @Column({ type: "boolean", default: false })
    in_review: boolean

    @ManyToMany(() => UsersEntity, (event) => event.questions_seen, { onDelete: 'CASCADE' })
    @JoinTable({ name: 'questions_seen', joinColumn: { name: "question_id", referencedColumnName: "id" }, inverseJoinColumn: { name: 'user_id', referencedColumnName: "id" } })
    seen: UsersEntity[]

    @OneToMany(() => AnswersEntity, (event) => event.question, { onDelete: 'NO ACTION' })
    answers: AnswersEntity[]

    @ManyToOne(() => AddressesEntity, (address) => address.questions, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'address_id' })
    address: AddressesEntity

    @ManyToOne(() => UsersEntity, (event) => event.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'asked_by_id' })
    asked_by: UsersEntity

    @ManyToMany(() => BusinessProfilesEntity, (event) => event.recommended_to, { onDelete: "CASCADE" })
    recommended: BusinessProfilesEntity[]

    @ManyToMany(() => TagsEntity, (event) => event.questions, { onDelete: "CASCADE" })
    @JoinTable({ name: "question_tags", joinColumn: { name: "question_id", referencedColumnName: "id" }, inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" } })
    tags: TagsEntity[]

    constructor(init?: Partial<QuestionsEntity>) {
        super();
        Object.assign(this, init);
    }
}