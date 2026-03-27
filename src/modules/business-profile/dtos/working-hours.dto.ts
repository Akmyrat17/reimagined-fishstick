import { IsEnum, IsString, IsNotEmpty, Matches } from "class-validator";
import { WeekdaysEnum } from "src/common/enums/weekdays.enum";

export class WorkingHoursDto {
    @IsEnum(WeekdaysEnum)
    type: WeekdaysEnum;

    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Working hours must be in format HH:MM-HH:MM (e.g., 09:00-18:00)'
    })
    value: string;
}