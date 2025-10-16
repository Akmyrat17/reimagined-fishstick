import { IsBoolean, IsDate, IsNumber, IsOptional, Max, Min } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";

export class ClientsQueryDto extends PaginationRequestDto {
    @IsBoolean()
    @IsOptional()
    is_active:boolean

    @IsOptional()
    @IsNumber()
    @Max(65999999)
    @Min(61000000)
    phone_number:number

    @IsOptional()
    @IsDate()
    subscription_start:Date

    @IsOptional()
    @IsDate()
    subscription_end:Date
}