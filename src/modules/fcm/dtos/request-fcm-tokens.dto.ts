import { IsNotEmpty, IsString } from "class-validator";

export class FcmTokensRequestDto {
    @IsNotEmpty()
    @IsString()
    token: string
}