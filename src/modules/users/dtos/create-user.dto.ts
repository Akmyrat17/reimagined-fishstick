import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { RolesEnum } from 'src/common/enums';

export class CreateUserDto {
  @IsNotEmpty() @IsString() fullname: string;

  @IsString() @IsNotEmpty() password: string;

  @IsString() @IsNotEmpty() location: string;

  @IsInt() @Max(90) @Min(7) age:number
  
  @IsString() @IsNotEmpty() nickname:string
  
  @IsNotEmpty()  @IsNumber()  @Min(61000000) @Max(65999999)  phone_number: number;

  @IsString()  @IsEnum(RolesEnum) role: RolesEnum;
}
