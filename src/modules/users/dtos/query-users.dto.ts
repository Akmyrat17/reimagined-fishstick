import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";

export class UsersQueryDto extends PaginationRequestDto {
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : undefined)
    is_verified?: boolean

    // address id number 
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    address_id?: number;
}