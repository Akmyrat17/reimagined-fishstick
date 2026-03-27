import { IsOptional, IsString } from 'class-validator';
import { RolesEnum } from 'src/common/enums';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    old_password?: string

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    fullname: string

    @IsOptional()
    email: string

    @IsOptional()
    tag_ids: number[]

    @IsOptional()
    address_id: number

    @IsOptional()
    age: number

    @IsOptional()
    profession_id: number

    @IsOptional()
    role: RolesEnum

    @IsOptional()
    permission_ids: number[]
}
