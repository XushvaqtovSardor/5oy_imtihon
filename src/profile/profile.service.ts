import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary.service';
import { RedisService } from 'src/redis/redis.service';
import * as bcrypt from 'bcrypt';
import {
  UpdateProfileDto,
  UpdatePhoneDto,
  UpdatePasswordDto,
  UpdateMentorProfileDto,
  UpdateLastActivityDto,
} from './dto/profile.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private redis: RedisService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        image: true,
        role: true,
        deviceName: true,
        createdAt: true,
        mentorProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    this.logger.log(`Updating profile for user ${userId}`);

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`User not found: ${userId}`);
      throw new UnauthorizedException('User not found');
    }

    const updateData: any = {};

    if (dto.fullName) {
      updateData.fullName = dto.fullName;
      this.logger.log(`Updating fullName to: ${dto.fullName}`);
    }

    if (file) {
      this.logger.log(`Processing image upload for user ${userId}`);
      this.logger.log(
        `File details: name=${file.originalname}, size=${file.size}, mimetype=${file.mimetype}`,
      );

      try {
        if (user.image) {
          this.logger.log(`Deleting old image: ${user.image}`);
          await this.cloudinary.deleteImage(user.image);
        }

        const imageUrl = await this.cloudinary.uploadImage(file);
        updateData.image = imageUrl;
        this.logger.log(`Image uploaded successfully: ${imageUrl}`);
      } catch (error) {
        this.logger.error(`Failed to upload image: ${JSON.stringify(error)}`);
        throw new HttpException(
          `Failed to upload image: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        image: true,
        role: true,
      },
    });

    this.logger.log(`Profile updated successfully for user ${userId}`);

    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  async getLastActivity(userId: number) {
    const activity = await this.prisma.lastActivity.findUnique({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return activity || { message: 'No activity found' };
  }

  async updateLastActivity(userId: number, dto: UpdateLastActivityDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const activity = await this.prisma.lastActivity.upsert({
      where: { userId },
      update: {
        courseId: dto.courseId,
        lessonId: dto.lessonId,
        url: dto.url,
      },
      create: {
        userId,
        courseId: dto.courseId,
        lessonId: dto.lessonId,
        url: dto.url,
      },
    });

    return {
      message: 'Last activity updated successfully',
      activity,
    };
  }

  async updatePhone(userId: number, dto: UpdatePhoneDto) {
    const confirmationKey = `edph_cfm_${dto.phone}`;
    const verified = await this.redis.get(confirmationKey);

    if (!verified) {
      throw new HttpException(
        'Phone not verified or verification expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.prisma.users.findFirst({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new HttpException('Phone already in use', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: { phone: dto.phone },
    });

    await this.redis.del(confirmationKey);

    return {
      message: 'Phone number updated successfully',
    };
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPassword = await bcrypt.compare(dto.password, user.password);
    if (!isPassword) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = 10;
    const hashPas = await bcrypt.hash(dto.newPassword, salt);

    await this.prisma.users.update({
      where: { id: userId },
      data: { password: hashPas },
    });

    return {
      message: 'Password updated successfully',
    };
  }

  async updateMentorProfile(userId: number, dto: UpdateMentorProfileDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: { mentorProfile: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.role !== 'MENTOR') {
      throw new ForbiddenException('Only mentors can update mentor profile');
    }

    const mentorProfile = await this.prisma.mentorProfile.upsert({
      where: { userId },
      update: {
        experience: dto.experience,
        job: dto.job,
        about: dto.about,
        telegram: dto.telegram,
        facebook: dto.facebook,
        linkedIn: dto.linkedin,
        github: dto.github,
        website: dto.website,
      },
      create: {
        userId,
        experience: dto.experience,
        job: dto.job,
        about: dto.about,
        telegram: dto.telegram,
        facebook: dto.facebook,
        linkedIn: dto.linkedin,
        github: dto.github,
        website: dto.website,
      },
    });

    return {
      message: 'Mentor profile updated successfully',
      mentorProfile,
    };
  }
}
