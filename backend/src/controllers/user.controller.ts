import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { SignUpDto } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { UserService } from 'src/services/user.service';

@Controller('/api')
@UseInterceptors(new RequestInterceptor())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async create(@Body() dto: SignUpDto) {
    return await this.userService.create(dto);
  }
}
