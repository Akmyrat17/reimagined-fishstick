import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class ImagesUploadDto {
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    image_urls: string[]
}