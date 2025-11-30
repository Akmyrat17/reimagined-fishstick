import { Column, Entity, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "../../../database/enitities/base.entity"; // Assumed to contain id, createdAt, updatedAt
import { QuestionsPriorityEnum } from "src/common/enums/questions-priority.enum";
import { UsersEntity } from "src/modules/users/entities/user.entity";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";
import { AnswersEntity } from "src/modules/answers/entites/answers.entity";
import { ClientsEntity } from "src/modules/business-profile/entities/business-profiles.entity";
import { TagsEntity } from "src/modules/tags/entities/tags.entity";

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

    @Column({ type: 'timestamptz', nullable: true })
    special: Date

    @Column({ type: "enum", nullable: false, default: CheckStatusEnum.NOT_CHECKED, enum: CheckStatusEnum })
    check_status: CheckStatusEnum

    @Column({ type: "enum", nullable: false, default: QuestionsPriorityEnum.LOW, enum: QuestionsPriorityEnum })
    priority: QuestionsPriorityEnum

    @Column({ type: "text", nullable: true })
    reported_reason: string

    @Column({type:"boolean",default:false})
    in_review:boolean
    
    @ManyToMany(()=>UsersEntity,(event)=>event.questions_seen,{onDelete:'CASCADE'})
    @JoinTable({
        name:'questions_seen',
        joinColumn:{
            name:"question_id",
            referencedColumnName:"id"
        },
        inverseJoinColumn:{
            name:'user_id',
            referencedColumnName:"id"
        }
    })
    seen: UsersEntity[]

    @OneToMany(() => AnswersEntity, (event) => event.answered_to)
    answers: AnswersEntity[]

    @ManyToOne(() => UsersEntity, (event) => event.id)
    @JoinColumn({ name: 'asked_by' })
    asked_by: UsersEntity

    @ManyToMany(() => ClientsEntity, (event) => event.recommended_to, { onDelete: "CASCADE" })
    recommended: ClientsEntity[]

    @ManyToMany(() => TagsEntity, (event) => event.questions, { onDelete: "CASCADE" })
    @JoinTable({
        name: "question_tags",
        joinColumn: {
            name: "question_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "tag_id",
            referencedColumnName: "id"
        }
    })
    tags: TagsEntity[]

    constructor(init?: Partial<QuestionsEntity>) {
        super();
        Object.assign(this, init);
    }
}