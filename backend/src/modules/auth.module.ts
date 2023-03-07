
import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { authProviders } from 'src/providers/auth.providers';
import { AuthService } from 'src/services/auth.service';
import { UserModule } from 'src/modules/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/providers/strategies/local.strategy';
import { appEnv } from 'src/configs/config';
import { JwtStrategy } from 'src/providers/strategies/jwt.strategy';


@Module({
  imports: [DatabaseModule, PassportModule, JwtModule.register({
    secret: appEnv.JWT_KEY,
    signOptions: { expiresIn: '7d' },
  })],
  controllers: [AuthController],
  providers: [
    ...authProviders,
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AuthModule {}
