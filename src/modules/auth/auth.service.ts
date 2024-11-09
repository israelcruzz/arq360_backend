import { Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { UserInterface } from '../user/repositories/user.interface';
import * as bcrypt from 'bcrypt';
import { TokenService } from './services/token.service';

@Injectable()
export class AuthService {
  private readonly _tokenService: TokenService;
  private readonly _userService: UserInterface;

  constructor(tokenService: TokenService, userService: UserInterface) {
    this._tokenService = tokenService;
    this._userService = userService;
  }

  public async signIn(data: SignInDto) {
    const { email, password } = data;

    const userExists = await this._userService.getUserByEmail(email);

    if (!userExists) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, userExists.password);

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const payload = { sub: userExists.id };
    const accessToken = await this._tokenService.generateToken(payload);
    const refreshToken = await this._tokenService.generateRefreshToken(payload);

    await this._userService.saveRefreshToken(userExists.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
