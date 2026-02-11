// src/auth/auth.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Get('me')
  me(@CurrentUser() user: any) {
    return user;
  }

  @Post('mobile/telegram/session')
  telegramSessionByPhone(@Body() body: { phone: string }) {
    return this.authService.telegramSessionByPhone(body.phone);
  }

  @Post('mobile/telegram/register')
  registerTelegramUser(@Body() body: any) {
    return this.authService.registerTelegramUser(body);
  }

}
