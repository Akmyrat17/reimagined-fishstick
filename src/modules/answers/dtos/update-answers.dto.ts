import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional,  IsString } from "class-validator";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";

export class AnswersUpdateDto {
    @IsOptional()
    @IsString()
    content:string

    @IsOptional()
    @IsNumber()
    answered_to_id:number

    @IsOptional()
    @IsNumber()
    answered_by_id:number

    @IsOptional()
    @IsEnum(CheckStatusEnum)
    check_status:CheckStatusEnum
}