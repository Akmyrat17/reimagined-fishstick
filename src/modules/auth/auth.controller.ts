import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Response } from 'express';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.appLogin(loginDto);
  }

  @Post('manager/login')
  @HttpCode(HttpStatus.OK)
  managerLogin(@Body() loginDto: LoginDto) {
    return this.authService.managerLogin(loginDto);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    const url = await this.authService.verifyEmail(token);
    return res.redirect(url)
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Res() res: Response) {
    const url = await this.authService.resetPassword(dto);
    return res.redirect(url)
  }
}