import { IsEnum, IsOptional } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { QuestionsPriorityEnum } from "src/common/enums";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";

export class AnswersQueryDto extends PaginationRequestDto {
    @IsOptional()
    @IsEnum(CheckStatusEnum)
    check_status:CheckStatusEnum

    @IsOptional()
    @IsEnum(QuestionsPriorityEnum)
    priority:QuestionsPriorityEnum
}