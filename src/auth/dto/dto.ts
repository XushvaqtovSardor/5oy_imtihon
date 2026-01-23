import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EVerificationTypes } from 'src/verification/dto';

export enum UserRole {
  ADMIN = 'ADMIN',
  MENTOR = 'MENTOR',
  ASSISTANT = 'ASSISTANT',
  STUDENT = 'STUDENT',
}

export class registerDto {
  @ApiPropertyOptional({
    example: '+9989',
    description: 'Phone number for registration',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'sardor@gmail.com',
    description: 'Email address for registration',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '000000',
    description: 'OTP code received via phone or email',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password (minimum 8 characters)',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.STUDENT,
    description: 'User role (default: STUDENT)',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    example: 'iPhone 13',
    description: 'Device name for tracking',
  })
  @IsString()
  @IsNotEmpty()
  deviceName: string;
}

export class sendOtpDto {
  @ApiProperty({
    enum: EVerificationTypes,
    example: EVerificationTypes.REGISTER,
    description: 'Type of verification (register, reset_password, edit_phone)',
  })
  @IsEnum(EVerificationTypes)
  type: EVerificationTypes;

  @ApiPropertyOptional({
    example: '+9989',
    description: 'Phone number to send OTP',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'sardor@gmail.com',
    description: 'Email address to send OTP',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
export class LoginDto {
  @ApiPropertyOptional({
    example: '+998952324123',
    description: 'Phone number for login',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'sardor@gmail.com',
    description: 'Email address for login',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'iphone 9',
    description: 'Device name for tracking',
  })
  @IsString()
  @IsNotEmpty()
  deviceName: string;
}
export class verifyOtpDto {
  @ApiProperty({
    enum: EVerificationTypes,
    example: EVerificationTypes.REGISTER,
    description: 'Type of verification',
  })
  @IsEnum(EVerificationTypes)
  type: EVerificationTypes;

  @ApiPropertyOptional({
    example: '+998900102003',
    description: 'Phone number to verify',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'sardor@gmail.com',
    description: 'Email address to verify',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '123456', description: 'OTP code to verify' })
  @IsString()
  otp: string;
}

export class resetPasswordDto {
  @ApiProperty({
    example: 'passwordNew',
    description: 'New password for account',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '123456', description: 'OTP code for verification' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiPropertyOptional({
    example: '+998901122333',
    description: 'Phone number for password reset',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'sardor032@gmail.com',
    description: 'Email address for password reset',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'token',
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'refreshToken',
    description: 'Device token',
  })
  @IsString()
  @IsNotEmpty()
  deviceToken: string;
}
