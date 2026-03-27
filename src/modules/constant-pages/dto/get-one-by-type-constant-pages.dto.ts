import { IsEnum, IsNotEmpty } from "class-validator";
import { ConstantPagesTypeEnum } from "src/common/enums/constant-pages.enum";

export class ConstantPagesGetOneByTypeDto {
    @IsNotEmpty()
    @IsEnum(ConstantPagesTypeEnum)
    type: ConstantPagesTypeEnum
}