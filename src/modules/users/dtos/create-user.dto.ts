import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { RolesEnum } from 'src/common/enums';

export class CreateUserDto {
  @ApiProperty({
    example: 'Akmyrat',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'Akmyrat',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 63440486,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(61000000)
  @Max(65999999)
  phone_number: number;

  @ApiProperty({
    example: 'user',
  })
  @IsString()
  @IsEnum(RolesEnum)
  role: RolesEnum;
}
