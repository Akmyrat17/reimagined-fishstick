import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../database/enitities/base.entity"; // Assumed to contain id, createdAt, updatedAt
import { QuestionsPriorityEnum } from "src/common/enums/questions-priority.enum";
import { UsersEntity } from "src/modules/users/entities/user.entity";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";

@Entity({ name: 'questions' })
export class QuestionsEntity extends BaseEntity {
    @Column({ type: "text", nullable: false })
    title: string

    @Column({ type: 'text', nullable: true })
    file_path: string;

    @Column({ type: "text", nullable: false })
    content: string

    @Column({ type: "text", nullable: false })
    slug: string

    @Column({ type: "enum", nullable: false,default:CheckStatusEnum.NOT_CHECKED })
    check_status:CheckStatusEnum

    @Column({ type: "enum", nullable: false, default:QuestionsPriorityEnum.LOW})
    priority: QuestionsPriorityEnum

    @ManyToOne(()=> UsersEntity, (event) => event.id)
    @JoinColumn({name:'asked_by'})
    asked_by:UsersEntity

    constructor(init?: Partial<QuestionsEntity>) {
        super();
        Object.assign(this, init);
    }
}