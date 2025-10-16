import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";

export class ClientsUpdateDto {
    @IsOptional()
    @IsString()
    company_name:string

    @IsOptional()
    @IsString()
    description:string
    
    @IsOptional()
    @IsString()
    location:string

    @IsOptional()
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