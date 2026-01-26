import {
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/auth/dto/dto';
import {
  UpdateProfileDto,
  UpdatePhoneDto,
  UpdatePasswordDto,
  UpdateMentorProfileDto,
  UpdateLastActivityDto,
} from './dto/profile.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get profile information of the logged-in user',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      example: {
        id: 1,
        phone: '+9989',
        email: 'sardor@gmail.com',
        fullName: 'ali',
        image: 'f',
        role: 'STUDENT',
        deviceName: ['iPhone 13'],
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return this.profileService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update fullName and/or profile image',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        message: 'Profile updated successfully',
        user: {
          id: 1,
          phone: '+9989',
          email: 's@gmail.com',
          fullName: 'FullName',
          image: 'url',
          role: 'STUDENT',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(
    @Request() req,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateProfile(req.user.sub, dto, file);
  }

  @Get('last-activity')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'STUDENT',
    description: 'Get last learning activity of the student',
  })
  @ApiResponse({
    status: 200,
    description: 'Last activity retrieved successfully',
    schema: {
      example: {
        id: 1,
        userId: 1,
        courseId: 'uuid',
        groupId: 1,
        lessonId: 'uuid',
        url: 'url',
        course: {
          id: 'uuid',
          name: 'JavaScript',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Students only' })
  getLastActivity(@Request() req) {
    return this.profileService.getLastActivity(req.user.sub);
  }

  @Put('last-activity')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'STUDENT',
    description: 'Update last learning activity',
  })
  @ApiResponse({
    status: 200,
    description: 'Last activity updated successfully',
    schema: {
      example: {
        message: 'Last activity updated successfully',
        activity: {
          id: 1,
          userId: 1,
          courseId: 'uuid',
          groupId: 1,
          lessonId: 'uuid',
          url: 'url',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Students only' })
  updateLastActivity(@Request() req, @Body() dto: UpdateLastActivityDto) {
    return this.profileService.updateLastActivity(req.user.sub, dto);
  }

  @Post('phone/update')
  @ApiOperation({
    summary: 'Update phone number',
    description: 'Update phone number with OTP verification',
  })
  @ApiResponse({
    status: 200,
    description: 'Phone number updated successfully',
    schema: {
      example: {
        message: 'Phone number updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Phone not verified or already in use',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updatePhone(@Request() req, @Body() dto: UpdatePhoneDto) {
    return this.profileService.updatePhone(req.user.sub, dto);
  }

  @Patch('password/update')
  @ApiOperation({
    summary: 'Update password',
    description: 'Change user password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    schema: {
      example: {
        message: 'Password updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Current password is incorrect',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
    return this.profileService.updatePassword(req.user.sub, dto);
  }

  @Patch('mentor-profile')
  @Roles(UserRole.MENTOR)
  @ApiOperation({
    summary: 'MENTOR',
    description: 'Update mentor-specific profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentor profile updated successfully',
    schema: {
      example: {
        message: 'Mentor profile updated successfully',
        mentorProfile: {
          id: 1,
          userId: 1,
          experience: 3,
          job: 's',
          about: 's',
          telegram: 's',
          facebook: 's',
          linkedIn: 's',
          github: 's',
          website: 's',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Mentors only' })
  updateMentorProfile(@Request() req, @Body() dto: UpdateMentorProfileDto) {
    return this.profileService.updateMentorProfile(req.user.sub, dto);
  }
}
