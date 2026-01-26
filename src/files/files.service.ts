import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../common/cloudinary.service';

@Injectable()
export class FilesService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadPublicFile(file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      message: 'File uploaded successfully',
      url: result,
      publicId: 'cloud-id',
    };
  }

  async uploadPrivateFile(file: Express.Multer.File, lessonId: string) {
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      message: 'Private file uploaded successfully',
      url: result,
      publicId: 'cloud-id',
      lessonId,
    };
  }

  async uploadVideo(file: Express.Multer.File, lessonId: string, hlsf: string) {
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      message: 'Video uploaded successfully',
      url: result,
      publicId: 'cloud-id',
      lessonId,
      hlsf,
    };
  }

  getPublicFile(name: string) {
    return {
      message: 'Public file access',
      filename: name,
      url: `https://res.cloudinary.com/your-cloud-name/image/upload/${name}`,
    };
  }

  getPrivateLessonFile(lessonId: string, name: string) {
    return {
      message: 'Private lesson file access',
      lessonId,
      filename: name,
      url: `https://res.cloudinary.com/your-cloud-name/raw/upload/lessons/${lessonId}/${name}`,
    };
  }

  getPrivateVideo(lessonId: string, hlsf: string) {
    return {
      message: 'Private video access',
      lessonId,
      hlsf,
      url: `https://res.cloudinary.com/your-cloud-name/video/upload/lessons/${lessonId}/${hlsf}`,
    };
  }
}
