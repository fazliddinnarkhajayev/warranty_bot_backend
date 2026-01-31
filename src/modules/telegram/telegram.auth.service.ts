import { Injectable } from '@nestjs/common';
import { CustomersRepository } from 'src/shared/repositories/customers.repository';
import { SellersService } from '../sellers/sellers.service';

@Injectable()
export class TelegramAuthService {
  constructor(
    private sellersService: SellersService,
    private customersRepository: CustomersRepository
  ) { }

  async loginByPhone(phone: string) {
    const seller = await this.sellersService.getByPhone(phone);

    if (seller) return { success: true, user: { ...seller, role: 'seller' } };

    const customer = await this.customersRepository.findByPhone(phone);
    if (customer) return { success: true, user: { ...customer, role: 'customer' } }
    return { success: false };
  }

  async getUserBytelegramId(telegramId: string) {
    const seller = await this.sellersService.getByTelegramId(telegramId)
    if (seller) {
      return { ...seller, role: 'seller' };
    }
    const customer = await this.customersRepository.findByTelegramId(telegramId);
    if (customer) {
      return { ...customer, role: 'customer' };
    }
    return null;
  }

  setTelegramId(id: number, telegramId: string, role: string) {
    if (role === 'seller') {
      return this.sellersService.setTelegramId(id, telegramId);
    } else if (role === 'customer') {
      return this.customersRepository.setTelegramId(id, telegramId);
    }
  }
}
