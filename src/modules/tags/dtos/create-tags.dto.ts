import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TagsCreateDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    desc: string
}