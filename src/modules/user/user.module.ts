import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SharedModule } from '@/shared/shared.module';
import { UserRepository } from './repositories/user.repository';
import { UserInterface } from './repositories/user.interface';
import { UserService } from './user.service';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserInterface,
      useClass: UserRepository,
    },
  ],
  exports: [],
})
export class UserModule {}
