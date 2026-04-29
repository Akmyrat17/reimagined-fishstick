// src/common/dtos/time-range.dto.ts
import { IsEnum, IsDateString, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { TimeRangeEnum } from '../enums';



export class TimeRangeDto {
    @IsEnum(TimeRangeEnum)
    time_range: TimeRangeEnum;

    @ValidateIf((o) => o.time_range === TimeRangeEnum.CUSTOM)
    @Transform(({ value }) => value ? new Date(value) : undefined)
    from?: Date;

    @ValidateIf((o) => o.time_range === TimeRangeEnum.CUSTOM)
    @Transform(({ value }) => value ? new Date(value) : undefined)
    to?: Date;
}