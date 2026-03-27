import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

export class AddressesCreateDto {
    @IsOptional()
    @IsString()
    city: string

    @IsNotEmpty()
    @IsString()
    province: string

    @IsOptional()
    @IsString()
    district: string

    @IsNotEmpty()
    @IsNumber()
    latitude?: number

    @IsNotEmpty()
    @IsNumber()
    longitude?: number
}