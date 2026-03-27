import { ConstantPagesTypeEnum } from "src/common/enums/constant-pages.enum";
import { BaseEntity } from "src/database/enitities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "constant-pages" })
export class ConstantPagesEntity extends BaseEntity {
    @Column({ type: "text", nullable: false })
    body: string

    @Column({ type: "enum", enum: ConstantPagesTypeEnum, nullable: false, default: ConstantPagesTypeEnum.ABOUT_US })
    type: ConstantPagesTypeEnum

    constructor(init?: Partial<ConstantPagesEntity>) { super(); Object.assign(this, init) }
}