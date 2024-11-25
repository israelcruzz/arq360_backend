import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';

@Module({
  imports: [SharedModule],
  controllers: [ClientController],
  providers: [],
  exports: [],
})
export class ClientModule {}
