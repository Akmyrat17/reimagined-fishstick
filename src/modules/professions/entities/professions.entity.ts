import { BaseEntity } from "src/database/enitities/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { QuestionsEntity } from "../../questions/entities/questions.entity";
import { UsersEntity } from "src/modules/users/entities/users.entity";

@Entity({ name: "professions" })
export class ProfessionsEntity extends BaseEntity {
    @Column({ type: "text", nullable: false, default: "" })
    name: string

    @Column({ type: "text", nullable: true })
    desc: string

    @Column({ type: "text", nullable: false })
    slug: string

    @OneToMany(() => UsersEntity, (event) => event.profession)
    users: UsersEntity[]

    constructor(init?: Partial<ProfessionsEntity>) {
        super()
        Object.assign(this, init)
    }
}