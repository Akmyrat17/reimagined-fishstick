import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";

export class BusinessProfilesUpdateDto {
    @IsOptional()
    @IsString()
    company_name: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    location: string

    @IsOptional()
    @IsNumber()
    @Min(61000000)
    @Max(65999999)
    phone_number: number

    @IsOptional()
    // @IsNotEmpty()
    @IsUrl()
    web_url: string

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value ? parseFloat(value) : 0)
    longitude: number

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value ? parseFloat(value) : 0)
    latitude: number

    @IsOptional()
    @IsDate()
    subscription_date: Date
}