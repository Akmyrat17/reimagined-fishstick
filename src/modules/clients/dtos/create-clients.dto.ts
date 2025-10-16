import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";

export class ClientsCreateDto {
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

    @IsOptional()
    @IsUrl()
    web_url:string

    @IsOptional()
    @IsDate()
    subscription_date:Date
}