import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class NotificationsCreateDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    body: string;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
    user_id?: number
}