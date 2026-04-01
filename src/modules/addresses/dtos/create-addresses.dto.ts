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

    @IsOptional()
    @IsNumber()
    latitude?: number

    @IsOptional()
    @IsNumber()
    longitude?: number
}