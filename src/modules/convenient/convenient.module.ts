import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { ConvenientController } from './convenient.controller';

@Module({
  imports: [SharedModule],
  controllers: [ConvenientController],
  providers: [],
  exports: [],
})
export class ConvenientModule {}
