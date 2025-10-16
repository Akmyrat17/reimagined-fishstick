import { BaseEntity } from "src/database/enitities/base.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity({ name: "clients" })
export class ClientsEntity extends BaseEntity {
    @Column({ nullable: false, type: "text" })
    company_name: string

    @Column({ nullable: false, type: "text" })
    slug: string

    @Column({ nullable: true, type: "text" })
    description: string

    @Column({ nullable: false, type: "text" })
    location: string

    @Column({ type: "int", nullable: false })
    phone_number: number

    @Column({type:"text",nullable:true})
    web_url:string

    @Column({type:"simple-array",nullable:true})
    file_paths:string[]

    @Column({type:"timestamptz",nullable:true})
    subscription_date:Date

    @Column({type:"boolean",nullable:false,default:false})
    is_active:boolean

    @ManyToMany(()=>QuestionsEntity,(event)=>event.id,{onDelete:"CASCADE"})
    @JoinTable({
        name:"questions_clients",
        joinColumn:{
            name:"client_id",
            referencedColumnName:"id"
        },
        inverseJoinColumn:{
            name:"question_id",
            referencedColumnName:"id"
        }
    })
    recommended_to:QuestionsEntity[]

    constructor(init?:Partial<ClientsEntity>){
        super()
        Object.assign(this,init)
    }
}