import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: number, checkoutDto: CheckoutDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: checkoutDto.courseId },
    });

    if (!course) {
      throw new NotFoundException(
        `Course with ID ${checkoutDto.courseId} not found`,
      );
    }

    const alreadyPurchased = await this.prisma.purchasedCourse.findFirst({
      where: {
        userId,
        courseId: checkoutDto.courseId,
      },
    });

    if (alreadyPurchased) {
      throw new BadRequestException('You have already purchased this course');
    }

    const purchase = await this.prisma.purchasedCourse.create({
      data: {
        userId,
        courseId: checkoutDto.courseId,
        amount: checkoutDto.amount.toString(),
        paidVia: checkoutDto.paidVia,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return {
      message: 'Course purchased successfully',
      purchase,
    };
  }
}
