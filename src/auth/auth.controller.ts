import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  registerDto,
  resetPasswordDto,
  LoginDto,
  RefreshTokenDto,
} from './dto/dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Register a new user account using verified phone/email. Must verify with OTP first.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered  successfully',
    schema: {
      example: {
        message: 'User successfully registered. Go to login to use website',
        user: {
          id: 1,
          phone: '+998902400025',
          email: 'user@example.com',
          fullName: 'John Doe',
          role: 'STUDENT',
          deviceName: ['iPhone 13'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Phone/email not verified or already registered',
  })
  register(@Body() dto: registerDto) {
    if (dto.phone) {
      return this.authService.registerPhone(dto);
    } else if (dto.email) {
      return this.authService.registerEmail(dto);
    }
    throw new HttpException(
      'Phone or email is required',
      HttpStatus.BAD_REQUEST,
    );
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'Login with phone/email and password to get access and refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        message: 'Login successful',
        user: {
          id: 1,
          phone: '+998902400025',
          email: 'user@example.com',
          fullName: 'John Doe',
          role: 'STUDENT',
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Get a new access token using refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        message: 'Token refreshed successfully',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.token, dto.deviceToken);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description:
      'Reset user password using verified OTP code. Must verify phone/email with OTP first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      example: { message: 'Password successfully reset' },
    },
  })
  @ApiResponse({ status: 400, description: 'Not verified or user not found' })
  resetPassword(@Body() dto: resetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
