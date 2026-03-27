import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";

export class AnswersUpdateDto {
    @IsOptional()
    @IsString()
    content: string

    @IsOptional()
    @IsString()
    reported_reason: string

    @IsOptional()
    @IsEnum(CheckStatusEnum)
    check_status: CheckStatusEnum

    // @IsOptional()
    // @IsBoolean()
    // delete: boolean
}