import { CheckStatusEnum } from "src/common/enums/check-status.enum";
import { BaseEntity } from "src/database/enitities/base.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { UsersEntity } from "src/modules/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'answers' })
export class AnswersEntity extends BaseEntity {
    @Column({ type: "text", nullable: false })
    content: string

    @Column({ type: "enum", nullable: false, default: CheckStatusEnum.NOT_CHECKED, enum: CheckStatusEnum })
    check_status: CheckStatusEnum

    @Column({ type: "text", nullable: true })
    reported_reason: string

    @ManyToOne(() => QuestionsEntity, (event) => event.id, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'question_id' })
    question: QuestionsEntity

    @ManyToOne(() => UsersEntity, (event) => event.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'answered_by_id' })
    answered_by: UsersEntity

    constructor(init?: Partial<AnswersEntity>) {
        super();
        Object.assign(this, init);
    }
}