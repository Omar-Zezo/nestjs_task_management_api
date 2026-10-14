import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Method POST
  // Route /auth/register Public
  // Desc: Create new user
  @Public()
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  // Method POST
  // Route /auth/login Public
  // Desc: Login with exist user
  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
