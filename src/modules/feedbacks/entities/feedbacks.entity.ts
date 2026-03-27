import { BaseEntity } from "src/database/enitities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'feedbacks' })
export class FeedbacksEntity extends BaseEntity {
    @Column({ type: 'text', nullable: false })
    content: string

    @Column({ type: 'text', nullable: false })
    email: string

    @Column({ type: 'boolean', nullable: false, default: false })
    is_read: boolean

    @Column({ type: 'text', nullable: true })
    reply: string
}