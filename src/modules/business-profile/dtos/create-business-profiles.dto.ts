import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";

export class BusinessProfilesCreateDto {
    @IsNotEmpty()
    @IsString()
    company_name:string

    @IsOptional()
    @IsString()
    description:string
    
    @IsNotEmpty()
    @IsString()
    location:string

    @IsNotEmpty()
    @IsNumber()
    @Min(61000000)
    @Max(65999999)
    phone_number:number

    @IsNotEmpty()
    @IsNumber()
    @Transform(({value})=>value ? parseFloat(value) : 0)
    longitude:number

    @IsNotEmpty()
    @IsNumber()
    @Transform(({value})=>value ? parseFloat(value) : 0)
    latitude:number

    @IsOptional()
    @IsUrl()
    web_url:string

    @IsOptional()
    @IsDate()
    subscription_date:Date
}