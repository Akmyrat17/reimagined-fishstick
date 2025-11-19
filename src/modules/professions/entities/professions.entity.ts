import { BaseEntity } from "src/database/enitities/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { QuestionsEntity } from "../../questions/entities/questions.entity";
import { UsersEntity } from "src/modules/users/entities/user.entity";

@Entity({name:"professions"})
export class ProfessionsEntity extends BaseEntity {
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

    @OneToMany(()=>UsersEntity,(event)=> event.profession)
    users:UsersEntity[]
    
    constructor(init?:Partial<ProfessionsEntity>){
        super()
        Object.assign(this,init)
    }
}