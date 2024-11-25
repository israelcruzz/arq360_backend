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

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken() {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public async forgotPassword(@Body('email') email: string) {
    return this._authService.forgotPassword(email);
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  public async verifyCode(@Body() data: { code: string; email: string }) {
    return this._authService.verifyCode(data.code, data.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(
    @Body() data: { email: string; newPassword: string },
  ) {
    return this._authService.resetPassword(data);
  }
}
