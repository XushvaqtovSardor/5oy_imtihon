import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { 
  sendEmailOtpDto, 
  sendPhoneOtpDto, 
  verifyEmailOtpDto, 
  verifyPhoneOtpDto 
} from 'src/auth/dto/dto';
import { VerificationPhoneService } from './verificationPhone.service';
import { VerificationEmailService } from './verificationEmail.service';

@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
  constructor(
    private readonly verificationPhoneService: VerificationPhoneService,
    private readonly verificationEmailService: VerificationEmailService,
  ) {}

  @Post('email/send')
  @ApiOperation({
    summary: 'Send OTP code to email',
    description: 'Send OTP verification code to email for registration or password reset',
  })
  @ApiResponse({
    status: 201,
    description: 'OTP sent successfully',
    schema: {
      example: {
        message: 'Confirmation OTP code send',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email already used or code already sent',
  })
  sendEmailOtp(@Body() body: sendEmailOtpDto) {
    return this.verificationEmailService.sendOtp(body);
  }

  @Post('email/verify')
  @ApiOperation({
    summary: 'Verify OTP code for email',
    description: 'Verify OTP code sent to email',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      example: {
        message: 'OTP verified successfully',
        verified: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'OTP expired or invalid',
  })
  verifyEmailOtp(@Body() body: verifyEmailOtpDto) {
    return this.verificationEmailService.verifyOtp(body);
  }

  @Post('phone/send')
  @ApiOperation({
    summary: 'Send OTP code to phone',
    description: 'Send OTP verification code to phone number for registration or password reset',
  })
  @ApiResponse({
    status: 201,
    description: 'OTP sent successfully',
    schema: {
      example: {
        message: 'Confirmation OTP code send',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Phone already used or code already sent',
  })
  sendPhoneOtp(@Body() body: sendPhoneOtpDto) {
    return this.verificationPhoneService.sendOtp(body);
  }

  @Post('phone/verify')
  @ApiOperation({
    summary: 'Verify OTP code for phone',
    description: 'Verify OTP code sent to phone number',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      example: {
        message: 'OTP verified successfully',
        verified: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'OTP expired or invalid',
  })
  verifyPhoneOtp(@Body() body: verifyPhoneOtpDto) {
    return this.verificationPhoneService.verifyOtp(body);
  }
}
