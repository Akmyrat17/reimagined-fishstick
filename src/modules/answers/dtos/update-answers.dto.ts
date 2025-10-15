import { IsBoolean, IsNotEmpty, IsNumber, IsOptional,  IsString } from "class-validator";

export class AnswersUpdateDto {
    @IsOptional()
    @IsString()
    content:string

    @IsOptional()
    @IsNumber()
    answered_to_id:number

    @IsOptional()
    @IsNumber()
    answered_by_id:number

    @IsOptional()
    @IsBoolean()
    is_approved:boolean
}