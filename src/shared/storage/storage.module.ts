import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
