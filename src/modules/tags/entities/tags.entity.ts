import { BaseEntity } from "src/database/enitities/base.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { QuestionsEntity } from "../../questions/entities/questions.entity";
import { UsersEntity } from "src/modules/users/entities/user.entity";

@Entity({name:"tags"})
export class TagsEntity extends BaseEntity {
    @Column({type:"text",nullable:false})
    name_ru:string

    @Column({type:"text",nullable:false})
    name_tk:string

    @Column({type:"text",nullable:false})
    name_en:string

    @Column({type:"text",nullable:false})
    desc_ru:string

    @Column({type:"text",nullable:false})
    desc_tk:string

    @Column({type:"text",nullable:false})
    desc_en:string

    @Column({type:"text",nullable:false})
    slug:string

    @ManyToMany(()=>QuestionsEntity,(event)=>event.id)
    questions:QuestionsEntity[]
    
    @ManyToMany(()=>UsersEntity,(event)=>event.id)
    users:UsersEntity[]
    
    constructor(init?:Partial<TagsEntity>){
        super()
        Object.assign(this,init)
    }
}