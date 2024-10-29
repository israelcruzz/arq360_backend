import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { EnvModule } from './env/env.module';
import { CacheModule } from './cache/cache.module';
import { StorageModule } from './storage/storage.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [EnvModule, CacheModule, StorageModule, MailModule],
  controllers: [],
  providers: [PrismaService, EnvModule],
  exports: [PrismaService, EnvModule, CacheModule, StorageModule, MailModule],
})
export class SharedModule {}
