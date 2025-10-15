import { BaseEntity } from "src/database/enitities/base.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { UsersEntity } from "src/modules/users/entities/user.entity";
import {  Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'answers' })
export class AnswersEntity extends BaseEntity {
    @Column({ type: "text", nullable: false })
    content: string

    @Column({ type: 'text', nullable: true })
    file_path: string;

    @Column({ type: "boolean", nullable: false, default: false })
    is_approved: boolean

    @ManyToOne(() => QuestionsEntity, (event) => event.id)
    @JoinColumn({ name: 'answered_to' })
    answered_to: QuestionsEntity
    
    @ManyToOne(() => UsersEntity, (event) => event.id)
    @JoinColumn({ name: 'answered_by' })
    answered_by: UsersEntity

    constructor(init?: Partial<AnswersEntity>) {
        super();
        Object.assign(this, init);
    }
}