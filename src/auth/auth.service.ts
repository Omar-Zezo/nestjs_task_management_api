import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const emailExists = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (emailExists) {
      throw new ConflictException('Email Alraedy Exist');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const createdUser = await this.userRepository.save(user);

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: dto.email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Email or password are wrong');
    }

    const decodePassword = await bcrypt.compare(dto.password, user.password);

    if (!decodePassword) {
      throw new UnauthorizedException('Email or password are wrong');
    }

    const token = await this.jwtService.signAsync({ id: user.id });
    return { token };
  }
}
