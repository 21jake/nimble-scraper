import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { appEnv } from 'src/configs/config';
import { UserController } from 'src/controllers/user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/providers/user.providers';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: appEnv.JWT_KEY,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserController],
  providers: [...userProviders, UserService, AuthService],
})
export class UserModule {}
