import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './shared/env/env';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { ConvenientModule } from './modules/convenient/convenient.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => envSchema] }),
    SharedModule,
    UserModule,
    AuthModule,
    ClientModule,
    ConvenientModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
