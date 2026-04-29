import { Transform } from "class-transformer";
import { IsOptional, IsEnum } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { TimeRangeEnum } from "src/common/enums";

export class FeedbacksQueryDto extends PaginationRequestDto {
    @IsOptional()
    @IsEnum(TimeRangeEnum)
    time_range?: TimeRangeEnum;

    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : undefined)
    from?: Date;

    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : undefined)
    to?: Date;
}