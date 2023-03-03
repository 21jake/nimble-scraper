import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignUpDto } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';

@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async findAll() {
    return await this.userService.findAll();
  }

  @Post('/signup')
  async create(@Body() dto: SignUpDto) {
    return await this.userService.create(dto);
  }
}
