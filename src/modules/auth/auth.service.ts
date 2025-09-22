import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt.payload';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from 'src/common/enums';
import { ManagerUsersService } from '../users/services/manager.users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private managerUsersService: ManagerUsersService,
  ) { }
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const result = await this.managerUsersService.findOneByUsername(username);
    const user = result.data;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('auth.password_not_match');
    }
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      phone_number: user.phone_number,
    };
    return { access_token: await this.jwtService.signAsync(payload) };

  }

  async signUp(signUpDto: SignUpDto) {
    const result = await this.managerUsersService.create({
      ...signUpDto,
      role: RolesEnum.USER,
    });

    const payload: JwtPayload = {
      id: result.data.id,
      username: result.data.username,
      phone_number: result.data.phone_number,
    };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
