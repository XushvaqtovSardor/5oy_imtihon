import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'sardor XX',
    description: 'Full name of the user',
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Profile image file',
  })
  image?: any;
}

export class UpdatePhoneDto {
  @ApiProperty({ example: '000000', description: 'OTP code for verification' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: '+99890112233',
    description: 'New phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'OldPassword123!',
    description: 'Current password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'New password',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class UpdateMentorProfileDto {
  @ApiProperty({ example: 3, description: 'Years of experience' })
  @IsInt()
  @IsNotEmpty()
  experience: number;

  @ApiProperty({
    example: 'Full-stack software engineer',
    description: 'Current job title',
  })
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiPropertyOptional({
    example: 'Experienced software developer...',
    description: 'About the mentor',
  })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({
    example: 'https://t.me/username',
    description: 'Telegram profile URL',
  })
  @IsUrl()
  @IsOptional()
  telegram?: string;

  @ApiPropertyOptional({
    example: 'https://facebook.com/username',
    description: 'Facebook profile URL',
  })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({
    example: 'https://instagram.com/username',
    description: 'Instagram profile URL',
  })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/username',
    description: 'LinkedIn profile URL',
  })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/username',
    description: 'GitHub profile URL',
  })
  @IsUrl()
  @IsOptional()
  github?: string;

  @ApiPropertyOptional({
    example: 'https://mywebsite.com',
    description: 'Personal website URL',
  })
  @IsUrl()
  @IsOptional()
  website?: string;
}

export class UpdateLastActivityDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Course UUID',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    example: 1,
    description: 'Group ID',
  })
  @IsInt()
  @IsNotEmpty()
  groupId: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'Lesson UUID',
  })
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({
    example: 'https://example.com/lesson',
    description: 'Lesson URL',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
