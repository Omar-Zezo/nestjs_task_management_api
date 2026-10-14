import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException('Token not found');
    }

    let payload: { id: string };

    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Inavlid or expired token');
    }

    if (!payload.id) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userRepository.findOneBy({ id: payload.id });
    if (!user) throw new UnauthorizedException();

    req.user = user;

    return true;
  }
}
