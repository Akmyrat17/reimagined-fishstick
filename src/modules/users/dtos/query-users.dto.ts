import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";

export class UsersQueryDto extends PaginationRequestDto {
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : false)
    is_verified?: boolean
}