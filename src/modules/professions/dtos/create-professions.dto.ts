import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProfessionsCreateDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    desc: string
}