import { BaseEntity } from "src/database/enitities/base.entity";
import { UsersEntity } from "src/modules/users/entities/users.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity({ name: "permissions" })
export class PermissionsEntity extends BaseEntity {
    @Column({ type: "text", nullable: false })
    name: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ type: "text", nullable: false })
    type: string

    @ManyToMany(() => UsersEntity, (user) => user.permissions)
    users: UsersEntity[]

    constructor(init?: Partial<PermissionsEntity>) {
        super()
        Object.assign(this, init)
    }
}