import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/auth/dto/dto';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('Payment')
@Controller('api')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('payment/checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'STUDENT' })
  @ApiResponse({ status: 201, description: 'Course purchased successfully' })
  @ApiResponse({
    status: 400,
    description: 'Already purchased or invalid data',
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async checkout(@Request() req, @Body() checkoutDto: CheckoutDto) {
    return this.paymentService.checkout(req.user.sub, checkoutDto);
  }
}
