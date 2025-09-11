import { IsNumber, Min, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class PaginationRequestDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => value ? parseInt(value) : 1)
    page: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => value ? parseInt(value) : 10)
    limit: number = 10;

    @IsOptional()
    @IsString()
    keyword?: string;
}
