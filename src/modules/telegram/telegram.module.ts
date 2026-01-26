import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramAuthService } from './telegram.auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [TelegramService, TelegramAuthService]
})
export class TelegramModule {}
