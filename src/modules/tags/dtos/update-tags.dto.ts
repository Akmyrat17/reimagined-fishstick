import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TagsUpdateDto {
    @IsOptional()
    @IsString()
    name_en:string

    @IsOptional()
    @IsString()
    name_tk:string

    @IsOptional()
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