import {
    IsAlphanumeric,
    IsLowercase, IsString,
    Length
} from 'class-validator';
import { Match } from 'src/dto/decorators/match.decorator';

export class SignUpDto {
  @IsAlphanumeric()
  @IsLowercase()
  @Length(4, 20)
  username: string;

  @IsString()
  @Length(4, 20)
  password: string;

  @Match('password')
  confirmPassword: string;
}
