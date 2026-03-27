import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";

export class AnswersCreateDto {
    @IsNotEmpty()
    @IsString()
    content: string

    @IsNotEmpty()
    @IsNumber()
    question_id: number

    @IsOptional()
    @IsEnum(CheckStatusEnum)
    check_status: CheckStatusEnum
}