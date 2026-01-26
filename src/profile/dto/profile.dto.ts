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
}

export class UpdatePhoneDto {
  @ApiProperty({ example: '000000', description: 'OTP code for verification' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: '+9989',
    description: 'New phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'OldPass',
    description: 'Current password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'NewPass',
    description: 'New password',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class UpdateMentorProfileDto {
  @ApiProperty({ example: 0.2, description: 'Years of experience' })
  @IsInt()
  @IsNotEmpty()
  experience: number;

  @ApiProperty({
    example: 'software engineer',
    description: 'Current job title',
  })
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiPropertyOptional({
    example: 'IT Club mentor',
    description: 'About the mentor',
  })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({
    example: 'http',
    description: 'Telegram profile URL',
  })
  @IsUrl()
  @IsOptional()
  telegram?: string;

  @ApiPropertyOptional({
    example: 'http',
    description: 'Facebook profile URL',
  })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({
    example: 'http',
    description: 'Instagram profile URL',
  })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional({
    example: 'http',
    description: 'LinkedIn profile URL',
  })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional({
    example: 'http',
    description: 'GitHub profile URL',
  })
  @IsUrl()
  @IsOptional()
  github?: string;

  @ApiPropertyOptional({
    example: 'http',
    description: 'Personal website URL',
  })
  @IsUrl()
  @IsOptional()
  website?: string;
}

export class UpdateLastActivityDto {
  @ApiProperty({
    example: 'uuid',
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
    example: 'uuid',
    description: 'Lesson UUID',
  })
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({
    example: 'http',
    description: 'Lesson URL',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
