import { Controller, Get, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';

import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { AuthService } from 'src/services/auth.service';

@Controller('/api')
@UseInterceptors(new RequestInterceptor())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): User {
    const user = req.user as User;
    return user;
  }
}
