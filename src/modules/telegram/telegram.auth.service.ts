import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomersRepository } from 'src/shared/repositories/customers.repository';
import { SellersService } from '../sellers/sellers.service';
import { TechniciansService } from '../technicians/technicians.service';

@Injectable()
export class TelegramAuthService {
  constructor(
    private sellersService: SellersService,
    private customersRepository: CustomersRepository,
    private techniciansService: TechniciansService
  ) { }

  async loginByPhone(phone: string) {
    const seller = await this.sellersService.getByPhone(phone);

    if (seller) return { success: true, user: { ...seller, role: 'seller' } };

    const customer = await this.customersRepository.findByPhone(phone);
    if (customer) return { success: true, user: { ...customer, role: 'customer' } }

    const tech = await this.techniciansService.getByPhone(phone);
    if (tech) return { success: true, user: { ...tech, role: 'technician' } }

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

    const tech = await this.techniciansService.getByTelegramId(telegramId);
    if (tech) {
      return { ...tech, role: 'technician' }
    }

    return null;
  }

  setTelegramId(id: number, telegramId: string, role: string) {
    if (role === 'seller') {
      return this.sellersService.setTelegramId(id, telegramId);
    } else if (role === 'customer') {
      return this.customersRepository.setTelegramId(id, telegramId);
    } else if (role === 'technician') {
      return this.techniciansService.setTelegramId(id, telegramId);
    }
  }

  createTelegramUser(data: any) {
    if (data.role == 'seller') {
      delete data.role;
      return this.sellersService.create(data);
    } else if (data.role == 'customer') {
      delete data.role;
      return this.customersRepository.create(data)
    } else if (data.role == 'technician') {
      delete data.role;
      return this.techniciansService.create(data);
    }
    throw new InternalServerErrorException()

  }
}
