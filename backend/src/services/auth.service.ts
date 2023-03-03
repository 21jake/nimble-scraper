import { Inject, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repositories } from 'src/enums/repositories.enum';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Repositories.USER_REPOSITORY)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) return null;

    const validPassword = await bcrypt.compare(password, user.password);

    return validPassword ? user : null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

}
