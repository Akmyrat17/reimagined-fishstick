import { NotificationsTypeEnum } from "src/common/enums/notifications-type.enum";
import { BaseEntity } from "src/database/enitities/base.entity";
import { UsersEntity } from "src/modules/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'notifications' })
export class NotificationsEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    body: string;

    @Column({ type: 'enum', enum: NotificationsTypeEnum, default: NotificationsTypeEnum.ALL })
    type: NotificationsTypeEnum;

    @ManyToOne(() => UsersEntity, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity;
}