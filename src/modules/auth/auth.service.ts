// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TelegramAuthService } from '../telegram/telegram.auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private telegramAuthService: TelegramAuthService
  ) { }

  async login(username: string, password: string) {
    const user = await this.usersService.getByUsername(username);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id, role: user.role };
    console.log(payload)
    return {
      token: this.jwtService.sign(payload, { secret: 'superStrongSecret123' }),
      user: {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
      },
    };
  }

  async telegramSessionByPhone(phone: string) {
    const phone_number = phone.toString().replace('+', '').trim();
    const res = await this.telegramAuthService.loginByPhone(phone_number);

    if (!res.success) return { status: 'NOT_FOUND' };
    const payload = { id: res.user.id, role: res.user.role, username: res.user.username };
    return {
      status: res.user.status,
      token: this.jwtService.sign(payload, { secret: 'superStrongSecret123' }),
      user: res.user
    };
  }

  async registerTelegramUser(dto: any) {
    try {
      let data: any = { status: 'REQUESTED' };

      if (dto.role == 'seller') {
        data.phone = dto.phone;
        data.first_name = dto.first_name;
        data.last_name = dto.last_name;
        data.company = dto.company;
        data.district_id = dto.district_id;
        data.region_id = dto.region_id;
        data.telegram_id = dto.telegram_id;
        data.role = dto.role;
      } else if (dto.role == 'technician') {
        data.company = dto.company;
        data.first_name = dto.first_name;
        data.last_name = dto.last_name;
        data.phone = dto.phone;
        data.district_id = dto.district_id;
        data.region_id = dto.region_id;
        data.telegram_id = dto.telegram_id;
        data.role = dto.role;
      } else if (dto.role == 'customer') {
        data.phone = dto.phone;
        data.first_name = dto.first_name;
        data.last_name = dto.last_name;
        data.district_id = dto.district_id;
        data.region_id = dto.region_id;
        data.telegram_id = dto.telegram_id;
        data.role = dto.role;
      }

      await this.telegramAuthService.createTelegramUser(data);

      return { success: true }
    }
    catch (error: any) {
      console.log('Error while registering telegram user: ', error.message)
      throw error
    }
  }
}
