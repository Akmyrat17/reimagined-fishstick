import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { QuestionsPriorityEnum } from "src/common/enums";
import { CheckStatusEnum } from "src/common/enums/check-status.enum";
import { QuestionsFilterEnum } from "src/common/enums/questions-filter.enum";
import { QuestionsSortEnum } from "src/common/enums/questions-sort.enum";

export class QuestionsQueryDto extends PaginationRequestDto {
    @IsOptional()
    @IsEnum(CheckStatusEnum)
    check_status?: CheckStatusEnum

    @IsOptional()
    @IsEnum(QuestionsFilterEnum)
    filters?: QuestionsFilterEnum

    @IsOptional()
    @IsEnum(QuestionsSortEnum)
    sort?: QuestionsSortEnum

    @IsOptional()
    @IsEnum(QuestionsPriorityEnum)
    priority?: QuestionsPriorityEnum

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Transform(({ value }) => Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)])
    tag_ids?: number[];
}