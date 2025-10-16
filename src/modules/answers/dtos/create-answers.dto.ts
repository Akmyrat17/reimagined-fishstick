import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";

export class AnswersCreateDto {
    @IsNotEmpty()
    @IsString()
    content:string

    @IsNotEmpty()
    @IsNumber()
    answered_to_id:number

    @IsNotEmpty()
    @IsNumber()
    answered_by_id:number

    @IsNotEmpty()
    @IsEnum(CheckStatusEnum)
    check_status:CheckStatusEnum
}