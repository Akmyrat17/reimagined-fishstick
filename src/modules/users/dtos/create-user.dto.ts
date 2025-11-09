import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { RolesEnum } from 'src/common/enums';

export class CreateUserDto {
  @IsNotEmpty() @IsString() fullname: string;

  @IsString() @IsNotEmpty() password: string;

  @IsString() @IsOptional() location: string;

  @IsOptional() @IsInt() @Transform(({ value }) => parseInt(value)) @Max(90) @Min(7) age: number

  @IsNotEmpty() @IsEmail() email: string

  @IsString() @IsEnum(RolesEnum) role: RolesEnum;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  profession_id: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => parseInt(v))
      : [parseInt(value)]
  )
  tag_ids: number[];
}
