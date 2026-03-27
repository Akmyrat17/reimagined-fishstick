import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
    ArrayMinSize,
    Matches,
    IsInt
} from "class-validator";
import { ContactsDto } from "src/common/dto/contacts.dto";
import { WorkingHoursDto } from "./working-hours.dto";

export class BusinessProfilesCreateDto {
    @IsNotEmpty()
    @IsString()
    company_name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContactsDto)
    contacts?: ContactsDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingHoursDto)
    working_hours?: WorkingHoursDto[];

    @IsOptional()
    @IsString()
    service?: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => value ? parseFloat(value) : 0)
    @Min(-180)
    @Max(180)
    longitude: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => value ? parseFloat(value) : 0)
    @Min(-90)
    @Max(90)
    latitude: number;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    tag_ids?: number[];
}

