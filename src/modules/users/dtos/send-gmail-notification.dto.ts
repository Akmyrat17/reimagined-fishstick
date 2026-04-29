// src/common/dtos/send-notification.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SendGmailNotificationDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @MinLength(1)
    body: string;
}