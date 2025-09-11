import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { LoginDto } from './login.dto';

export class SignUpDto extends LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @Max(65999999)
  @Min(61000000)
  @IsNumber()
  phone_number: number;
}
