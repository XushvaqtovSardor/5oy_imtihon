import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryService } from '../common/cloudinary.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, CloudinaryService],
})
export class FilesModule {}
