import { Module } from '@nestjs/common';
import { LessonSectionService } from './lesson-section.service';
import { LessonSectionController } from './lesson-section.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LessonSectionController],
  providers: [LessonSectionService],
  exports: [LessonSectionService],
})
export class LessonSectionModule {}
