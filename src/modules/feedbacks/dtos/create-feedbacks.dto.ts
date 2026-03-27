import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class FeedbacksCreateDto {
    @IsNotEmpty()
    @IsString()
    content: string

    @IsNotEmpty()
    @IsEmail()
    email: string
}