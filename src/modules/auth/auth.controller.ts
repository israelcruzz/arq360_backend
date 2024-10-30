import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() data: SignInDto) {
    return this._authService.signIn(data);
  }
}
