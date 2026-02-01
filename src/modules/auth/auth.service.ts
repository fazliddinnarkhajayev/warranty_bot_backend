// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(username: string, password: string) {
    const user = await this.usersService.getByUsername(username);

    console.log(user.password, password)
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
}
