import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt.payload';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from 'src/common/enums';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from '../users/entities/user.entity';
import { UsersRepository } from '../users/repositories/users.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { GmailHelper } from 'src/common/utils/gmail.helper';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly accesTokenSecret: string
  private readonly accesTokenTtl: string
  private readonly refreshTokenSecret: string
  private readonly refreshTokenTtl: string

  private readonly appUrl: string
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersRepository:UsersRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.accesTokenSecret = configService.get<string>('ACCESS_TOKEN_SECRET')
    this.accesTokenTtl = configService.get<string>('ACCESS_TOKEN_TTL')
    this.refreshTokenSecret = configService.get<string>('REFRESH_TOKEN_SECRET')
    this.refreshTokenTtl = configService.get<string>('REFRESH_TOKEN_TTL')
    this.appUrl = configService.get<string>('APP_URL')
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    try {
      const result = await this.usersRepository.getUserByEmail(email);
      if(!result) throw new NotFoundException("Email or password is incorrect")
        console.log(result)
      const isMatch = await bcrypt.compare(password, result.password);
      if (!isMatch) throw new UnauthorizedException('Email or password is incorrect');
      const tokens = await this.generateTokens(result)
      // if(!result.is_verified) await this.sendVerificationToken(result.email)
      return {tokens,result}
    } catch (error) {
      console.log(error)    
      throw new BadRequestException(error.message || error.details)
    }
  }

    async signUp(signUpDto: SignUpDto) {
      const user = await this.usersRepository.getUserByEmail(signUpDto.email)
      if(user) throw new BadRequestException('User with this email already exists')
      const hashedPassword = await bcrypt.hash(signUpDto.password, 10)
      const newUser = new UsersEntity({
        fullname:signUpDto.fullname,
        email:signUpDto.email,
        password:hashedPassword,
        role:RolesEnum.USER
      })
      const saved = await this.usersRepository.save(newUser)
      const tokens = await this.generateTokens(saved)
      await this.sendVerificationToken(saved.email)
      return {tokens,saved}
    }

  async refreshToken(refreshToken: string) {
    const payload:JwtPayload = this.jwtService.decode(refreshToken);
    const user = await this.usersRepository.findOne({where:{id:payload.id}});
    if (!user) throw new UnauthorizedException('User not found');
    return await this.generateTokens(user);
  }

  async generateTokens(user: UsersEntity) {
    const payload: JwtPayload = { id: user.id, fullname: user.fullname, };
    const accessToken = await this.jwtService.signAsync(payload, {secret: this.accesTokenSecret,    expiresIn: this.accesTokenTtl});
    const refreshToken = await this.jwtService.signAsync(payload, { secret: this.refreshTokenSecret,expiresIn: this.refreshTokenTtl,  });
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async verifyEmail(token:string){
    const email = await this.cacheManager.get<string>(`verify:${token}`);
    if(!email) throw new UnauthorizedException('Expired or invalid token')
    const user = await this.usersRepository.getUserByEmail(email);
    if(!user) throw new UnauthorizedException('User not found')
    user.is_verified = true
    await this.usersRepository.save(user)
    await this.cacheManager.del(`verify:${token}`)
    return { message: 'Email verified successfully' };
  }

  private async sendVerificationToken(email:string){
    try {
      const verificationToken = uuidv4()
      await this.cacheManager.set(`verify:${verificationToken}`,email, 1000 * 60 * 10);
      const verificationUrl = `${this.appUrl}/api/v1/auth/verify-email/${verificationToken}`;
      await GmailHelper.SendVerificationEmail(email, verificationUrl);
      return { message: 'Verification email sent. Please check your inbox.' };
    } catch (error) {
      throw new InternalServerErrorException(error.details || error.message)
    }
}
}