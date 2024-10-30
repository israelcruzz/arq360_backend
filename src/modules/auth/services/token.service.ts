import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  private readonly _jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this._jwtService = jwtService;
  }

  public async generateTokenAsync(data: any) {
    return this._jwtService.signAsync(data, {
      expiresIn: '60m',
    });
  }

  public async generateToken(data: any) {
    return this._jwtService.sign(data, {
      expiresIn: '60m',
    });
  }

  public async verifyToken(token: string) {
    return this._jwtService.verify(token);
  }

  public async verifyTokenAsync(token: string) {
    return this._jwtService.verifyAsync(token);
  }

  public async generateRefreshToken(data: any) {
    return this._jwtService.sign(data, {
      expiresIn: '7d',
    });
  }
}
