
import { Injectable, Inject } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repositories } from 'src/enums/repositories.enum';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
  constructor(
    @Inject(Repositories.USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
