import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt.payload';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from 'src/common/enums';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from '../users/entities/users.entity';
import { UsersRepository } from '../users/repositories/users.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { GmailHelper } from 'src/common/utils/gmail.helper';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly accesTokenSecret: string;
  private readonly accesTokenTtl: string;
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenTtl: string;

  private readonly appUrl: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersRepository: UsersRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.accesTokenSecret = configService.get<string>('ACCESS_TOKEN_SECRET');
    this.accesTokenTtl = configService.get<string>('ACCESS_TOKEN_TTL');
    this.refreshTokenSecret = configService.get<string>('REFRESH_TOKEN_SECRET');
    this.refreshTokenTtl = configService.get<string>('REFRESH_TOKEN_TTL');
    this.appUrl = configService.get<string>('APP_URL');
  }

  async login(loginDto: LoginDto, allowedRoles?: RolesEnum[]) {
    const { email, password } = loginDto;
    const result = await this.usersRepository.getUserByEmail(email);
    if (!result)
      throw new BadRequestException('User not found');
    if (result.is_blocked === true) throw new BadRequestException('Current user blocked by admins')
    // If allowedRoles is provided, check if user's role is allowed
    if (allowedRoles && !allowedRoles.includes(result.role))
      throw new ForbiddenException('You are not allowed to enter this');

    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch)
      throw new UnauthorizedException('Email or password is incorrect');

    if (!result.is_verified) {
      const text = await this.sendVerificationToken(result.email);
      throw new UnauthorizedException(text);
    }

    const tokens = await this.generateTokens(result);
    return { tokens, result };

  }

  async appLogin(dto: LoginDto) {
    return await this.login(dto, [RolesEnum.USER, RolesEnum.ADMIN])
  }

  async managerLogin(dto: LoginDto) {
    return await this.login(dto, [RolesEnum.ADMIN, RolesEnum.MODERATOR])
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.usersRepository.getUserByEmail(signUpDto.email);
    if (user)
      throw new BadRequestException('User with this email already exists');
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const newUser = new UsersEntity({ fullname: signUpDto.fullname, email: signUpDto.email, password: hashedPassword, role: RolesEnum.USER });
    const saved = await this.usersRepository.save(newUser);
    await this.sendVerificationToken(saved.email);
    return { message: "Successfully created user, Now verify your email" };
  }

  async refreshToken(refreshToken: string) {
    const payload: JwtPayload = this.jwtService.decode(refreshToken);
    const user = await this.usersRepository.findOne({
      where: { id: payload.id },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const tokens = await this.generateTokens(user);
    return { tokens, user };
  }

  async generateTokens(user: UsersEntity) {
    const payload: JwtPayload = { id: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.accesTokenSecret,
      expiresIn: this.accesTokenTtl,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenTtl,
    });

    // Decode tokens to get expiration times
    const accessDecoded = this.jwtService.decode(accessToken) as JwtPayload & {
      exp: number;
    };
    const refreshDecoded = this.jwtService.decode(
      refreshToken,
    ) as JwtPayload & { exp: number };

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_at: accessDecoded.exp,
      refresh_token_expires_at: refreshDecoded.exp,
    };
  }

  async verifyEmail(token: string) {
    const email = await this.cacheManager.get<string>(`verify:${token}`);
    if (!email) return this.configService.get('BASE_URL') + '/auth/login'
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) return this.configService.get('BASE_URL') + '/auth/login'
    user.is_verified = true;
    await this.usersRepository.save(user);
    await this.cacheManager.del(`verify:${token}`);
    return this.configService.get('BASE_URL') + '/auth/login?email=' + email
  }

  async sendResetVerification(email: string) {
    const user = await this.usersRepository.getUserByEmail(email)
    if (!user) throw new NotFoundException('User not found')

    const existing = await this.cacheManager.get(`reset:pending:${email}`)
    if (existing) return { message: 'Reset email already sent. Please check your inbox.' }

    const token = uuidv4()
    await this.cacheManager.set(`reset:${token}`, email, 1000 * 60 * 5) // 5 minutes
    await this.cacheManager.set(`reset:pending:${email}`, token, 1000 * 60 * 5) // same TTL to prevent multiple requests

    user.is_verified = false
    await this.usersRepository.save(user)

    const resetUrl = `${this.appUrl}/auth/verify-reset/${token}`
    await GmailHelper.SendPasswordResetEmail(email, resetUrl)

    return { message: 'Reset verification email sent. Please check your inbox.' }

  }

  async verifyReset(token: string) {
    const email = await this.cacheManager.get<string>(`reset:${token}`)
    if (!email) {
      const loginUrl = this.configService.get('BASE_URL')
      return `${loginUrl}/auth/login`
    }

    const user = await this.usersRepository.getUserByEmail(email)
    if (!user) throw new UnauthorizedException('User not found')

    user.is_verified = true
    await this.usersRepository.save(user)

    await this.cacheManager.del(`reset:pending:${email}`)

    const frontendUrl = this.configService.get('BASE_URL')
    return `${frontendUrl}/auth/reset-password?token=${token}`

  }

  // async checkResetVerification(email: string) {
  //   try {
  //     const user = await this.usersRepository.getUserByEmail(email)
  //     if (!user) throw new NotFoundException('User not found')

  //     const pending = await this.cacheManager.get(`reset:pending:${email}`)
  //     return { verified: !pending }
  //   } catch (error: any) {
  //     console.log(error)
  //     throw new BadRequestException(error.message || error.details)
  //   }
  // }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.password !== dto.confirm_password)
      throw new BadRequestException('Passwords do not match')

    const email = await this.cacheManager.get<string>(`reset:${dto.token}`)
    if (!email) throw new UnauthorizedException('Expired or invalid token')

    const user = await this.usersRepository.getUserByEmail(email)
    if (!user) throw new NotFoundException('User not found')

    user.password = await bcrypt.hash(dto.password, 10)
    await this.usersRepository.save(user)

    await this.cacheManager.del(`reset:${dto.token}`) // cleanup now

    return { message: 'Password reset successfully.' }

  }

  private async sendVerificationToken(email: string) {
    try {
      // Check if token already exists for this email
      const existingToken = await this.cacheManager.get<string>(`verify:pending:${email}`);
      if (existingToken) return { message: 'Verification email was already sent. Please check your inbox.' };

      const verificationToken = uuidv4();
      await this.cacheManager.set(`verify:${verificationToken}`, email, 1000 * 60 * 5); // 5 minutes
      await this.cacheManager.set(`verify:pending:${email}`, verificationToken, 1000 * 60 * 5); // same TTL
      const verificationUrl = `${this.appUrl}/auth/verify-email/${verificationToken}`;
      await GmailHelper.SendVerificationEmail(email, verificationUrl);
      return { message: 'Verification email sent. Please check your inbox.' };
    } catch (error: any) {
      throw new InternalServerErrorException(error.details || error.message);
    }
  }
}