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
import { UserRole as PrismaUserRole } from '@prisma/client';
export { PrismaUserRole };

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

  @ApiProperty({ example: 'sardor', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: '12234',
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

export class registerWithPhoneDto {
  @ApiProperty({
    example: '+9989',
    description: 'Phone number for registration',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '1',
    description: 'OTP code received via phone',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'ali', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'pass',
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

export class registerWithEmailDto {
  @ApiProperty({
    example: 'sardor@gmail.com',
    description: 'Email address for registration',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '3',
    description: 'OTP code received via email',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'ali', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'pass',
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

export class sendEmailOtpDto {
  @ApiProperty({
    enum: EVerificationTypes,
    example: EVerificationTypes.REGISTER,
    description: 'Type of verification (register, reset_password, edit_phone)',
  })
  @IsEnum(EVerificationTypes)
  type: EVerificationTypes;

  @ApiProperty({
    example: 'sardor@gmail.com',
    description: 'Email address to send OTP',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class sendPhoneOtpDto {
  @ApiProperty({
    enum: EVerificationTypes,
    example: EVerificationTypes.REGISTER,
    description: 'Type of verification (register, reset_password, edit_phone)',
  })
  @IsEnum(EVerificationTypes)
  type: EVerificationTypes;

  @ApiProperty({
    example: '+9989',
    description: 'Phone number to send OTP',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
export class LoginDto {
  @ApiPropertyOptional({
    example: '+9989',
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

export class loginWithPhoneDto {
  @ApiProperty({
    example: '+9989',
    description: 'Phone number for login',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'pass', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'iPhone 13',
    description: 'Device name for tracking',
  })
  @IsString()
  @IsNotEmpty()
  deviceName: string;
}

export class loginWithEmailDto {
  @ApiProperty({
    example: 'sardor@gmail.com',
    description: 'Email address for login',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'pass', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'iPhone 13',
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
    example: '+9989',
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

  @ApiProperty({ example: '222', description: 'OTP code to verify' })
  @IsString()
  otp: string;
}

export class verifyEmailOtpDto {
  @ApiProperty({
    enum: EVerificationTypes,
    example: EVerificationTypes.REGISTER,
    description: 'Type of verification',
  })
  @IsEnum(EVerificationTypes)
  type: EVerificationTypes;

  @ApiProperty({
    example: 'sardor@gmail.com',
    description: 'Email address to verify',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1', description: 'OTP code to verify' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class verifyPhoneOtpDto {
  @ApiProperty({
    enum: EVerificationTypes,
    example: EVerificationTypes.REGISTER,
    description: 'Type of verification',
  })
  @IsEnum(EVerificationTypes)
  type: EVerificationTypes;

  @ApiProperty({
    example: '+9989',
    description: 'Phone number to verify',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '1', description: 'OTP code to verify' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class resetPasswordDto {
  @ApiProperty({
    example: 'fsad',
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
    example: '+9989',
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

export class resetPasswordWithPhoneDto {
  @ApiProperty({
    example: '+9989',
    description: 'Phone number for password reset',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '123456', description: 'OTP code for verification' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'newPass',
    description: 'New password for account',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class resetPasswordWithEmailDto {
  @ApiProperty({
    example: 'sardor@gmail.com',
    description: 'Email address for password reset',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1', description: 'OTP code for verification' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'newPass',
    description: 'New password for account',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
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
