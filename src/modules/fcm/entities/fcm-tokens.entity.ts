import { BaseEntity } from "src/database/enitities/base.entity";
import { UsersEntity } from "src/modules/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'fcm_tokens' })
export class FcmTokensEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    token: string

    @ManyToOne(() => UsersEntity, (user) => user.fcm_tokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity

    @Column({ default: true, nullable: false, type: 'boolean' })
    is_active: boolean

    constructor(init?: Partial<FcmTokensEntity>) {
        super();
        Object.assign(this, init);
    }
}