import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { SignUpDto } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { ErrorResponses } from 'src/utils/enums/error-response.enum';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { appEnv } from 'src/configs/config';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(Repositories.USER_REPOSITORY)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(dto: SignUpDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { username: dto.username } });

    if (existingUser) {
      throw new BadRequestException(ErrorResponses.USERNAME_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(dto.password, appEnv.SALT_ROUNDS);
    const {id} = await this.userRepository.save({ username: dto.username, password: hashedPassword });
    const user = await this.userRepository.findOne({where: {id}, select: ['id', 'username']});
    const {token} = await this.authService.login(user);
    return {...user, token};
  }
}
