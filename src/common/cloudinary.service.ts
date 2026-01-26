import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private config: ConfigService) {
    const cloudName = this.config.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.error(
        'Cloudinary configuration is missing. Please check your .env file.',
      );
      throw new HttpException(
        'Cloudinary configuration is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      this.logger.error('Upload failed: No file provided');
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    if (!file.buffer) {
      this.logger.error('Upload failed: File buffer is empty');
      throw new HttpException('File buffer is empty', HttpStatus.BAD_REQUEST);
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'profile-images',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              this.logger.error(
                `Cloudinary upload error: ${JSON.stringify(error)}`,
              );
              reject(
                new HttpException(
                  `Upload failed: ${error.message || 'Unknown error'}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            } else if (result) {
              resolve(result.secure_url);
            } else {
              this.logger.error(
                'Upload failed: No result returned from Cloudinary',
              );
              reject(
                new HttpException(
                  'Upload failed: No result returned',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(imageUrl);
      if (publicId) {
        this.logger.log(`Deleting image with public ID: ${publicId}`);
        const result = await cloudinary.uploader.destroy(publicId);
        this.logger.log(`Image deleted: ${JSON.stringify(result)}`);
      } else {
        this.logger.warn(`Could not extract public ID from URL: ${imageUrl}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting image: ${JSON.stringify(error)}`);
      throw new HttpException(
        'Failed to delete image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private extractPublicId(url: string): string | null {
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    return matches ? matches[1] : null;
  }
}
