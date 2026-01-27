import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramAuthService {
  constructor(private usersService: UsersService) {}

  async loginByPhone(phone: string) {
    const user = await this.usersService.getByPhone(phone);

    if (!user) {
      return { success: false };
    }

    return { success: true, user };
  }

  getUserBytelegramId(telegramId: string) {
    return this.usersService.getByTelegramId(telegramId);
  }
}
