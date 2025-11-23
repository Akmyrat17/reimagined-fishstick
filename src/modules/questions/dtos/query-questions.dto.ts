import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { QuestionsPriorityEnum } from "src/common/enums";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";
import { QuestionsSortEnum } from "src/common/enums/questions-sort.enum";

export class QuestionsQueryDto extends PaginationRequestDto {
    @IsOptional()
    @IsEnum(CheckStatusEnum)
    check_status:CheckStatusEnum

    @IsOptional()
    @IsEnum(QuestionsSortEnum)
    sort:QuestionsSortEnum

    @IsOptional()
    @IsEnum(QuestionsPriorityEnum)
    priority:QuestionsPriorityEnum
}