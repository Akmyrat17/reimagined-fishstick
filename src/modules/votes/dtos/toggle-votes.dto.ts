import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { VotesTypeEnum } from "src/common/enums/votes-type.enum";

export class VotesToggleDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => value ? parseInt(value) : 1)
    vote: number

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => value ? parseInt(value) : 1)
    target_id: number

    @IsNotEmpty()
    @IsEnum(VotesTypeEnum)
    type: VotesTypeEnum
}