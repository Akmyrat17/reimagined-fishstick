import { VotesTypeEnum } from "src/common/enums/votes-type.enum";
import { BaseEntity } from "src/database/enitities/base.entity";
import { UsersEntity } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: "votes" })
export class VotesEntity extends BaseEntity {
    @Column({ type: 'int', default: 0, nullable: false })
    vote: number

    @Column({ type: "int", default: 0, nullable: false })
    target_id: number

    @Column({ type: 'enum', default: VotesTypeEnum.QUESTIONS, nullable: false,enum:VotesTypeEnum })
    type: VotesTypeEnum

    @ManyToOne(() => UsersEntity, (event) => event.votes)
    @JoinColumn({ name: 'user_id', referencedColumnName: "id" })
    user: UsersEntity

    constructor(init?: Partial<VotesEntity>) {
        super()
        Object.assign(this, init)
    }
}