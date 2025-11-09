import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email:string

  // @IsNotEmpty()
  // @IsString()
  // nickname: string;

  // @IsNotEmpty()
  // @IsString()
  // location: string;

  // @IsOptional()
  // @IsNumber()
  // @Transform(({value}) => value ? parseInt(value):null)
  // age: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // @IsNotEmpty()
  // @Max(65999999)
  // @Min(61000000)
  // @IsNumber()
  // phone_number: number;

  // @IsNotEmpty()
  // @IsNumber()
  // @Transform(({value}) => value ? parseInt(value):null)
  // profession_id:number
}
