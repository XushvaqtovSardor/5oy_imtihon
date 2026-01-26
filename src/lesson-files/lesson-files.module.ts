import { Module } from '@nestjs/common';
import { LessonFilesService } from './lesson-files.service';
import { LessonFilesController } from './lesson-files.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LessonFilesController],
  providers: [LessonFilesService],
})
export class LessonFilesModule {}
