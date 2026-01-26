import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ description: 'Device name' })
  @IsString()
  @IsNotEmpty()
  deviceName: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Full name', required: false })
  @IsString()
  fullName?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsString()
  email?: string;

  @ApiProperty({ enum: UserRole, description: 'User role', required: false })
  @IsEnum(UserRole)
  role?: UserRole;
}
