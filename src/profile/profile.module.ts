import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CloudinaryService } from 'src/common/cloudinary.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CloudinaryService],
  exports: [ProfileService],
})
export class ProfileModule {}
