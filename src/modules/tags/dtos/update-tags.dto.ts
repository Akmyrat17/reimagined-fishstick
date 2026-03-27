import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TagsUpdateDto {
    @IsOptional()
    @IsString()
    name: string
    @IsOptional()
    @IsString()
    desc: string
}