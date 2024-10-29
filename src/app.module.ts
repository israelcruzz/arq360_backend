import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './shared/env/env';

@Module({
  imports: [
    SharedModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, load: [() => envSchema] }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
