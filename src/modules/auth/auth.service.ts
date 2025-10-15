import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt.payload';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from 'src/common/enums';
import { ManagerUsersService } from '../users/services/manager.users.service';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly accesTokenSecret: string
  private readonly accesTokenTtl: string
  private readonly refreshTokenSecret: string
  private readonly refreshTokenTtl: string

  constructor(
    private jwtService: JwtService,
    private managerUsersService: ManagerUsersService,
    private configService: ConfigService,
  ) {
    this.accesTokenSecret = configService.get<string>('ACCESS_TOKEN_SECRET')
    this.accesTokenTtl = configService.get<string>('ACCESS_TOKEN_TTL')
    this.refreshTokenSecret = configService.get<string>('REFRESH_TOKEN_SECRET')
    this.refreshTokenTtl = configService.get<string>('REFRESH_TOKEN_TTL')
  }
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    try {
      const result = await this.managerUsersService.findOneByUsername(username);
      const user = result.data;

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('auth.password_not_match');
      }
      return await this.generateTokens(user)
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('auth.user_not_found');
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const result = await this.managerUsersService.create({
      ...signUpDto,
      role: RolesEnum.USER,
    });
    return await this.generateTokens(result.data)
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.decode(refreshToken);
    const user = await this.managerUsersService.findOne(payload.id);
    if (!user) throw new UnauthorizedException('User not found');
    return await this.generateTokens(user.data);
  }

  async generateTokens(user: UsersEntity) {
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      phone_number: user.phone_number,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.accesTokenSecret,
      expiresIn: this.accesTokenTtl,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenTtl,
    });
    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
