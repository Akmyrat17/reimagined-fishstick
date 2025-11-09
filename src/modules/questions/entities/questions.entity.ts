import { Column, Entity, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "../../../database/enitities/base.entity"; // Assumed to contain id, createdAt, updatedAt
import { QuestionsPriorityEnum } from "src/common/enums/questions-priority.enum";
import { UsersEntity } from "src/modules/users/entities/user.entity";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";
import { AnswersEntity } from "src/modules/answers/entites/answers.entity";
import { ClientsEntity } from "src/modules/clients/entities/clients.entity";
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

    @Column({ type: "enum", nullable: false,default:CheckStatusEnum.NOT_CHECKED })
    check_status:CheckStatusEnum

    @Column({ type: "enum", nullable: false, default:QuestionsPriorityEnum.LOW})
    priority: QuestionsPriorityEnum

    @OneToMany(()=>AnswersEntity,(event)=>event.answered_to)
    answers:AnswersEntity[]

    @ManyToOne(()=> UsersEntity, (event) => event.id)
    @JoinColumn({name:'asked_by'})
    asked_by:UsersEntity

    @ManyToMany(()=>ClientsEntity,(event)=>event.id,{onDelete:"CASCADE"})
    recommended:ClientsEntity[]

    @ManyToMany(()=> TagsEntity,(event)=>event.id)
    @JoinTable({
        name:"question_tags",
        joinColumn:{
            name:"question_id",
            referencedColumnName:"id"
        },
        inverseJoinColumn:{
            name:"tag_id",
            referencedColumnName:"id"
        }
    })
    tags:TagsEntity[]
    
    constructor(init?: Partial<QuestionsEntity>) {
        super();
        Object.assign(this, init);
    }
}