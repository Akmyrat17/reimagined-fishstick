import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProfessionsUpdateDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    desc: string
}