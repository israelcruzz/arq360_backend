import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';

@Module({
  imports: [SharedModule],
  controllers: [ProjectController],
  providers: [],
  exports: [],
})
export class ProjectModule {}
