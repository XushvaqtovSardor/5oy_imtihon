import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import {
  registerWithPhoneDto,
  registerWithEmailDto,
  resetPasswordWithPhoneDto,
  resetPasswordWithEmailDto,
  loginWithPhoneDto,
  loginWithEmailDto,
  RefreshTokenDto,
} from './dto/dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/phone')
  @ApiOperation({
    summary: 'Register new user with phone',
    description:
      'Register a new user account using verified phone number. Must verify phone with OTP first.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'User successfully registered Go to login to use website',
        user: {
          id: 1,
          phone: '+9989',
          fullName: 'f',
          role: 'STUDENT',
          deviceName: ['iPhone 13'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Phone not verified or already registered',
  })
  registerWithPhone(@Body() dto: registerWithPhoneDto) {
    return this.authService.registerPhone(dto);
  }

  @Post('register/email')
  @ApiOperation({
    summary: 'Register new user with email',
    description:
      'Register a new user account using verified email. Must verify email with OTP first.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'User successfully registered Go to login to use website',
        user: {
          id: 1,
          email: 'sardor@gmail.com',
          fullName: 'f',
          role: 'STUDENT',
          deviceName: ['iPhone 13'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email not verified or already registered',
  })
  registerWithEmail(@Body() dto: registerWithEmailDto) {
    return this.authService.registerEmail(dto);
  }

  @Post('login/phone')
  @ApiOperation({
    summary: 'User login with phone',
    description:
      'Login with phone number and password to get access and refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        message: 'Login successful',
        user: {
          id: 1,
          phone: '+9989',
          fullName: 'f',
          role: 'STUDENT',
        },
        accessToken: 'e',
        refreshToken: 'e',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginWithPhone(
    @Body() dto: loginWithPhoneDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginPhone(dto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('login/email')
  @ApiOperation({
    summary: 'User login with email',
    description:
      'Login with email and password to get access and refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        message: 'Login successful',
        user: {
          id: 1,
          email: 'user@example.com',
          fullName: 'f',
          role: 'STUDENT',
        },
        accessToken: 'e',
        refreshToken: 'e',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginWithEmail(
    @Body() dto: loginWithEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginEmail(dto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('refreshToken')
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
        accessToken: 'e',
        refreshToken: 'e',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Req() req: Request, @Body() dto: RefreshTokenDto) {
    const refreshToken = req.cookies?.refreshToken || dto.token;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    return this.authService.refreshToken(refreshToken, dto.deviceToken);
  }

  @Post('resetPassword/phone')
  @ApiOperation({
    summary: 'Reset password with phone',
    description:
      'Reset user password using verified phone OTP code. Must verify phone with OTP first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      example: { message: 'Password successfully reset' },
    },
  })
  @ApiResponse({ status: 400, description: 'Not verified or user not found' })
  resetPasswordWithPhone(@Body() dto: resetPasswordWithPhoneDto) {
    return this.authService.resetPasswordPhone(dto);
  }

  @Post('resetPassword/email')
  @ApiOperation({
    summary: 'Reset password with email',
    description:
      'Reset user password using verified email OTP code. Must verify email with OTP first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      example: { message: 'Password successfully reset' },
    },
  })
  @ApiResponse({ status: 400, description: 'Not verified or user not found' })
  resetPasswordWithEmail(@Body() dto: resetPasswordWithEmailDto) {
    return this.authService.resetPasswordEmail(dto);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Clear refresh token cookie and logout user',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    schema: {
      example: { message: 'Logged out successfully' },
    },
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logged out successfully' };
  }
}
