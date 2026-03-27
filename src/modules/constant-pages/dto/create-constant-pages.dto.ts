import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ConstantPagesTypeEnum } from "src/common/enums/constant-pages.enum";

export class ConstantPagesCreateDto {
    @IsNotEmpty()
    @IsString()
    body: string;

    @IsNotEmpty()
    @IsEnum(ConstantPagesTypeEnum)
    type: ConstantPagesTypeEnum;
}