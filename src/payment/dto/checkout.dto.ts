import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDecimal, IsEnum } from 'class-validator';
import { PaidVia } from '@prisma/client';

export class CheckoutDto {
  @ApiProperty({ description: 'Course ID to purchase' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ description: 'Amount to pay' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    enum: PaidVia,
    description: 'Payment method',
    example: 'PAYME',
  })
  @IsEnum(PaidVia)
  @IsNotEmpty()
  paidVia: PaidVia;
}
