import { Module } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { CacheInterface } from './cache.interface';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: CacheInterface,
      useClass: RedisService,
    },
  ],
  exports: [CacheInterface],
})
export class CacheModule {}
