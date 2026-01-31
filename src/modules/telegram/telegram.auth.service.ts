import { Injectable } from '@nestjs/common';
import { SellersService } from '../sellers/sellers.service';

@Injectable()
export class TelegramAuthService {
  constructor(private sellersService: SellersService) {}

  async loginByPhone(phone: string) {
    const seller = await this.sellersService.getByPhone(phone);

    if (seller) return { success: true, user: { ...seller, role: 'seller' } };
    return { success: false };
  }

  getUserBytelegramId(telegramId: string) {
    return this.sellersService.getByTelegramId(telegramId);
  }

  setTelegramId(id: number, telegramId: string, role: string) {
    if (role === 'seller') {
      return this.sellersService.setTelegramId(id, telegramId);
    }
  }
}
