import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProfessionsCreateDto {
    @IsNotEmpty()
    @IsString()
    name_en:string

    @IsNotEmpty()
    @IsString()
    name_tk:string

    @IsNotEmpty()
    @IsString()
    name_ru:string
    

    @IsOptional()
    @IsString()
    desc_en:string

    @IsOptional()
    @IsString()
    desc_tk:string

    @IsOptional()
    @IsString()
    desc_ru:string
}