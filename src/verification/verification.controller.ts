import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { sendOtpDto, verifyOtpDto } from 'src/auth/dto/dto';
import { VerificationPhoneService } from './verificationPhone.service';
import { VerificationEmailService } from './verificationEmail.service';

@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
  constructor(
    private readonly verificationPhoneService: VerificationPhoneService,
    private readonly verificationEmailService: VerificationEmailService,
  ) {}

  @Post('send')
  @ApiOperation({
    summary: 'Send OTP code',
    description:
      'Send OTP verification code to phone or email for registration or password reset',
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
    description: 'Phone/email already used or code already sent',
  })
  send(@Body() body: sendOtpDto) {
    if (body.phone) {
      return this.verificationPhoneService.sendOtp(body);
    } else if (body.email) {
      return this.verificationEmailService.sendOtp(body);
    }
    throw new Error('Phone or email is required');
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify OTP code',
    description: 'Verify OTP code sent to phone or email',
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
  verify(@Body() body: verifyOtpDto) {
    if (body.phone) {
      return this.verificationPhoneService.verifyOtp(body);
    } else if (body.email) {
      return this.verificationEmailService.verifyOtp(body);
    }
    throw new Error('Phone or email is required');
  }
}
