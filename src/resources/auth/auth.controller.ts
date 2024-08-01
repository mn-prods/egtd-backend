import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { AuthService, GoogleTokens } from './auth.service';
import { UserInfo } from 'firebase-admin/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('tokens')
  exchangeCodeForTokens(@Query('code') code: string) {
    return this.authService.exchangeCodeForTokens(code);
  }

  @Patch('tokens')
  refreshToken(@Body("email") email: string) {
    return this.authService.refreshToken(email);
  }
}
