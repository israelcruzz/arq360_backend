import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
