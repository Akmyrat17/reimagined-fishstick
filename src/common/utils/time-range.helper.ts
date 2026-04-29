// src/common/helpers/time-range.helper.ts
import { BadRequestException } from '@nestjs/common';
import { TimeRangeEnum } from '../enums';

export function resolveTimeRange(type: TimeRangeEnum, from?: Date, to?: Date): { startDate: Date; endDate: Date } {
    const endDate = to ?? new Date();
    let startDate: Date;

    switch (type) {
        case TimeRangeEnum.TODAY:
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            break;
        case TimeRangeEnum.WEEK:
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            break;
        case TimeRangeEnum.MONTH:
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case TimeRangeEnum.CUSTOM:
            if (!from) throw new BadRequestException('from is required for custom time range');
            startDate = from;
            break;
    }

    return { startDate, endDate };
}