import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (req.url.includes('login')) return true

    if (!authHeader) throw new UnauthorizedException('Token required');

    const token = authHeader.split(' ')[1];

    if (!token) throw new UnauthorizedException('Token malformed');

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'superStrongSecret123');

      req.user = { id: payload['sub'], username: payload['username'] }; // qo‘lda user o‘rnatish
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token invalid');
    }
  }
}
