import { Transform, Type } from "class-transformer";
import { IsOptional, IsString, IsArray, ValidateNested, IsNumber, Min, Max, Matches } from "class-validator";
import { ContactsDto } from "src/common/dto/contacts.dto";
import { WorkingHoursDto } from "./working-hours.dto";

export class BusinessProfilesUpdateDto {
    @IsOptional()
    @IsString()
    company_name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    location?: string;

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

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value ? parseFloat(value) : 0)
    @Min(-180)
    @Max(180)
    longitude?: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value ? parseFloat(value) : 0)
    @Min(-90)
    @Max(90)
    latitude?: number;

    @IsOptional()
    @IsString()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'URL must be lowercase alphanumeric with hyphens only (e.g., my-business-name)' })
    url?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tag_ids?: number[];
}