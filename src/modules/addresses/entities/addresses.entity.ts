import { BaseEntity } from "src/database/enitities/base.entity";
import { QuestionsEntity } from "src/modules/questions/entities/questions.entity";
import { UsersEntity } from "src/modules/users/entities/users.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: "addresses" })
export class AddressesEntity extends BaseEntity {
    @Column({ type: "varchar", length: 200, nullable: false })
    province: string

    @Column({ type: "varchar", length: 500, nullable: true })
    city: string

    @Column({ type: "varchar", length: 500, nullable: true })
    district: string

    @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
    latitude: number

    @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
    longitude: number

    @OneToMany(() => UsersEntity, (user) => user.address, { onDelete: "SET NULL" })
    users: UsersEntity[]

    @OneToMany(() => QuestionsEntity, (question) => question.address)
    questions: QuestionsEntity[]

    constructor(init?: Partial<AddressesEntity>) {
        super();
        Object.assign(this, init);
    }
}