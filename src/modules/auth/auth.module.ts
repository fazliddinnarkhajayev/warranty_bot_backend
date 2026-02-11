import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TelegramAuthService } from '../telegram/telegram.auth.service';
import { TelegramModule } from '../telegram/telegram.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    TelegramModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService
  ]
})
export class AuthModule { }
