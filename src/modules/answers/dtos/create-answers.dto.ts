import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AnswersCreateDto {
    @IsNotEmpty()
    @IsString()
    content:string

    @IsNotEmpty()
    @IsNumber()
    answered_to_id:number

    @IsOptional()
    @IsNumber()
    answered_by_id:number

    @IsBoolean()
    @IsOptional()
    is_approved:boolean
}